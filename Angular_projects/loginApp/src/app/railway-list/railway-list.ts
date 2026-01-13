import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Table } from '../common/table/table';

@Component({
  selector: 'app-railway-list',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './railway-list.html'
})
export class RailwayListComponent implements OnInit {

  railwayList: any[] = [];
  loading = false;
  errorMsg = '';

  columns = [
    { key: 'id', label: 'Sale ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'indentType', label: 'Indent Type' },
    { key: 'saleType', label: 'Sale Type' },
    { key: 'ratePerKg', label: 'Rate / Kg' },
    { key: 'saleExpense', label: 'Sale Expense' },
    { key: 'netSaleValue', label: 'Net Sale Value' },
    { key: 'saleLocation', label: 'Sale Location' },
    { key: 'saleDate', label: 'Sale Date' },
    { key: 'trainDate', label: 'Train Date' }
  ];

  private apiUrl =
    'https://dev-backend-2025.epravaha.com/api/sale/railway/list';

  constructor(private http: HttpClient) {}

  // ✅ API HIT ONLY HERE
  ngOnInit(): void {
    this.fetchRailwaySales();
  }

  private fetchRailwaySales(): void {
    this.loading = true;
    this.errorMsg = '';

    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMsg = 'Authentication token not found. Please login again.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        this.railwayList = response ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Railway API Error:', error);
        this.errorMsg = 'Unable to load railway sale data';
        this.railwayList = [];
        this.loading = false;
      }
    });
  }
}
