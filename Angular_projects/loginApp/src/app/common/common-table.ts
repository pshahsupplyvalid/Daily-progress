import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-common-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-table.html',
  styleUrl: './common-table.css'
})
export class CommonTableComponent {

  // 🔹 table headers
  @Input() columns: { key: string; label: string }[] = [];

  // 🔹 table data
  @Input() data: any[] = [];

  // 🔹 loading state
  @Input() loading = false;

  // 🔹 error message
  @Input() errorMsg = '';

}
