export interface CustomerModel {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
