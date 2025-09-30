export interface SubCategoryModel {
  _id?: string;
  name: string;
  category: string; // parent category _id
  createdAt?: string;
  updatedAt?: string;
}
