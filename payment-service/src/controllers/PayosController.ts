import { Request, Response } from "express";
import { PayosService } from "../services/PayosService";
import { CoreException } from "../exceptions/CoreException";
import { PayosCancelRequest } from "../dto/Payos/Requests/PayosCancelRequest";
import { PayosRequest } from "../dto/Payos/Requests/PayosRequest";
require('dotenv').config();

const payosService = new PayosService();

export class PayosController {
    async createPaymentLink(req: Request, res: Response) {
        try {
            const totalPrice = parseFloat(req.body.totalPrice);
            const {
                id, productName, description, quantity, buyerName, buyerPhone, buyerEmail
            } = req.body
            const payosData = {
                id, productName, description, quantity, buyerName, buyerPhone, buyerEmail, 
            }
            const result = await payosService.createPaymentLink(payosData, totalPrice);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json(new CoreException(500, error.message));
        }
    }

    async getPaymentById(req: Request<any, any, PayosRequest>, res: Response) {
        try {
            const { orderId } : PayosRequest = req.params;
            const result = await PayosService.getPaymentById(orderId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json(new CoreException(500, error.message));
        }
    }

    async cancelPayment(req: Request<any, any, PayosCancelRequest>, res: Response) {
        try {
            const { id } = req.params;
            const { cancellationReason } = req.body;
            const result = await payosService.cancelPayment(id, cancellationReason);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json(new CoreException(500, error.message));
        }
    }

    async purchaseWithPayos(req: Request, res: Response) {
        try {
            const payosData: any = req.body;
            const result = await payosService.purchaseWithPayos(payosData);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json(new CoreException(500, error.message));
        }
    }
}
