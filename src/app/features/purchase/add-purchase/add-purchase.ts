import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseService } from '../../../core/services/purchase-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { supplierService } from '../../../core/services/supplier';
import { PurchaseItem, PurchaseModel } from '../../../core/Models/purchase.model';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-add-purchase',
  imports: [DatePickerModule,SelectModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-purchase.html',
  styleUrl: './add-purchase.css'
})
export class AddPurchase  implements OnInit {
  suppliers: any[] = [];
  products: any[] = [];

  purchase: PurchaseModel = {
    items: [],
    subTotal: 0,
    tax: 0,
    grandTotal: 0,
    paymentMethod: 'Cash',
    amountPaid: 0,
    balanceDue: 0,
  };

  paymentMethods = ['Cash', 'Card', 'BankTransfer', 'Credit'];

  constructor(
    private purchaseService: PurchaseService,
    private supplierService: supplierService,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
    this.addItem(); // at least one row
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe((res: any) => {
      this.suppliers = res.data || res;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res.data || res;
    });
  }

  addItem() {
    this.purchase.items.push({
      product: '',
      quantity: 1,
      unitCost: 0,
      total: 0,
    });
  }

  removeItem(index: number) {
    this.purchase.items.splice(index, 1);
    this.updateTotals();
  }

  onItemChange(item: PurchaseItem) {
    item.total = item.quantity * item.unitCost;
    this.updateTotals();
  }

  updateTotals() {
    this.purchase.subTotal = this.purchase.items.reduce(
      (sum, i) => sum + (i.total || 0),
      0
    );
    this.purchase.grandTotal = this.purchase.subTotal + (this.purchase.tax || 0);
    this.purchase.balanceDue = this.purchase.grandTotal - (this.purchase.amountPaid || 0);
  }

  savePurchase() {
    this.purchaseService.createPurchase(this.purchase).subscribe({
      next: () => {
        this.toastr.success('Purchase added successfully!');
        this.router.navigate(['/list-purchase']);
      },
      error: () => {
        this.toastr.error('Failed to add purchase');
      },
    });
  }
}