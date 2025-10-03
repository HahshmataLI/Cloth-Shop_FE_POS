import { Component, OnInit } from '@angular/core';
import { SaleModel } from '../../../core/Models/sale.model';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '../../../core/services/sale-service';

@Component({
  selector: 'app-invoice-component',
  imports: [CommonModule],
  templateUrl: './invoice-component.html',
  styleUrl: './invoice-component.css'
})
export class InvoiceComponent implements OnInit {
  sale: SaleModel | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private saleService: SaleService) {}

  ngOnInit(): void {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) this.loadInvoice(saleId);
  }

  loadInvoice(id: string) {
    this.saleService.getSaleById(id).subscribe({
      next: (res) => {
        this.sale = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load invoice', err);
        this.loading = false;
      }
    });
  }

  getCustomerName(): string {
    if (!this.sale) return '';
    const customer = this.sale.customer as any;
    return customer?.name || this.sale.customer.toString();
  }

  getCustomerAddress(): string {
    if (!this.sale) return '-';
    const customer = this.sale.customer as any;
    return customer?.address || '-';
  }

  getCustomerPhone(): string {
    if (!this.sale) return '-';
    const customer = this.sale.customer as any;
    return customer?.phone || '-';
  }

  getCashierName(): string {
    if (!this.sale || !this.sale.cashier) return '-';
    const cashier = this.sale.cashier as any;
    return cashier?.username || cashier?.email || this.sale.cashier.toString();
  }

  getProductName(item: any): string {
    const product = item.product as any;
    return product?.name || item.name || '';
  }

  printInvoice() {
    window.print();
  }
}