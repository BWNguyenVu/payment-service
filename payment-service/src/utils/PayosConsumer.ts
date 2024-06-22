import KafkaConfig from '../config/KafkaConfig';
import { StatusCodeEnums } from '../enums/StatusCodeEnums';
import { CoreException } from '../exceptions/CoreException';
import { PayosService } from "../services/PayosService";
const kafkaConfig = new KafkaConfig();
const payosService = new PayosService();

async function processPaymentMessage (message: string): Promise<void> {
    try {
        console.log("Topic: ", "create-payment")
        const parsedMessage = JSON.parse(message);
        console.log("Consumer received id: ", parsedMessage.id )
        const totalPrice = parseFloat(parsedMessage.totalPrice);
        const data : any = await payosService.createPaymentLink(parsedMessage, totalPrice);
        return data;
    } catch (error: any) {
        return  error.message
    }
};
async function cancelPaymentMessage (message: string): Promise<void> {
    try {
        console.log("Topic: ", "cancel-payment")
        const parsedMessage = JSON.parse(message);
        console.log("Consumer received id: ", parsedMessage.id )
        const data : any = await payosService.cancelPayment(parsedMessage.id, parsedMessage.cancellationReason);
        return data;
    } catch (error: any) {
        return  error.message
    }
};

async function successPaymentMessage (message: string): Promise<void> {
    try {
        console.log("Topic: ", "success-payment")
        const parsedMessage = JSON.parse(message);
        console.log("Consumer received id: ", parsedMessage.id )
        const data : any = await payosService.successPaymentMessage(parsedMessage.id);
        return data;
    } catch (error: any) {
        return  error.message
    }
};
export const startConsumer = async () => {
    await kafkaConfig.connectConsumer();
    await kafkaConfig.consume('create-payment', processPaymentMessage);
    await kafkaConfig.consume('cancel-payment', cancelPaymentMessage);
    await kafkaConfig.consume('success-payment', successPaymentMessage);

};


