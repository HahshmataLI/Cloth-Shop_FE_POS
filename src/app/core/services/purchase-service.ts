import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { PurchaseModel } from '../Models/purchase.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService  {
  private apiUrl = API_ENDPOINTS.PURCHASES.BASE;

  constructor(private http: HttpClient) {}

  getPurchases(): Observable<PurchaseModel[]> {
    return this.http
      .get<{ success: boolean; data: PurchaseModel[] }>(this.apiUrl)
      .pipe(map((res) => res.data));
  }

  getPurchaseById(id: string): Observable<PurchaseModel> {
    return this.http
      .get<{ success: boolean; data: PurchaseModel }>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createPurchase(purchase: PurchaseModel): Observable<PurchaseModel> {
    return this.http
      .post<{ success: boolean; data: PurchaseModel }>(this.apiUrl, purchase)
      .pipe(map((res) => res.data));
  }

  updatePurchase(id: string, purchase: PurchaseModel): Observable<PurchaseModel> {
    return this.http
      .put<{ success: boolean; data: PurchaseModel }>(`${this.apiUrl}/${id}`, purchase)
      .pipe(map((res) => res.data));
  }

  deletePurchase(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}