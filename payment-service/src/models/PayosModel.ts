import mongoose, { Schema, Document } from "mongoose";
import { OrderStatusEnums } from "../enums/OrderStatusEnums";

const PaymentSchema: Schema = new mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    orderCode: { type: Number, required: true },
    amount: { type: Number, required: true },
    courseId: { type: String },
    amountPaid: { type: Number},
    amountRemaining: { type: Number },
    accountNumber: { type: String },
    accountName: { type: String },
    description : { type: String },
    currency : { type: String },
    status: { type: String, enum: Object.values(OrderStatusEnums) },
    createdAt: { type: Date, default: Date.now  },
    transactions: { type: [Object] },
    canceledAt: { type: Date },
    cancellationReason: { type: String },
    expiredAt: { type: Number },
    checkoutUrl: { type: String },
    qrCode: { type: String },

    buyerName: { type: String },
    buyerPhone: { type: String },
    buyerEmail: { type: String },
});

const PaymentModel = mongoose.model('Payment', PaymentSchema);

export default PaymentModel;
