import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnChanges {

  // ✅ Table headers
  @Input() columns: { key: string; label: string }[] = [];

  // ✅ Full table data (raw)
  @Input() data: any[] = [];

  // ✅ Show actions
  @Input() showActions: boolean = false;

  // ✅ Enable features
  @Input() enableSearch: boolean = true;
  @Input() enablePagination: boolean = true;

  // ✅ Pagination settings
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() defaultPageSize: number = 10;

  // ✅ Action events
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  // ✅ Search text
  searchText: string = '';

  // ✅ Pagination state
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;

  // ✅ Internal arrays
  filteredData: any[] = [];
  pagedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.pageSize = this.defaultPageSize;
      this.currentPage = 1;
      this.searchText = '';

      this.filteredData = [...(this.data || [])];

      this.totalRecords = this.filteredData.length;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

      this.updatePagedData();
    }
  }

  // ✅ Search filter
  onSearchChange() {
    const text = this.searchText.trim().toLowerCase();

    if (!text) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter((row: any) => {
        // ✅ Search through all columns
        return this.columns.some((col: any) => {
          const value = row?.[col.key];
          return value !== null && value !== undefined
            ? value.toString().toLowerCase().includes(text)
            : false;
        });
      });
    }

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1;

    this.updatePagedData();
  }

  clearSearch() {
    this.searchText = '';
    this.filteredData = [...this.data];

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1;

    this.updatePagedData();
  }

  // ✅ Pagination
  updatePagedData() {
    if (!this.enablePagination) {
      this.pagedData = [...this.filteredData];
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  changePageSize(event: any) {
    this.pageSize = Number(event.target.value);

    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1;

    this.updatePagedData();
  }

  // ✅ Track by id
  trackById(index: number, item: any) {
    return item?.id ?? index;
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }
}
