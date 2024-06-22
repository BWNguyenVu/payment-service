import { OrderStatusEnums } from "../../../enums/OrderStatusEnums";

export default class PayosResponseModel {
  private data: {
    id: string;
    orderCode: string;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: OrderStatusEnums;
    createdAt: Date;
    transactions: Array<Object>;
    canceledAt: Date;
    cancellationReason: string;
  };
  
  private message: string;
  private statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    data: {
      id: string;
      orderCode: string;
      amount: number;
      amountPaid: number;
      amountRemaining: number;
      status: OrderStatusEnums;
      createdAt: Date;
      transactions: Array<Object>;
      canceledAt: Date;
      cancellationReason: string;
    }
  ) {    
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}