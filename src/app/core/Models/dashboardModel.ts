// src/app/core/Models/dashboard.model.ts
export interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalRevenue: number;
  lowStockProducts: number;
  todaySales: number;
}

export interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalRevenue: number;
  totalPurchasesAmount: number;
  totalProfit: number;
  todaySales: number;
  todayInvoices: number;
  todayProfit: number;
  monthSales: number;
  monthInvoices: number;
  monthProfit: number;
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
