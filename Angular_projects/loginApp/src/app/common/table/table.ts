import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {

  // Table headers
  @Input() columns: { key: string; label: string }[] = [];

  // Table data
  @Input() data: any[] = [];

  // Action buttons flag
  @Input() showActions: boolean = false;

  // Action events
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
trackById(index: number, item: any) {
  return item.id;
}


  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }
}
