import { Component, OnInit } from '@angular/core';
import { DashboardStats, TopProduct, WeeklySale } from '../../core/Models/dashboardModel';
import { DashboardService } from '../../core/services/dashboard';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TableModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null = null;
  topProducts: TopProduct[] = [];
  weeklySales: WeeklySale[] = [];

  chartData: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTopProducts();
    this.loadWeeklySales();
  }

  loadStats(): void {
    this.dashboardService.getSummary().subscribe((data) => {
      this.stats = data;
    });
  }

  loadTopProducts(): void {
    this.dashboardService.getTopProducts(5).subscribe((data) => {
      this.topProducts = data;
    });
  }

  loadWeeklySales(): void {
    this.dashboardService.getWeeklySales().subscribe((data) => {
      this.weeklySales = data;

      this.chartData = {
        labels: this.weeklySales.map((s) => s._id),
        datasets: [
          {
            label: 'Sales (PKR)',
            data: this.weeklySales.map((s) => s.total),
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            fill: false,
            tension: 0.3
          }
        ]
      };

      this.chartOptions = {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        }
      };
    });
  }
}
