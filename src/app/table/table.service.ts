import { Injectable } from '@angular/core';
import dictionary from './dictionary';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  public $currentSelection:BehaviorSubject<Cell[]> = new BehaviorSubject<Cell[]>([]);
  public $currentDirection:BehaviorSubject<DIRECTION> = new BehaviorSubject<DIRECTION>(DIRECTION.RIGHT);

  constructor() {

  }

  clickCell(cell:Cell){
    if(this.$currentSelection.value.length > 0)
      this.$currentSelection.next([]);
    else
      this.$currentSelection.next([ cell ]);
  }

  hoverCell(cell:Cell){
    if(this.$currentSelection.value.length == 1){
      this.$currentSelection.next([ ...this.$currentSelection.value, cell ]);
    }
    else if(this.$currentSelection.value.length > 1){
      this.updateDirection();

      if(
        this.$currentDirection.value == DIRECTION.RIGHT && cell.x > this.$currentSelection.value[this.$currentSelection.value.length - 1].x
        || this.$currentDirection.value == DIRECTION.UP && cell.y < this.$currentSelection.value[this.$currentSelection.value.length - 1].y
        || this.$currentDirection.value == DIRECTION.LEFT && cell.x < this.$currentSelection.value[this.$currentSelection.value.length - 1].x
        || this.$currentDirection.value == DIRECTION.DOWN && cell.y > this.$currentSelection.value[this.$currentSelection.value.length - 1].y
      )
        this.$currentSelection.next([ ...this.$currentSelection.value, cell ]);
    }
  }

  outCell(cell:Cell){
    //TODO
  }

  private updateDirection(){
    if(this.$currentSelection.value[1].x > this.$currentSelection.value[0].x)
      this.$currentDirection.next(DIRECTION.RIGHT);
    else if(this.$currentSelection.value[1].y < this.$currentSelection.value[0].y)
      this.$currentDirection.next(DIRECTION.UP);
    else if(this.$currentSelection.value[1].x < this.$currentSelection.value[0].x)
      this.$currentDirection.next(DIRECTION.LEFT);
    else if(this.$currentSelection.value[1].y > this.$currentSelection.value[0].y)
      this.$currentDirection.next(DIRECTION.DOWN);
  }

  /* BACKEND */

  public wordEntries:Word[] = [];
  public generate():Cell[][]{
    let result:Cell[][] = [];

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    for(let y = 0; y < 20; y++){
      let row:Cell[] = [];
      for(let x = 0; x < 20; x++){
        let randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
        row.push(new Cell(x, y, randomCharacter));
      }
      result.push(row);
    }

    let words = dictionary;
    words = words.filter((word) => {
      return (word.indexOf(" ") == -1) && (word.indexOf("-") == -1);
    })
    for(let w = 0; w < 50; w++){
      let randomWord = words[Math.floor(Math.random() * words.length)];

      //TODO random placement instead of mocked cells

      this.wordEntries.push(new Word(new Cell(-1, -1, ""), new Cell(-1, -1, ""), randomWord));
    }

    return result;
  }
}

export enum DIRECTION{
  RIGHT, UP, LEFT, DOWN
}


export class Cell{
  public x:number = -1;
  public y:number = -1;
  public content:string = "";

  constructor(x:number, y:number, content:string){
    this.x = x;
    this.y = y;
    this.content = content;
  }
}

export class Word{
  public start:Cell;
  public end:Cell;
  public word:string;
  public found:boolean = false;

  constructor(start:Cell, end:Cell, word:string){
    this.start = start;
    this.end = end;
    this.word = word;
  }
}
