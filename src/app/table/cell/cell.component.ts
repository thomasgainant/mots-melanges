import { Component, Input, SimpleChanges } from '@angular/core';
import { Cell, TableService } from '../table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: '[table-cell]',
  standalone: true,
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {
  @Input() cell:Cell | undefined;
  public content:string = "-";
  public inSelection:boolean = false;
  private selectionSubscription:Subscription | undefined;

  constructor(private tableService:TableService){

  }

  ngOnInit(){
    this.selectionSubscription = this.tableService.$currentSelection.subscribe((newValue:Cell[]) => {
      this.inSelection = false;
      newValue.forEach(element => {
        if(element.x == this.cell?.x && element.y == this.cell?.y)
          this.inSelection = true;
      });
    });
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes["cell"] != null){
      if(this.cell != null)
        setTimeout(() => this.content = this.cell!.content, (this.cell.x + this.cell.y) * 42);
      else
        this.content = "-";
    }
  }

  click(e:Event){
    this.tableService.clickCell(this.cell!);
  }

  hover(e:Event){
    this.tableService.hoverCell(this.cell!);
  }

  out(e:Event){
    this.tableService.outCell(this.cell!);
  }

  ngOnDestroy(){
    this.selectionSubscription!.unsubscribe();
  }
}
