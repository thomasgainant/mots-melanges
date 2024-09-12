import { Component, computed, Signal } from '@angular/core';
import { TableService } from '../table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: '[game-over]',
  standalone: true,
  imports: [],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.css'
})
export class GameOverComponent {
  public wordEntriesSubscription:Subscription;

  public speedText:string = "";
  public durationText:Signal<string>;

  constructor(private tableService:TableService){
    this.wordEntriesSubscription = this.tableService.$wordEntries.subscribe((entries) => {
      let numberOfCharacters = 0;
      for(let entry of entries){
        numberOfCharacters += entry.content.length;
      }

      let diffInSeconds = (this.tableService.endTime()!.getTime() - this.tableService.startTime()!.getTime()) / (1000);
      let speed = Math.round(((numberOfCharacters/(diffInSeconds / 60.0)) + Number.EPSILON) * 100) / 100;
      this.speedText = speed+"lettres par minute";
    });

    this.durationText = computed(() => {
      if(this.tableService.startTime() != null && this.tableService.endTime() != null){
        let diffInSeconds = (this.tableService.endTime()!.getTime() - this.tableService.startTime()!.getTime()) / 1000;

        let hours = Math.floor(diffInSeconds/(60*60));
        let minutes = Math.floor((diffInSeconds - (hours*60*60))/(60));
        let seconds = Math.floor(diffInSeconds - (hours*60*60) - (minutes*60));

        return (hours > 0 ? hours + " heures " : "") + (minutes > 0 ? minutes + " minutes " : "") + (seconds > 0 ? seconds + " secondes" : "");
      }
      return "";
  });
  }

  clickReplay(e:Event){
    this.tableService.generate();
  }
}
