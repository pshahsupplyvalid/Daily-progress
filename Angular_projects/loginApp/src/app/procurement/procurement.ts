import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CommonTableComponent } from '../common/common-table';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, CommonTableComponent],
  templateUrl: './procurement.html',
  styleUrl: './procurement.css'
})
export class ProcurementComponent implements OnInit {

  loading = false;
  errorMsg = '';
  procurementList: any[] = [];

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'itemName', label: 'Item Name' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'status', label: 'Status' }
  ];

  private apiUrl =
    'https://dev-backend-2025.epravaha.com/api/farmer';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProcurement();
  }

  fetchProcurement() {
    this.loading = true;
    this.errorMsg = '';

    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.procurementList = res?.data || res || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Unable to fetch procurement data';
      }
    });
  }
}
