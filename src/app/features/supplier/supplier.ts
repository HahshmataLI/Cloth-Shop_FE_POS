import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { SupplierModel } from '../../core/Models/SupplierModel';
import { supplierService } from '../../core/services/supplier';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier',
  imports: [ReactiveFormsModule,CommonModule,TableModule,FormsModule,ButtonModule,DialogModule,InputTextModule,ConfirmDialogModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
  providers: [ConfirmationService],
})
export class Supplier implements OnInit {
  suppliers: SupplierModel[] = [];
  supplierForm!: FormGroup;

  displayDialog: boolean = false;
  selectedSupplierId: string | null = null;

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  loading: boolean = true;

  constructor(
    private supplierService: supplierService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService   // ✅ inject
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
  }

  initForm() {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      company: [''],
      address: [''],
      notes: [''],
    });
  }

  loadSuppliers() {
    this.loading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res || [];
        this.totalRecords = this.suppliers.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load suppliers!', 'Error');
      },
    });
  }

  openNew() {
    this.supplierForm.reset();
    this.selectedSupplierId = null;
    this.displayDialog = true;
  }

  editSupplier(supplier: SupplierModel) {
    this.supplierForm.patchValue(supplier);
    this.selectedSupplierId = supplier._id ?? null;
    this.displayDialog = true;
  }

  saveSupplier() {
    if (this.supplierForm.invalid) return;

    const supplierData: SupplierModel = this.supplierForm.value;

    if (this.selectedSupplierId) {
      this.supplierService.updateSupplier(this.selectedSupplierId, supplierData).subscribe({
        next: () => {
          this.toastr.success('Supplier updated successfully!', 'Success');
          this.loadSuppliers();
          this.hideDialog();
        },
        error: () => this.toastr.error('Failed to update supplier!', 'Error'),
      });
    } else {
      this.supplierService.createSupplier(supplierData).subscribe({
        next: () => {
          this.toastr.success('Supplier added successfully!', 'Success');
          this.loadSuppliers();
          this.hideDialog();
        },
        error: () => this.toastr.error('Failed to add supplier!', 'Error'),
      });
    }
  }

  // ✅ confirmation before delete
  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this supplier?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSupplier(id);
      }
    });
  }

  private deleteSupplier(id: string) {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.toastr.success('Supplier deleted successfully!', 'Success');
        this.loadSuppliers();
      },
      error: () => this.toastr.error('Failed to delete supplier!', 'Error'),
    });
  }

  hideDialog() {
    this.displayDialog = false;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}