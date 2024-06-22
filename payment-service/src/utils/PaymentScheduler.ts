import PayosModel from '../models/PayosModel'; // Adjust the path as necessary
import { Document } from 'mongoose';

interface PaymentDocument extends Document {
    status: string;
    expiredAt: number;
}

const scheduleExpired = (paymentId: number, delay: number) => {
    setTimeout(async () => {
        try {
            const payment = await PayosModel.findById(paymentId);

            if (payment && payment.status === 'PENDING') {
                payment.status = 'EXPIRED';
                await payment.save();
                console.log(`Payment status updated to EXPIRED for payment ID: `, paymentId );
            }
        } catch (error) {
            console.error(`Failed to update payment status for payment ID: ${paymentId}`, error);
        }
    }, delay);
};
export { scheduleExpired }
