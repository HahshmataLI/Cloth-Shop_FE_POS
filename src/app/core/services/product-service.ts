import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from '../Models/product.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = API_ENDPOINTS.PRODUCTS.BASE; // adjust if needed

  constructor(private http: HttpClient) {}

  // ✅ Get all
  getProducts(): Observable<ProductModel[]> {
    return this.http
      .get<{ success: boolean; data: ProductModel[] }>(this.baseUrl)
      .pipe(map(res => res.data));
  }

  // ✅ Get by id
  getProductById(id: string): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create
createProduct(formData: FormData): Observable<any> {
  return this.http.post<any>(this.baseUrl, formData);  // not ProductModel type
}
// inside ProductService
getProductBySku(sku: string): Observable<ProductModel> {
  // your backend route: GET /api/v1/products/barcode/:barcode (you had /barcode/:barcode)
  // adjust path if your backend differs
  return this.http.get<{ success?: boolean; data?: ProductModel }>(`${this.baseUrl}/barcode/${encodeURIComponent(sku)}`)
    .pipe(map(res => res && (res as any).data ? (res as any).data : (res as any)));
}


  // ✅ Update
  updateProduct(id: string, product: ProductModel): Observable<ProductModel> {
    const formData = this.toFormData(product);
    return this.http.put<ProductModel>(`${this.baseUrl}/${id}`, formData);
  }

  // ✅ Delete
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // 🔄 Convert product to FormData
  private toFormData(product: ProductModel): FormData {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (key === 'images' && Array.isArray(value)) {
        value.forEach(file => formData.append('images', file));
      } else {
        formData.append(key, value as any);
      }
    });

    return formData;
  }
}