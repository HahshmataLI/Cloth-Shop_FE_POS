import { Component, OnInit } from '@angular/core';
import { SubCategoryModel } from '../../core/Models/sub-category.model';
import { CategoriesModel } from '../../core/Models/categoryModel.model';
import { SubCategoryService } from '../../core/services/sub-category';
import { CategoryService } from '../../core/services/category';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-sub-category',
  imports: [SelectModule,PaginatorModule,ButtonModule,DialogModule,CommonModule,TableModule,FormsModule,ReactiveFormsModule],
  templateUrl: './sub-category.html',
  styleUrl: './sub-category.css'
})
export class SubCategory implements OnInit {
  subCategories: SubCategoryModel[] = [];
  categories: CategoriesModel[] = [];
  loading: boolean = true;

  // Dialog
  displayDialog: boolean = false;
  newSubCategory: SubCategoryModel = { name: '', category: '' };

  // Paginator
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubCategories();
    this.loadCategories();
  }

  loadSubCategories() {
    this.loading = true;
    this.subCategoryService.getSubCategories().subscribe({
      next: (res) => {
        this.subCategories = res;
        this.totalRecords = res.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load subcategories!', 'Error');
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: () => this.toastr.error('Failed to load categories!', 'Error')
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  openDialog() {
    this.newSubCategory = { name: '', category: '' };
    this.displayDialog = true;
  }

  saveSubCategory() {
    if (!this.newSubCategory.name.trim() || !this.newSubCategory.category) {
      this.toastr.warning('Both name and category are required!', 'Warning');
      return;
    }

    this.subCategoryService.createSubCategory(this.newSubCategory).subscribe({
      next: () => {
        this.toastr.success('SubCategory added successfully!', 'Success');
        this.loadSubCategories();
        this.displayDialog = false;
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Error while adding subcategory!',
          'Error'
        );
      }
    });
  }
}