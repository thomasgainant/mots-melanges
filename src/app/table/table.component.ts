import { Component, OnInit } from '@angular/core';
import { CellComponent } from './cell/cell.component';
import { Cell, TableService } from './table.service';
import { CommonModule } from '@angular/common';
import { EntriesComponent } from './entries/entries.component';

@Component({
  selector: 'letter-table',
  standalone: true,
  imports: [CommonModule, CellComponent, EntriesComponent],
  providers: [TableService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  public content:Cell[][] = [];

  constructor(private tableService:TableService){

  }

  ngOnInit(){
    this.content = this.tableService.generate();
  }
}
