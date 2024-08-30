import { Component } from '@angular/core';
import { TableService } from '../table.service';

@Component({
  selector: 'timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {
  public durationText:string = "";

  constructor(private tableService:TableService){
    setInterval(() => {
      if(this.tableService.endTime() != null)
        return;

      if(this.tableService.startTime() != null){
        let diffInSeconds = (new Date().getTime() - this.tableService.startTime()!.getTime()) / 1000;

        let hours = Math.floor(diffInSeconds/(60*60));
        let minutes = Math.floor((diffInSeconds - (hours*60*60))/(60));
        let seconds = Math.floor(diffInSeconds - (hours*60*60) - (minutes*60));

        this.durationText = (hours > 0 ? hours + " : " : "") + (new String(minutes).length == 1 ? "0" : "") + minutes + " : " + (new String(seconds).length == 1 ? "0" : "") + seconds;
      }
      else
        this.durationText = "";
    }, 500);
  }
}
