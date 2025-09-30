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
  products: ProductModel[] = [];

  // POS state
  selectedCustomer?: CustomerModel | null = null;
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
    private productService: ProductService,
    private saleService: SaleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Autofocus SKU input when component loads
    this.focusSkuInput();
  }

  focusSkuInput() {
    setTimeout(() => this.skuInputEl?.nativeElement.focus(), 100);
  }

  loadData() {
    this.customerService.getCustomers().subscribe(res => this.customers = res);
    this.productService.getProducts().subscribe(res => this.products = res);
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

  private playBeep() {
    const audio = new Audio('assets/beep.mp3'); // put beep.mp3 in assets/
    audio.play().catch(() => {});
  }
}