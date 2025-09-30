import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../core/services/customer-service';
import { CustomerModel } from '../../../core/Models/customer.model';

import { CommonModule } from '@angular/common';

import { TextareaModule } from 'primeng/textarea';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-customer-list',
  imports: [TextareaModule,ConfirmDialogModule,DialogModule,InputTextModule,ButtonModule,TableModule,FormsModule,CommonModule],

  providers: [ConfirmationService],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList  implements OnInit {
  customers: CustomerModel[] = [];
  loading: boolean = true;

  // Dialog
  displayDialog: boolean = false;
  newCustomer: CustomerModel = { name: '', phone: '', email: '', address: '', notes: '' };

  // Pagination
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (res) => {
       this.customers = res;;
        this.totalRecords = this.customers.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load customers!', 'Error');
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  openDialog(customer?: CustomerModel) {
    this.newCustomer = customer ? { ...customer } : { name: '', phone: '', email: '', address: '', notes: '' };
    this.displayDialog = true;
  }

  saveCustomer() {
    if (!this.newCustomer.name.trim() || !this.newCustomer.phone.trim()) {
      this.toastr.warning('Name and Phone are required!', 'Warning');
      return;
    }

    if (this.newCustomer._id) {
      // Update
      this.customerService.updateCustomer(this.newCustomer._id, this.newCustomer).subscribe({
        next: () => {
          this.toastr.success('Customer updated successfully!', 'Updated');
          this.loadCustomers();
          this.displayDialog = false;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to update customer!', 'Error');
        }
      });
    } else {
      // Create
      this.customerService.createCustomer(this.newCustomer).subscribe({
        next: () => {
          this.toastr.success('Customer added successfully!', 'Success');
          this.loadCustomers();
          this.displayDialog = false;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to add customer!', 'Error');
        }
      });
    }
  }

  editCustomer(customer: CustomerModel) {
    this.openDialog(customer);
  }

  deleteCustomer(customer: CustomerModel) {
    if (!customer._id) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete <b>${customer.name}</b>?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.customerService.deleteCustomer(customer._id!).subscribe({
          next: () => {
            this.toastr.success('Customer deleted successfully!', 'Deleted');
            this.loadCustomers();
          },
          error: () => {
            this.toastr.error('Failed to delete customer!', 'Error');
          }
        });
      }
    });
  }
}