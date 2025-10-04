import { Injectable } from '@angular/core';
import { SaleModel } from '../Models/sale.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMakeLib: any = pdfMake;
pdfMakeLib.vfs = pdfFonts.vfs;

@Injectable({
  providedIn: 'root'
})
export class   PdfService {

  constructor() {}

  generateInvoice(sale: SaleModel) {
    if (!sale) return;

    // Type-safe customer
    const customer = sale.customer;
    const customerName = typeof customer === 'string' ? '-' : customer?.name || '-';
    const customerPhone = typeof customer === 'string' ? '-' : customer?.phone || '-';
    const customerAddress = typeof customer === 'string' ? '-' : customer?.address || '-';

    // Items with product discount
    const items = sale.items?.map(item => ({
      name: (item.product as any)?.name || item.name,
      qty: item.quantity,
      price: (item.product as any)?.price || item.unitPrice,
      discount: item.discount || 0,
      total: item.total
    })) || [];

    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const total = sale.grandTotal || subtotal;

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      content: [
        // HEADER
        { text: 'SwiftPlay Cloth Shop', style: 'header' },
        { text: 'A Name of Trust', style: 'subheader' },
        { text: 'Plot A-1502, Phase 1 Karachi\n0344-1358101', style: 'small', margin: [0,0,0,20] },

        // INVOICE TITLE
        { text: `Invoice #INV-${sale._id?.slice(-6)}`, style: 'invoiceTitle' },
        { text: `Date: ${sale.date ? new Date(sale.date).toLocaleDateString() : '-'}`, style: 'small', margin: [0,0,0,20] },

        // CUSTOMER DETAILS
        {
          columns: [
            [
              { text: 'Bill To:', style: 'subheader' },
              { text: customerName, style: 'small' },
              { text: customerPhone, style: 'small' },
              { text: customerAddress, style: 'small' }
            ]
          ],
          margin: [0, 0, 0, 20]
        },

        // ITEMS TABLE WITH DISCOUNT
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Product', style: 'tableHeader' },
                { text: 'Qty', style: 'tableHeader' },
                { text: 'Price', style: 'tableHeader' },
                { text: 'Discount', style: 'tableHeader' },
                { text: 'Total', style: 'tableHeader' }
              ],
              ...items.map(i => [
                i.name,
                i.qty,
                `${i.price} PKR`,
                `${i.discount} PKR`,
                `${i.total} PKR`
              ])
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // TOTALS
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                body: [
                  ['Subtotal:', `${subtotal} PKR`],
                  ['Discount on Bill:', `${sale.discount || 0} PKR`],
                  [{ text: 'Grand Total:', bold: true }, { text: `${total} PKR`, bold: true }]
                ]
              },
              layout: 'noBorders'
            }
          ]
        },

        // FOOTER
        { text: 'Thank you for shopping with us!', style: 'footer', margin: [0,30,0,0] }
      ],

      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center' },
        subheader: { fontSize: 12, bold: true, margin: [0,5,0,5] },
        small: { fontSize: 10 },
        invoiceTitle: { fontSize: 15, bold: true, alignment: 'right', color: '#2c3e50' },
        tableHeader: { bold: true, fontSize: 11, color: 'white', fillColor: '#34495e', alignment: 'center' },
        footer: { alignment: 'center', italics: true, fontSize: 10, color: '#7f8c8d' }
      }
    };

    pdfMake.createPdf(docDefinition).download(`Invoice_INV-${sale._id?.slice(-6)}.pdf`);
  }
}
