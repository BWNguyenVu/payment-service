import payosClient from "../Config/Payos";
import PayosResponseModel from "../dto/Payos/Responses/PayosResponseModel";
import { StatusCodeEnums } from "../enums/StatusCodeEnums";
import { CoreException } from "../exceptions/CoreException";
import { CheckoutRequestType } from "@payos/node/lib/type";
import PaymentModel from "../models/PayosModel"
import { scheduleExpired } from "../utils/PaymentScheduler";
const jwt = require("jsonwebtoken");

const returnUrl = process.env.PAYMENT_RETURN_URL
const secretKey = process.env.APP_JWT_SECRET;
const expiresIn = process.env.APP_EXPIRE_TOKEN;

export class PayosService {
    async createPaymentLink(data: any, totalPrice: number): Promise<Object | CoreException> {
        const tokenPayload = { courseId: data.courses, account: data.account.email, orderId: data.id };
        console.log(tokenPayload)
        const newToken = jwt.sign( tokenPayload, secretKey, { expiresIn: expiresIn });  
        const returnUrlWithToken = `${returnUrl}?token=${newToken}`;

        const now = Math.floor(Date.now() / 1000);
        const expirationTime : number = now + 15 * 60; //time 15m'
        
        const payosData : CheckoutRequestType = {
            orderCode: Number(String(new Date().getTime()).slice(-6)),
            amount: totalPrice ,
            description: data.description || " hello bro ",
            expiredAt: expirationTime,
            cancelUrl: returnUrlWithToken ,
            returnUrl: returnUrlWithToken,
            signature: data.signature,
          };

        const buyerData = {
            buyerName: data.buyerName, 
            buyerPhone: data.buyerPhone,
            buyerEmail: data.buyerEmail,
        }
        try {          
            const paymentLinkRes: any = await payosClient.createPaymentLink(payosData); 
            paymentLinkRes._id = data.id;
            const paymentData = { ...paymentLinkRes, ...buyerData };
            await PaymentModel.create(paymentData)

            scheduleExpired( data.id, 15 * 60 * 1000 ); // 15 minutes in milliseconds

            console.log("Service payment handler success ID: ", data.id)
            return new PayosResponseModel(
                "Create Payos Payment Successful",
                StatusCodeEnums.OK_200,
                paymentLinkRes
            ); ;
            
        } catch (error: any) {
            return new CoreException(
                StatusCodeEnums.InternalServerError_500,
                error.message
            );
        }
    }

    static async getPaymentById(orderId: Number): Promise<Object> {
        const result: any = await PaymentModel.findById(orderId);
        try {
            return new PayosResponseModel(
                "Get Payos Payment Successful",
                StatusCodeEnums.OK_200,
                result
            );
        } catch (error: any) {
            return new CoreException(
                StatusCodeEnums.InternalServerError_500,
                error.message
            );
        }
    }

    async cancelPayment(id: string, cancellationReason: string): Promise<Object> {
        try {
            const cancelData = {
                status : "FAILED",
                cancellationReason: cancellationReason
            }
            const cancelRes = await PaymentModel.findByIdAndUpdate(id, cancelData, {new: true} )
            if (!cancelRes) {
                throw new Error("Payment not found");
            }

            const orderId : any = cancelRes.orderCode;

            const result: any = await payosClient.cancelPaymentLink(orderId, cancellationReason);

            return new PayosResponseModel(
                "Cancel Payos Payment Successful",
                StatusCodeEnums.OK_200,
                result
            );
        } catch (error: any) {
            return new CoreException(
                StatusCodeEnums.InternalServerError_500,
                error.message
            );
        }
    }

    async successPaymentMessage( id: String ): Promise<any>{
        try {
            const confirmData = {
                status: "SUCCESS"
            }
            const confirmRes : any= await PaymentModel.findByIdAndUpdate(id, confirmData, {new: true})
            return new PayosResponseModel(
                "Payment Successful",
                StatusCodeEnums.OK_200,
                confirmRes
            );
        } catch (error: any) {
            return new CoreException(
                StatusCodeEnums.InternalServerError_500,
                error.message
            );
        }

    }
    async purchaseWithPayos(payosData: any): Promise<Object | CoreException> {
        try {
            const result: any = await payosClient.confirmWebhook(payosData);
            if (!result.data)
                return new CoreException(
                    StatusCodeEnums.InternalServerError_500,
                    result.desc
                );
            return result;
        } catch (error: any) {
            return new CoreException(
                StatusCodeEnums.InternalServerError_500,
                error.message
            );
        }
    }
}

