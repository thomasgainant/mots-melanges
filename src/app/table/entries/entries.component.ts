import { Component } from '@angular/core';
import { TableService, Word } from '../table.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'entries',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent {
  entries:Word[] = [];

  constructor(private tableService:TableService){

  }

  ngOnInit(){
    setTimeout(() => this.entries = this.tableService.wordEntries, 500);
  }
}
