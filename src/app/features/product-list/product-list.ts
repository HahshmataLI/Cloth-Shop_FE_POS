import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../core/Models/product.model';
import { ProductService } from '../../core/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ConfirmDialog } from "primeng/confirmdialog";
import { API_BASE, FILE_BASE } from '../../core/constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule, TableModule, InputTextModule,
    FormsModule, SelectModule, DialogModule, ButtonModule,
    RouterLink,
    ConfirmDialog
],
  providers: [ConfirmationService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: ProductModel[] = [];
  loading = true;

  // search + pagination
  searchText = '';
  rows = 10;
  first = 0;

  // modal
  displayDialog = false;
  selectedProduct: ProductModel | null = null;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: res => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load products', 'Error');
      }
    });
  }

  openDialog(product?: ProductModel) {
    this.selectedProduct = product ? { ...product } : null;
    this.displayDialog = true;
  }

  // ✅ confirm before delete
  confirmDelete(prod: ProductModel) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete product "${prod.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (prod._id) this.deleteProduct(prod._id);
      }
    });
  }
getFullImageUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `${FILE_BASE}${url}`;
}


  private deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Product deleted!', 'Success');
        this.loadProducts();
      },
      error: () => this.toastr.error('Failed to delete product', 'Error')
    });
  }

  // search filter
  get filteredProducts() {
    if (!this.searchText) return this.products;
    return this.products.filter(prod =>
      prod.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      prod.category?.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // paginator
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}
