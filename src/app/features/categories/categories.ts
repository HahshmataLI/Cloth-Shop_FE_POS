import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { CategoriesModel } from '../../core/Models/categoryModel.model';
import { CategoryService } from '../../core/services/category';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-categories',
  imports: [PaginatorModule,ButtonModule,DialogModule,CommonModule,TableModule,FormsModule,ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: CategoriesModel[] = [];
  loading: boolean = true;

  // Dialog
  displayDialog: boolean = false;
  newCategory: CategoriesModel = { name: '' };

  // ✅ Paginator state
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.totalRecords = res.length; // ✅ update paginator
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load categories!', 'Error');
      }
    });
  }

  // ✅ Pagination event handler
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  openDialog() {
    this.newCategory = { name: '' };
    this.displayDialog = true;
  }

  saveCategory() {
    if (!this.newCategory.name.trim()) {
      this.toastr.warning('Category name is required!', 'Warning');
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.toastr.success('Category added successfully!', 'Success');
        this.loadCategories();
        this.displayDialog = false;
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Something went wrong while adding category!',
          'Error'
        );
      }
    });
  }

  editCategory(cat: CategoriesModel) {
    
  }

  deleteCategory(cat: CategoriesModel) {
    // later when delete API is ready:
    // this.categoryService.deleteCategory(cat._id).subscribe({
    //   next: () => {
    //     this.toastr.success('Category deleted successfully!', 'Deleted');
    //     this.loadCategories();
    //   },
    //   error: () => {
    //     this.toastr.error('Failed to delete category!', 'Error');
    //   }
    // });
  }
}