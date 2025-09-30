import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerModel } from '../Models/customer.model';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService  {
  private baseUrl = API_ENDPOINTS.CUSTOMERS.BASE;

  constructor(private http: HttpClient) {}
// customer.service.ts
getCustomers(): Observable<CustomerModel[]> {
  return this.http.get<any>(this.baseUrl).pipe(
    map(res => Array.isArray(res) ? res : res.data || [])
  );
}



  getCustomerById(id: string): Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.baseUrl}/${id}`);
  }

  createCustomer(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(this.baseUrl, customer);
  }

  updateCustomer(id: string, customer: CustomerModel): Observable<CustomerModel> {
    return this.http.put<CustomerModel>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}