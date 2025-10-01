import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerModel } from '../../../core/Models/customer.model';
import { ProductModel } from '../../../core/Models/product.model';
import { SaleItem, SaleModel } from '../../../core/Models/sale.model';
import { CustomerService } from '../../../core/services/customer-service';
import { ProductService } from '../../../core/services/product-service';
import { SaleService } from '../../../core/services/sale-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CategoryService } from '../../../core/services/category';
import { CategoriesModel } from '../../../core/Models/categoryModel.model';
import { SubCategoryModel } from '../../../core/Models/sub-category.model';
import { SubCategoryService } from '../../../core/services/sub-category';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-sale',
  imports: [SelectModule,TableModule,DialogModule,ConfirmDialogModule,InputTextModule,ButtonModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-sale.html',
  styleUrl: './add-sale.css',
   providers: [ConfirmationService],
})
export class AddSale  implements OnInit , AfterViewInit {
  @ViewChild('skuInputEl') skuInputEl!: ElementRef;

  customers: CustomerModel[] = [];
  categories: CategoriesModel[] = [];
  subCategories: SubCategoryModel[] = [];
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];

  // POS state
  selectedCustomer?: CustomerModel | null = null;
  selectedCategory?: CategoriesModel | null = null;
  selectedSubCategory?: SubCategoryModel | null = null;

  skuInput = '';
  saleItems: SaleItem[] = [];

  subTotal = 0;
  tax = 0;
  grandTotal = 0;
  paymentMethod: SaleModel['paymentMethod'] = 'Cash';
  amountPaid = 0;
  changeDue = 0;

  constructor(
    private customerService: CustomerService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
    private saleService: SaleService,
    private toastr: ToastrService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.focusSkuInput();
  }

  private focusSkuInput() {
    setTimeout(() => this.skuInputEl?.nativeElement.focus(), 100);
  }

  private loadData() {
    // Load customers and set default "Walk-in Customer"
    this.customerService.getCustomers().subscribe(res => {
      this.customers = res;
      this.selectedCustomer = this.customers.find(c => c.name.toLowerCase().includes('walk')) || null;
    });

    // Load categories
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  selectCategory(category: CategoriesModel) {
    this.selectedCategory = category;
    this.selectedSubCategory = null;
    this.filteredProducts = [];
    this.subCategoryService.getSubCategoriesByCategory(category._id!).subscribe(res => {
      this.subCategories = res;
    });
  }

  selectSubCategory(subCat: SubCategoryModel) {
    this.selectedSubCategory = subCat;
    this.productService.getProducts().subscribe(res => {
      this.products = res;
      this.filteredProducts = this.products.filter(
        p => p.subcategory?._id === subCat._id
      );
    });
  }
  addProduct(product: ProductModel) {
    const existing = this.saleItems.find(i => i.product._id === product._id);
    if (existing) {
      existing.quantity++;
      existing.subtotal = existing.quantity * existing.price - (existing.discount ?? 0);
    } else {
      const price = product.salePrice ?? 0;
      this.saleItems.push({
        product,
        quantity: 1,
        price,
        discount: 0,
        subtotal: price
      });
    }
    this.updateTotals();
    this.playBeep();
    this.focusSkuInput();
  }

  addBySku() {
    const sku = this.skuInput?.trim();
    if (!sku) return;

    this.productService.getProductBySku(sku).subscribe({
      next: (p) => {
        if (!p || !p._id) {
          this.toastr.error('Product not found for SKU: ' + sku);
          this.focusSkuInput();
          return;
        }
        this.addProduct(p);
        this.skuInput = '';
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to fetch product by SKU');
        this.focusSkuInput();
      }
    });
  }

  updateQuantity(item: SaleItem, qty: number) {
    item.quantity = Math.max(1, qty || 1);
    item.subtotal = (item.price * item.quantity) - (item.discount ?? 0);
    this.updateTotals();
  }

  removeItem(idx: number) {
    this.saleItems.splice(idx, 1);
    this.updateTotals();
  }

  updateTotals() {
    this.subTotal = this.saleItems.reduce((s, it) => s + (it.subtotal), 0);
    const taxPercent = 0;
    const taxAmount = (this.subTotal * taxPercent) / 100;
    this.grandTotal = this.subTotal + taxAmount;
    this.changeDue = Math.max(0, (this.amountPaid || 0) - this.grandTotal);
  }

  onAmountPaidChange(value: number) {
    this.amountPaid = value;
    this.changeDue = Math.max(0, (this.amountPaid || 0) - this.grandTotal);
  }

  saveSale() {
    if (!this.selectedCustomer || !this.selectedCustomer._id) {
      this.toastr.warning('Please select a customer');
      return;
    }
    if (this.saleItems.length === 0) {
      this.toastr.warning('Add at least one product to the cart');
      return;
    }

    const itemsPayload = this.saleItems.map(it => ({
      product: it.product._id!,
      sku: it.product.sku,
      name: it.product.name,
      quantity: it.quantity,
      unitPrice: it.price,
      discount: it.discount ?? 0,
      total: Number((it.subtotal).toFixed(2))
    }));

    const salePayload: SaleModel = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date(),
       customer: this.selectedCustomer,
      items: itemsPayload,
      subTotal: Number(this.subTotal.toFixed(2)),
      tax: Number(this.tax),
      grandTotal: Number(this.grandTotal.toFixed(2)),
      paymentMethod: this.paymentMethod,
      amountPaid: Number(this.amountPaid || 0),
      changeDue: Number(this.changeDue || 0)
    };

    this.saleService.createSale(salePayload).subscribe({
      next: () => {
        this.toastr.success('Sale saved successfully!');
        this.saleItems = [];
        this.subTotal = this.grandTotal = this.amountPaid = this.changeDue = 0;
        this.selectedCustomer = null;
        this.skuInput = '';
        this.focusSkuInput();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to save sale');
      }
    });
  }
printInvoice() {
  if (!this.selectedCustomer || this.saleItems.length === 0) {
    this.toastr.warning('Please complete the sale first!');
    return;
  }

  // Generate payload just like saveSale
  const itemsPayload = this.saleItems.map(it => ({
    product: it.product._id!,
    sku: it.product.sku,
    name: it.product.name,
    quantity: it.quantity,
    unitPrice: it.price,
    discount: it.discount ?? 0,
    total: Number((it.subtotal).toFixed(2))
  }));

  const salePayload: SaleModel = {
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date(),
    customer: this.selectedCustomer,
    items: itemsPayload,
    subTotal: Number(this.subTotal.toFixed(2)),
    tax: Number(this.tax),
    grandTotal: Number(this.grandTotal.toFixed(2)),
    paymentMethod: this.paymentMethod,
    amountPaid: Number(this.amountPaid || 0),
    changeDue: Number(this.changeDue || 0)
  };

  // Navigate to invoice preview page
  this.router.navigate(['/invoice'], { state: { sale: salePayload } });
}
  private playBeep() {
    const audio = new Audio('assets/beep.mp3'); // put beep.mp3 in assets/
    audio.play().catch(() => {});
  }
}