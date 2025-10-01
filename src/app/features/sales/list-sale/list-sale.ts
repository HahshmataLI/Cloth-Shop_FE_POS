import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ConfirmDialog } from "primeng/confirmdialog";
import { SaleService } from '../../../core/services/sale-service';
import { SaleModel } from '../../../core/Models/sale.model';
@Component({
  selector: 'app-list-sale',
  imports: [CommonModule,ButtonModule,DialogModule,SelectModule,InputTextModule,TableModule,RouterLink,ConfirmDialog],
  templateUrl: './list-sale.html',
  styleUrl: './list-sale.css',
  providers: [ConfirmationService],
})
export class ListSale implements OnInit {
  sales: SaleModel[] = [];
  filteredSales: SaleModel[] = [];
  loading = false;

  // Pagination
  rows = 10;
  first = 0;

  // Search
  searchText = '';

  constructor(
    private saleService: SaleService,
    private confirm: ConfirmationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;
    this.saleService.getSales().subscribe({
      next: (res) => {
        this.sales = res;
        this.filteredSales = [...this.sales];
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load sales');
        this.loading = false;
      }
    });
  }

 applyFilter() {
  const search = this.searchText.toLowerCase();
  this.filteredSales = this.sales.filter(s =>
    (s.invoiceNumber?.toLowerCase().includes(search)) ||
    (s.paymentMethod?.toLowerCase().includes(search))
  );
}


  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  editSale(sale: SaleModel) {
    // Navigate to AddSale with saleId for editing
    // Adjust your AddSale to support edit mode
    window.location.href = `/add-sale/${sale._id}`;
  }

  confirmDelete(sale: SaleModel) {
    this.confirm.confirm({
      message: `Are you sure you want to delete invoice ${sale.invoiceNumber}?`,
      accept: () => {
        this.deleteSale(sale._id!);
      }
    });
  }
viewInvoice(sale: SaleModel) {
  window.open(`/invoice/${sale._id}`, '_blank');
}

printInvoice(sale: SaleModel) {
  window.open(`/invoice/${sale._id}?print=true`, '_blank');
}

downloadPdf(sale: SaleModel) {
  // later we’ll integrate jsPDF/pdfMake here
  this.toastr.info('PDF download feature coming soon');
}

  deleteSale(id: string) {
    this.saleService.deleteSale(id).subscribe({
      next: () => {
        this.toastr.success('Sale deleted');
        this.sales = this.sales.filter(s => s._id !== id);
        this.applyFilter();
      },
      error: () => {
        this.toastr.error('Failed to delete sale');
      }
    });
  }
}