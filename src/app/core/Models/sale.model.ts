import { CustomerModel } from "./customer.model";
import { ProductModel } from "./product.model";

export interface SaleItem {
  product: ProductModel | string;  // sometimes populated, sometimes just id
  sku?: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface SaleModel {
  _id?: string;
  invoiceNumber?: string;
  date?: string | Date;
  cashier?: { _id: string; username: string; email: string } | string; 
  customer: CustomerModel | string; // sometimes populated
  items: SaleItem[];
  subTotal: number;
   discount?: number;   // ✅ exists here
  tax: number;
  grandTotal: number;
  paymentMethod: 'Cash'|'Card'|'JazzCash'|'Easypaisa'|'BankTransfer'|'Credit';
  amountPaid: number;
  changeDue: number;
  createdAt?: Date;
  updatedAt?: Date;
}
