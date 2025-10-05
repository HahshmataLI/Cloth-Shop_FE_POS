import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants';
import { DashboardStats, TopProduct, WeeklySale } from '../Models/dashboardModel';



@Injectable({
  providedIn: 'root'
})
export class   DashboardService{
  constructor(private http: HttpClient) {}

getSummary(): Observable<DashboardStats> {
  return this.http
    .get<{ success: boolean; data: any }>(`${API_ENDPOINTS.DASHBOARD.SUMMARY}`)
    .pipe(
      map((res) => {
        console.log("Dashboard summary response:", res.data); // 👈 check here
        return res.data;
      })
    );
}

  getTopProducts(limit: number = 5): Observable<TopProduct[]> {
    return this.http
      .get<{ success: boolean; data: TopProduct[] }>(
        `${API_ENDPOINTS.DASHBOARD.BASE}/top-products?limit=${limit}`
      )
      .pipe(map((res) => res.data));
  }

  getWeeklySales(): Observable<WeeklySale[]> {
    return this.http
      .get<{ success: boolean; data: WeeklySale[] }>(
        `${API_ENDPOINTS.DASHBOARD.BASE}/weekly-sales`
      )
      .pipe(map((res) => res.data));
  }
}