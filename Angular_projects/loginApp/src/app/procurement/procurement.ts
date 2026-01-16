import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Table } from '../common/table/table'; 

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './procurement.html',
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

  private apiUrl = 'https://dev-backend-2025.epravaha.com/api/procurement/list';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchProcurement();
  }

  fetchProcurement(): void {
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

        // ✅ Some APIs return like { data: [...] }
        // ✅ Some APIs return directly [...]
        const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);

        // ✅ IMPORTANT: always assign new reference
        this.procurementList = [...list];

        this.loading = false;

        // ✅ Force UI update (fix Ctrl+S issue)
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Procurement API Error:', err);
        this.loading = false;
        this.errorMsg = 'Unable to load procurement data';
        this.procurementList = [];

        this.cdr.detectChanges();
      }
    });
  }

  onEdit(row: any) {
    console.log('Edit:', row);
  }

  onDelete(row: any) {
    console.log('Delete:', row);
  }
}
