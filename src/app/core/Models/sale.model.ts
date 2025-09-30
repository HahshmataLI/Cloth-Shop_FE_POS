// sale.model.ts
import { CustomerModel } from './customer.model';
import { ProductModel } from './product.model';

export interface SaleItem {
  product: ProductModel;
  quantity: number;
  price: number;      // snapshot of salePrice
  discount?: number;
  subtotal: number;
}

export interface SaleModel {
  _id?: string;
  invoiceNumber?: string;
  date?: string | Date;
  cashier?: string; // can be user id
  customer: string; // customer id
  items: Array<{
    product: string;
    sku?: string;
    name?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
  }>;
  subTotal: number;
  tax: number;
  grandTotal: number;
  paymentMethod: 'Cash'|'Card'|'JazzCash'|'Easypaisa'|'BankTransfer'|'Credit';
  amountPaid: number;
  changeDue: number;
  createdAt?: Date;
  updatedAt?: Date;
}
