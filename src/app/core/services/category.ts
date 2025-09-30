import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CategoriesModel } from '../Models/categoryModel.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  {
  private baseUrl = API_ENDPOINTS.CATEGORIES.BASE;

  constructor(private http: HttpClient) {}

  // ✅ Get all categories
getCategories(): Observable<CategoriesModel[]> {
  return this.http.get<{ success: boolean; data: CategoriesModel[] }>(this.baseUrl)
    .pipe(map(res => res.data));
}


  // ✅ Create category (admin only)
  createCategory(category: CategoriesModel): Observable<CategoriesModel> {
    return this.http.post<CategoriesModel>(this.baseUrl, category);
  }
}