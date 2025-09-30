import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SupplierModel } from '../Models/SupplierModel';

@Injectable({
  providedIn: 'root'
})
export class supplierService {
  private baseUrl = API_ENDPOINTS.SUPPLIERS.BASE;

constructor(private http :HttpClient){

}
getSuppliers(): Observable<SupplierModel[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => Array.isArray(res) ? res : res.data || [])
    );
  }

  getSupplierById(id: string): Observable<SupplierModel> {
    return this.http.get<SupplierModel>(`${this.baseUrl}/${id}`);
  }

  createSupplier(supplier: SupplierModel): Observable<SupplierModel> {
    return this.http.post<SupplierModel>(this.baseUrl, supplier);
  }

  updateSupplier(id: string, supplier: SupplierModel): Observable<SupplierModel> {
    return this.http.put<SupplierModel>(`${this.baseUrl}/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
