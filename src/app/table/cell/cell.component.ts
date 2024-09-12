import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
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
  public used:boolean = false;

  @ViewChild('containerElement') containerElement:ElementRef<HTMLElement> | undefined;
  @ViewChild('contentElement') contentElement:ElementRef<HTMLElement> | undefined;

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
      if(changes["cell"].previousValue == undefined && this.cell != null)
        setTimeout(() => {
          this.content = this.cell!.content;
          this.updateTextHeight();
          this.replaceSpecialCharacters();
        }, (this.cell.x + this.cell.y) * 42);
      else if(this.cell == undefined)
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

  updateTextHeight(){
    this.contentElement!.nativeElement.setAttribute("style", "font-size: "+this.containerElement?.nativeElement.offsetHeight+"px;");
  }

  replaceSpecialCharacters(){
    switch(this.content){
      case "é":case "è":case "ê":
        this.content = "e";
        break;
    }
  }

  ngOnDestroy(){
    this.selectionSubscription!.unsubscribe();
  }
}
