import { Injectable } from '@angular/core';
import dictionary from './dictionary';
import { BehaviorSubject } from 'rxjs';

//TODO implement game end
//TODO switch to a single syncable Game entity
//TODO all entities are moved in their own directory
//TODO all methods in the Backend category are replaced by a call to some backend, not directly inside this service

@Injectable({
  providedIn: 'root'
})
export class TableService {

  public $cells:BehaviorSubject<Cell[][]> = new BehaviorSubject<Cell[][]>([]);

  public $currentSelection:BehaviorSubject<Cell[]> = new BehaviorSubject<Cell[]>([]);
  public $currentDirection:BehaviorSubject<DIRECTION> = new BehaviorSubject<DIRECTION>(DIRECTION.RIGHT);

  public $wordEntries:BehaviorSubject<Word[]> = new BehaviorSubject<Word[]>([]);

  constructor() {

  }

  clickCell(cell:Cell){
    if(this.$currentSelection.value.length > 0){
      let result = this.checkCellsInput(this.$currentSelection.value.slice(1));
      if(result != null){
        let wordFound = this.$wordEntries.value.find(element => element.content == result.content);
        wordFound!.found = true;

        for(let selectedCell of this.$currentSelection.value){
          selectedCell.used = true;
        }
      }
      this.$currentSelection.next([]);
    }
    else
      this.$currentSelection.next([ cell ]);
  }

  hoverCell(cell:Cell){
    if(this.$currentSelection.value.length > 0){
      this.$currentSelection.next([...this.getNextCells(cell)]);
    }
  }

  outCell(cell:Cell){
    //Do nothing for the moment
  }

  private getNextCells(goal:Cell):Cell[]{
    let result:Cell[] = [];

    let start = this.$currentSelection.value[0];

    let diff = {
      x: goal.x - start.x,
      y: goal.y - start.y
    };

    let angleRight = this.angleBetween(diff.x, diff.y, 1, 0);
    let angleUp = this.angleBetween(diff.x, diff.y, 0, -1);
    let angleLeft = this.angleBetween(diff.x, diff.y, -1, 0);
    let angleDown = this.angleBetween(diff.x, diff.y, 0, 1);

    //console.log(angleRight + "/" + angleUp + "/" + angleLeft + "/" + angleDown);

    let angleRightDiff = Math.abs(360.0 - angleRight);
    let angleUpDiff = Math.abs(270.0 - angleUp);
    let angleLeftDiff = Math.abs(180.0 - angleLeft);
    let angleDownDiff = Math.abs(90.0 - angleDown);

    //console.log(angleRightDiff + "/" + angleUpDiff + "/" + angleLeftDiff + "/" + angleDownDiff);

    if(angleRightDiff < angleUpDiff && angleRightDiff < angleLeftDiff && angleRightDiff < angleDownDiff){
      this.$currentDirection.next(DIRECTION.RIGHT);
    }
    else if(angleUpDiff < angleLeftDiff && angleUpDiff < angleDownDiff && angleUpDiff < angleRightDiff){
      this.$currentDirection.next(DIRECTION.UP);
    }
    else if(angleLeftDiff < angleDownDiff && angleLeftDiff < angleRightDiff && angleLeftDiff < angleUpDiff){
      this.$currentDirection.next(DIRECTION.LEFT);
    }
    else if(angleDownDiff < angleRightDiff && angleDownDiff < angleUpDiff && angleDownDiff < angleLeftDiff){
      this.$currentDirection.next(DIRECTION.DOWN);
    }
    else{
      this.$currentDirection.next(DIRECTION.RIGHT);
    }

    result.push(start);
    if(this.$currentDirection.value == DIRECTION.RIGHT){
      let length = goal.x - start.x;
      for(let i = 0; i < length; i++){
        let nextCell = this.getCellAt(start.x + i, start.y);
        if(nextCell != null)
          result.push(nextCell);
      }
    }
    else if(this.$currentDirection.value == DIRECTION.UP){
      let length = start.y - goal.y;
      for(let i = 0; i < length; i++){
        let nextCell = this.getCellAt(start.x, start.y - i);
        if(nextCell != null)
          result.push(nextCell);
      }
    }
    else if(this.$currentDirection.value == DIRECTION.LEFT){
      let length = start.x - goal.x;
      for(let i = 0; i < length; i++){
        let nextCell = this.getCellAt(start.x - i, start.y);
        if(nextCell != null)
          result.push(nextCell);
      }
    }
    else if(this.$currentDirection.value == DIRECTION.DOWN){
      let length = goal.y - start.y;
      for(let i = 0; i < length; i++){
        let nextCell = this.getCellAt(start.x, start.y + i);
        if(nextCell != null)
          result.push(nextCell);
      }
    }

    return result;
  }

  private angleBetween(x1:number, y1:number, x2:number, y2:number){
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 180;
  }

  private getCellAt(x:number, y:number){
    for(let cellRow of this.$cells.value){
      for(let cell of cellRow){
        if(cell.x == x && cell.y == y)
          return cell;
      }
    }
    return null;
  }

  /* BACKEND */
  public gridSizeY = 20;
  public gridSizeX = 20;

  public generate():Cell[][]{
    let result:Cell[][] = [];
    let newWordEntries:Word[] = [];

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    for(let y = 0; y < this.gridSizeY; y++){
      let row:Cell[] = [];
      for(let x = 0; x < this.gridSizeX; x++){
        let randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
        row.push(new Cell(x, y, randomCharacter));
      }
      result.push(row);
    }

    this.$cells.next(result);
    let alreadyChangedCells:Cell[] = [];

    let words = dictionary;
    words = words.filter((word) => {
      return (word.indexOf(" ") == -1) && (word.indexOf("-") == -1);
    })
    for(let w = 0; w < 50; w++){
      let randomWord = words[Math.floor(Math.random() * words.length)];
      let chosenCells:Cell[] = [];

      let attempts = 0;
      while(attempts <= 1000){
        let start = this.getCellAt(
          Math.floor(Math.random() * this.gridSizeX),
          Math.floor(Math.random() * this.gridSizeY)
        );

        if(start != null){
          let randomDirection = Math.floor(Math.random() * 5.0);
          if(randomDirection == 0){
            for(let i = 0; i < randomWord.length; i++){
              let chosenCell = this.getCellAt(start.x + i, start.y);
              if(chosenCell != null)
                chosenCells.push(chosenCell);
            }
          }
          else if(randomDirection == 1){
            for(let i = 0; i < randomWord.length; i++){
              let chosenCell = this.getCellAt(start.x, start.y - i);
              if(chosenCell != null)
                chosenCells.push(chosenCell);
            }
          }
          else if(randomDirection == 2){
            for(let i = 0; i < randomWord.length; i++){
              let chosenCell = this.getCellAt(start.x - i, start.y);
              if(chosenCell != null)
                chosenCells.push(chosenCell);
            }
          }
          else{
            for(let i = 0; i < randomWord.length; i++){
              let chosenCell = this.getCellAt(start.x, start.y + i);
              if(chosenCell != null)
                chosenCells.push(chosenCell);
            }
          }

          if(chosenCells.length == randomWord.length){
            let canUseEveryCellsOnGrid = true;

            for(let i = 0; i < randomWord.length; i++){
              let chosenCell = chosenCells[i];
              let alreadyChangedCell = alreadyChangedCells.find(element => element.x == chosenCell.x && element.y == chosenCell.y);
              if(alreadyChangedCell != null && alreadyChangedCell.content != randomWord[i]){
                canUseEveryCellsOnGrid = false;
                break;
              }
            }

            if(canUseEveryCellsOnGrid){
              for(let i = 0; i < randomWord.length; i++){
                chosenCells[i].content = randomWord[i];
                alreadyChangedCells.push(chosenCells[i]);
              }
              break;
            }
          }
        }

        chosenCells = [];
        attempts++;
      }

      if(attempts <= 1000)
        newWordEntries.push(new Word(chosenCells[0], chosenCells[chosenCells.length - 1], randomWord));
    }

    console.log(this.$cells.value);
    console.log(newWordEntries);
    this.$cells.next([...this.$cells.value]); //Push data to subscribers, this time with placed words
    this.$wordEntries.next(newWordEntries);
    return result;
  }

  checkCellsInput(cells:Cell[]):Word | undefined{
    let contentToCheck = "";
    for(let cell of cells){
      contentToCheck += cell.content;
    }
    console.log("Cell set content to check: "+contentToCheck);

    for(let word of this.$wordEntries.value){
      if(
        word.start.x == cells[0].x
        && word.start.y == cells[0].y
        && word.end.x == cells[cells.length - 1].x
        && word.end.y == cells[cells.length - 1].y
      ){
        let found = true;

        for(let i = 0; i < cells.length; i++){
          if(word.content[i] != cells[i].content){
            found = false;
            break;
          }
        }

        if(found){
          for(let cell of cells){
            cell.used = true;
          }
          this.$cells.next([...this.$cells.value]); //Push data to subscribers, this time with cells set as used
          return word;
        }
      }
    }
    return undefined;
  }
}

export enum DIRECTION{
  RIGHT, UP, LEFT, DOWN
}


export class Cell{
  public x:number = -1;
  public y:number = -1;
  public content:string = "";
  public used:boolean = false;

  constructor(x:number, y:number, content:string){
    this.x = x;
    this.y = y;
    this.content = content;
  }
}

export class Word{
  public start:Cell;
  public end:Cell;
  public content:string;
  public found:boolean = false;

  constructor(start:Cell, end:Cell, word:string){
    this.start = start;
    this.end = end;
    this.content = word;
  }
}

export class Game{
  public cells:Cell[][] = [];
  public wordEntries:Word[] = [];
}
