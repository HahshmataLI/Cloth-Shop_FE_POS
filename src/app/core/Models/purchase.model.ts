import { ProductModel } from "./product.model";
import { SupplierModel } from "./SupplierModel";

export interface PurchaseItem {
 product: ProductModel | string;
  sku?: string;
  name?: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseModel {
  _id?: string;
  invoiceNumber?: string;
  date?: string | Date;
 supplier?: SupplierModel; 
  items: PurchaseItem[];
  subTotal: number;
  tax: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'Card' | 'BankTransfer' | 'Credit';
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  createdAt?: Date;
}
