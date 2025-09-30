import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { SubCategoryModel } from '../Models/sub-category.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private baseUrl = API_ENDPOINTS.SUBCATEGORIES.BASE; // e.g. /api/v1/subcategories

  constructor(private http: HttpClient) {}

  // ✅ Get all subcategories
  getSubCategories(): Observable<SubCategoryModel[]> {
    return this.http
      .get<{ success: boolean; data: SubCategoryModel[] }>(this.baseUrl)
      .pipe(map(res => res.data));
  }
// sub-category.service.ts

getSubCategoriesByCategory(categoryId: string): Observable<SubCategoryModel[]> {
  return this.http
    .get<{ success: boolean; data: SubCategoryModel[] }>(
      `${this.baseUrl}/by-category/${categoryId}`
    )
    .pipe(map(res => res.data));
}


  // ✅ Create subcategory
  createSubCategory(subCat: SubCategoryModel): Observable<SubCategoryModel> {
    return this.http.post<SubCategoryModel>(this.baseUrl, subCat);
  }
}