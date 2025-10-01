import { Component, OnInit } from '@angular/core';
import { SaleModel } from '../../../core/Models/sale.model';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-invoice-component',
  imports: [CommonModule],
  templateUrl: './invoice-component.html',
  styleUrl: './invoice-component.css'
})
export class InvoiceComponent implements OnInit {
  sale!: SaleModel;

  constructor(private location: Location) {
    const nav = this.location.getState() as { sale: SaleModel };
    this.sale = nav.sale;
  }

  ngOnInit(): void {}

  print() {
    window.print();
  }
}