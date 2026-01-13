import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Table } from '../common/table/table';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './procurement.html'
})
export class ProcurementComponent implements OnInit {

  procurementList: any[] = [];
  loading = false;
  errorMsg = '';

  columns = [
    { key: 'id', label: 'Procurement ID' },
    { key: 'farmerName', label: 'Farmer Name' },
    { key: 'federationName', label: 'Federation Name' },
    { key: 'procureCenterName', label: 'Procure Center' },
    { key: 'procureDate', label: 'Procure Date' },
    { key: 'approvedQuantityMT', label: 'Quantity (MT)' },
    { key: 'approvedPurchaseValue', label: 'Approved Value' },
    { key: 'purchaseValue', label: 'Purchase Value' },
    { key: 'approvalStatus', label: 'Status' },
    { key: 'procureType', label: 'Procure Type' }
  ];

  private apiUrl =
    'https://dev-backend-2025.epravaha.com/api/procurement/list';

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.fetchProcurement();
  }

  fetchProcurement(): void {
    debugger
    this.loading = true;
    this.errorMsg = '';

    const token = localStorage.getItem('token');

    if (!token) {
      this.loading = false;
      this.errorMsg = 'Authentication token not found. Please login again.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        // Safety check
        this.procurementList = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Procurement API Error:', err);
        this.loading = false;
        this.errorMsg = 'Unable to load procurement data';
        this.procurementList = [];
      }
    });
  }

  // Optional – future use
  onEdit(row: any) {
    console.log('Edit:', row);
  }

  onDelete(row: any) {
    console.log('Delete:', row);
  }
}
  