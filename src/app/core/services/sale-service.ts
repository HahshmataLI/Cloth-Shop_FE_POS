import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { SaleModel } from '../Models/sale.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl = API_ENDPOINTS.SALES.BASE;

  constructor(private http: HttpClient) {}

  getSales(): Observable<SaleModel[]> {
    return this.http.get<{ success?: boolean; data?: SaleModel[] }>(this.baseUrl)
      .pipe(map(res => (res && (res as any).data) ? (res as any).data : (res as any)));
  }

  getSaleById(id: string): Observable<SaleModel> {
    return this.http.get<SaleModel>(`${this.baseUrl}/${id}`);
  }

  createSale(sale: SaleModel): Observable<SaleModel> {
    return this.http.post<SaleModel>(this.baseUrl, sale);
  }

  updateSale(id: string, sale: SaleModel): Observable<SaleModel> {
    return this.http.put<SaleModel>(`${this.baseUrl}/${id}`, sale);
  }

  deleteSale(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}