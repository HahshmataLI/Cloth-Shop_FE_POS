export interface SupplierModel { 
  _id?: string;     // make optional for create
  name: string;
  phone: string;    // must be string to match backend
  email: string;
  address?: string; // optional to match backend
  company: string;
  note: string;   // must match backend field name
}

