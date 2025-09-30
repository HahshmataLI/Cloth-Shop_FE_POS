import { Component, OnInit } from '@angular/core';
import { PurchaseModel } from '../../../core/Models/purchase.model';
import { PurchaseService } from '../../../core/services/purchase-service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ConfirmDialog } from "primeng/confirmdialog";
import { RouterLink } from '@angular/router';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-purchase',
  imports: [RouterLink,FormsModule,ReactiveFormsModule , ConfirmDialog,TableModule,InputTextModule,SelectModule,ButtonModule,CommonModule],
  templateUrl: './list-purchase.html',
  styleUrl: './list-purchase.css',
  providers: [ConfirmationService,MessageService]
})
export class ListPurchase   implements OnInit {
  purchases: PurchaseModel[] = [];
  filteredPurchases: PurchaseModel[] = [];
  loading: boolean = true;

  // Pagination
  rows: number = 10;
  first: number = 0;

  // Search
  searchText: string = '';

  constructor(
    private purchaseService: PurchaseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPurchases();
  }

  // ✅ Fetch purchases
  getPurchases(): void {
    this.loading = true;
    this.purchaseService.getPurchases().subscribe({
      next: (res: PurchaseModel[]) => {
        this.purchases = Array.isArray(res) ? res : [];   // ensure array
        this.filteredPurchases = [...this.purchases];     // copy for table
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching purchases:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load purchases'
        });
      }
    });
  }

  // ✅ Filter by search
onSearchChange(): void {
  const search = this.searchText.toLowerCase();
  this.filteredPurchases = this.purchases.filter(
    (p) =>
      p.invoiceNumber?.toLowerCase().includes(search) ||
      p.supplier?.name?.toLowerCase().includes(search) // 👈 safe check
  );
}


  // ✅ Handle pagination
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  // ✅ Open Edit Dialog (placeholder)
  openDialog(purchase: PurchaseModel): void {
    console.log('Edit purchase:', purchase);
    this.messageService.add({
      severity: 'info',
      summary: 'Edit',
      detail: `Editing purchase ${purchase.invoiceNumber}`
    });
  }

  // ✅ Confirm Delete
  confirmDelete(purchase: PurchaseModel): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete purchase <b>${purchase.invoiceNumber}</b>?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePurchase(purchase._id!);
      }
    });
  }

  // ✅ Delete purchase
  deletePurchase(id: string): void {
    this.purchaseService.deletePurchase(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Purchase deleted successfully'
        });
        this.getPurchases(); // refresh list
      },
      error: (err) => {
        console.error('Error deleting purchase:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete purchase'
        });
      }
    });
  }
}