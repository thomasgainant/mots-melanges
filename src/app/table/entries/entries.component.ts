import { Component } from '@angular/core';
import { TableService, Word } from '../table.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'entries',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent {
  entries:Word[] = [];

  private entriesSubscription:Subscription | undefined;

  constructor(private tableService:TableService){

  }

  ngOnInit(){
    this.entriesSubscription = this.tableService.$wordEntries.subscribe((newValue) => {
      this.entries = newValue;
    });
  }

  ngOnDestroy(){
    this.entriesSubscription?.unsubscribe();
  }
}
