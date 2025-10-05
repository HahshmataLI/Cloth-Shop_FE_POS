// src/app/core/Models/dashboard.model.ts
export interface DashboardStats {
  todaySales: number;
  totalSales: number;
  totalPurchases: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalRevenue: number;
  lowStockProducts: number;
}


export interface TopProduct {
  productId: string;
  name: string;
  totalQty: number;
  totalSales: number;
}

export interface WeeklySale {
  _id: string;   // date string
  total: number;
}
