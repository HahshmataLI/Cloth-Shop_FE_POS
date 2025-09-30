import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductModel } from '../../core/Models/product.model';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../core/services/product-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesModel } from '../../core/Models/categoryModel.model';
import { SubCategoryModel } from '../../core/Models/sub-category.model';
import { CategoryService } from '../../core/services/category';
import { SubCategoryService } from '../../core/services/sub-category';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-product-form',
  imports: [FormsModule,CommonModule,SelectModule,ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm  implements OnInit{
  product: ProductModel = {
    name: '',
     category: { _id: '', name: '' },
    purchasePrice: 0,
    salePrice: 0,
    stockQuantity: 0,
  };

  categories: CategoriesModel[] = [];
  subCategories: SubCategoryModel[] = [];
  selectedFiles: File[] = [];

  // after save
  savedProduct?: ProductModel;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: () => this.toastr.error('Failed to load categories!'),
    });
  }

 onCategoryChange(categoryId: string) {
  this.subCategoryService.getSubCategoriesByCategory(categoryId).subscribe({
    next: (res) => (this.subCategories = res),
    error: () => this.toastr.error('Failed to load subcategories!'),
  });
}


  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  saveProduct() {
    const formData = new FormData();

    // 🔹 Convert values to strings before appending
    Object.entries(this.product).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    // 🔹 Append images
    this.selectedFiles.forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.productService.createProduct(formData).subscribe({
      next: (res: any) => {
        this.toastr.success('✅ Product added successfully!');
        this.savedProduct = res.data; // store product with barcode
        this.resetForm();
      },
      error: (err) =>
        this.toastr.error(err?.error?.message || '❌ Error adding product!'),
    });
  }

  resetForm() {
    this.product = {
      name: '',
      category: { _id: '', name: '' },
      purchasePrice: 0,
      salePrice: 0,
      stockQuantity: 0,
    };
    this.selectedFiles = [];
  }

 printBarcode() {
  if (!this.savedProduct?.barcodeImage) return;

  const popup = window.open('', '_blank', 'width=400,height=300');
  if (!popup) return;

  popup.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          body { display: flex; justify-content: center; align-items: center; height: 100vh; }
          img { width: 250px; height: auto; }
        </style>
      </head>
      <body>
        <div>
          <img src="${this.savedProduct.barcodeImage}" />
          <p style="text-align:center;font-size:14px;">SKU: ${this.savedProduct.sku}</p>
        </div>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}

}