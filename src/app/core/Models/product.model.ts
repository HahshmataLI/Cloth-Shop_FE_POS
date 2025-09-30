// models/product.model.ts
export interface ProductModel {
  _id?: string;
  sku?: string;
  name: string;

 category: { _id: string; name: string };
  subcategory?: string;

  brand?: string;
  size?: string;
  color?: string;
  material?: string;
  season?: string;
  designCode?: string;

  purchasePrice: number;
  salePrice: number;
  discount?: number;
  stockQuantity?: number;

  supplier?: string;

  images?: any[]; // preview from backend
  barcodeImage?: string; // base64 from backend
  description?: string;
}
