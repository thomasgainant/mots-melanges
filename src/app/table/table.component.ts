import { Component, OnInit } from '@angular/core';
import { CellComponent } from './cell/cell.component';
import { Cell, TableService } from './table.service';
import { CommonModule } from '@angular/common';
import { EntriesComponent } from './entries/entries.component';
import { Subscription } from 'rxjs';

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
  private contentSubscription:Subscription | undefined;

  constructor(private tableService:TableService){

  }

  ngOnInit(){
    this.tableService.$cells.subscribe(newValue => {
      this.content = newValue;
    });
    this.tableService.generate();
  }

  ngOnDestroy(){
    this.contentSubscription?.unsubscribe();
  }
}
