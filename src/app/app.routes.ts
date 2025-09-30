import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AddSale } from './features/sales/add-sale/add-sale';

import { Register } from './auth/register/register';
import { roleGuard } from './core/guards/role-guard';
import { Dashboard } from './features/dashboard/dashboard';
import { Categories } from './features/categories/categories';
import { SubCategory } from './features/sub-category/sub-category';
import { ProductList } from './features/product-list/product-list';
import { ProductForm } from './features/product-form/product-form';
import { CustomerList } from './features/customers/customer-list/customer-list';
import { Supplier } from './features/supplier/supplier';
import { ListSale } from './features/sales/list-sale/list-sale';
import { AddPurchase } from './features/purchase/add-purchase/add-purchase';
import { ListPurchase } from './features/purchase/list-purchase/list-purchase';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'dashboard', component: Dashboard, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'products', component: ProductList, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'add-product', component: ProductForm, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'add-purchase', component: AddPurchase, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'list-purchase', component: ListPurchase, canActivate: [roleGuard], data: { roles: ['admin'] } },
  
  // { path: 'categories', component: Categories, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'list-sale', component: ListSale, canActivate: [roleGuard], data: { roles: ['cashier', 'admin'] } },
  { path: 'add-sale', component: AddSale, canActivate: [roleGuard], data: { roles: ['cashier', 'admin'] } },
  { path: 'add-category', component: Categories, canActivate: [roleGuard], data: { roles: ['cashier', 'admin'] } },
  { path: 'customers', component: CustomerList, canActivate: [roleGuard], data: { roles: ['cashier', 'admin'] } },
  { path: 'suppliers', component: Supplier, canActivate: [roleGuard], data: { roles: ['cashier', 'admin'] } },

  { path: 'sub-category', component: SubCategory, canActivate: [roleGuard], data: { roles: ['cashier', 'admin'] } },

  { path: '**', redirectTo: 'login' } // catch-all
];
