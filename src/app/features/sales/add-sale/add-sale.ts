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
import { Auth } from '../../../core/services/auth';
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
    private router: Router,
    private auth: Auth
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
  const existing = this.saleItems.find(i => (i.product as ProductModel)._id === product._id);

  const price = product.salePrice ?? product.purchasePrice ?? 0;  // ✅ fallback if salePrice missing

  if (existing) {
    existing.quantity++;
    existing.unitPrice = price;   // ✅ ensure price updates
    existing.total = (existing.quantity * existing.unitPrice) - (existing.discount ?? 0);
  } else {
    this.saleItems.push({
      product,
      quantity: 1,
      unitPrice: price,
      discount: 0,
      total: price
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
      this.playBeep();  // ✅ force play after scanning
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
    item.total = (item.unitPrice * item.quantity) - (item.discount ?? 0);
    this.updateTotals();
  }

  removeItem(idx: number) {
    this.saleItems.splice(idx, 1);
    this.updateTotals();
  }
getStockQuantity(item: any): number {
  if (item.product && 'stockQuantity' in item.product) {
    return (item.product as any).stockQuantity ?? 0;
  }
  return 0;
}

  updateTotals() {
    this.subTotal = this.saleItems.reduce((s, it) => s + (it.total), 0);
    this.tax = 0; // can fetch from backend config later
    this.grandTotal = this.subTotal + this.tax;
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

    const cashierId = this.auth.getUserId();
    if (!cashierId) {
      this.toastr.error('No cashier logged in');
      return;
    }

    const itemsPayload = this.saleItems.map(it => ({
      product: (it.product as ProductModel)._id!,
      sku: (it.product as ProductModel).sku,
      name: (it.product as ProductModel).name,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      discount: it.discount ?? 0,
      total: Number((it.total).toFixed(2))
    }));

    const salePayload: SaleModel = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date(),
      cashier: cashierId,
      customer: this.selectedCustomer._id!,
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
        this.resetForm();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to save sale');
      }
    });
  }
saveAndPrint() {
  if (!this.selectedCustomer || !this.selectedCustomer._id) {
    this.toastr.warning('Please select a customer');
    return;
  }
  if (this.saleItems.length === 0) {
    this.toastr.warning('Add at least one product to the cart');
    return;
  }

  const cashierId = this.auth.getUserInfo()?._id;   // ✅ fix for getUserId
  if (!cashierId) {
    this.toastr.error('No cashier logged in');
    return;
  }
  const itemsPayload = this.saleItems.map(it => ({
    product: (it.product as ProductModel)._id!,
    sku: (it.product as ProductModel).sku,
    name: (it.product as ProductModel).name,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    discount: it.discount ?? 0,
    total: Number((it.total).toFixed(2))
  }));

  const salePayload: SaleModel = {
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date(),
    cashier: cashierId,
    customer: this.selectedCustomer._id!,
    items: itemsPayload,
    subTotal: Number(this.subTotal.toFixed(2)),
    tax: Number(this.tax),
    grandTotal: Number(this.grandTotal.toFixed(2)),
    paymentMethod: this.paymentMethod,
    amountPaid: Number(this.amountPaid || 0),
    changeDue: Number(this.changeDue || 0)
  };
this.saleService.createSale(salePayload).subscribe({
  next: (res: any) => {
    this.toastr.success('Sale saved successfully!');
    this.resetForm();

    const saleId = res?.data?._id;  // ✅ get id from res.data
    if (saleId) {
      this.router.navigate(['/invoice', saleId]);
    } else {
      this.toastr.error('No invoice ID returned');
    }
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

    const salePayload: SaleModel = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date(),
      cashier: this.auth.getUserId()!,
      customer: this.selectedCustomer._id!,
      items: this.saleItems.map(it => ({
        product: (it.product as ProductModel)._id!,
        sku: (it.product as ProductModel).sku,
        name: (it.product as ProductModel).name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        discount: it.discount ?? 0,
        total: Number((it.total).toFixed(2))
      })),
      subTotal: this.subTotal,
      tax: this.tax,
      grandTotal: this.grandTotal,
      paymentMethod: this.paymentMethod,
      amountPaid: this.amountPaid,
      changeDue: this.changeDue
    };

    this.router.navigate(['/invoice'], { state: { sale: salePayload } });
  }

 private resetForm() {
  this.saleItems = [];
  this.subTotal = this.grandTotal = this.amountPaid = this.changeDue = 0;
  this.skuInput = '';

  // ✅ Keep Walk-in Customer selected
  this.selectedCustomer =
    this.customers.find(c => c.name.toLowerCase().includes('walk')) || null;

  this.focusSkuInput();
}
triggerSkuScan() {
  this.playBeep();  // ✅ beep on pressing enter (user gesture)
  this.addBySku();  // then run your SKU lookup
}


  private playBeep() {
    const audio = new Audio('beep.mp3');

    audio.play().catch(() => {});
  }
}