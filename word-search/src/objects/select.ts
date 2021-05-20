import { ObjectPosition, SelectInfo } from "../interfaces/utils.interface";
import { Cell } from "../objects/cell";

export class Select {
  private scene: Phaser.Scene;
  private num_hor_cells: number;

  // select
  private selection: Phaser.GameObjects.Graphics;
  private line: Phaser.Geom.Line;
  private lineColor: number;

  // objects selected
  private firstObj: Cell;
  private lastObj: Cell;

  // event
  private emitter: Phaser.Events.EventEmitter;

  constructor(
    scene: Phaser.Scene,
    populatedGrid: string[][],
    cells: Cell[],
    lineColor: number,
    num_hor_cells: number,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene;
    this.lineColor = lineColor;
    this.num_hor_cells = num_hor_cells;
    this.emitter = emitter;

    this.selection = this.scene.add.graphics();
    this.selection.setDepth(2);
    this.line = new Phaser.Geom.Line();
    var word_strikethrough = this.scene.add.graphics({
      lineStyle: { width: 3, color: this.lineColor, alpha: 0.6 },
    });

    this.drawLine(
      this.selection,
      this.line,
      this.lineColor,
      cells,
      populatedGrid
    );
  }

  private drawLine(
    selection: Phaser.GameObjects.Graphics,
    line: Phaser.Geom.Line,
    lineColor: number,
    cells: Cell[],
    populatedGrid: string[][]
  ): void {
    this.scene.input.on("pointerdown", (pointer: any, gameObject: any) => {
      // verify if its inside
      if (!gameObject[0]) return;

      const cellBounds = gameObject[0].getBounds();

      line.setTo(cellBounds.centerX, cellBounds.centerY, pointer.x, pointer.y);
      selection.clear();
      selection.lineStyle(2, lineColor);
      selection.strokeLineShape(line);

      this.firstObj = this.findClickedChar(cells, gameObject[0]);
    });

    this.scene.input.on("pointermove", (pointer: any, gameObject: any) => {
      if (!gameObject[0]) {
        selection.clear();
        return;
      }
      if (!pointer.isDown) return;
      // limit inside grid
      line.x2 = pointer.x;
      line.y2 = pointer.y;
      selection.clear();
      selection.lineStyle(20, lineColor);
      selection.setAlpha(0.5);
      selection.strokeLineShape(line);
    });

    this.scene.input.on("pointerup", (pointer: any, gameObject: any) => {
      if (!gameObject[0]) {
        selection.clear();
        return;
      }

      this.lastObj = this.findClickedChar(cells, gameObject[0]);

      selection.clear();

      const guess: ObjectPosition[] = this.discoverUserInput(
        this.firstObj,
        this.lastObj
      );
      // if there's a word
      if (guess.length > 0) {
        // verify word
        const guessed_word = this.getWord(guess, populatedGrid);
        console.log(guessed_word);
        this.emitter.emit("guessedWord", {
          gridInfo: guess,
          word: guessed_word,
        });
      }
    });
  }

  private findClickedChar(cells: Cell[], image: Phaser.GameObjects.Image): any {
    for (const cell of cells) {
      if (cell.getCellImg() === image) {
        return cell;
      }
    }
    return null;
  }

  private getWord(arr: ObjectPosition[], grid: string[][]): string {
    let word = "";
    for (const pos of arr) {
      word += grid[pos.y][pos.x];
    }
    return word;
  }

  private discoverUserInput(firstObj: Cell, lastObj: Cell): ObjectPosition[] {
    const selectInfo: SelectInfo = {
      start_x: firstObj.getGridPos().x,
      start_y: firstObj.getGridPos().y,
      end_x: lastObj.getGridPos().x,
      end_y: lastObj.getGridPos().y,
      selected_coors: [],
    };

    // to work for reverse words
    if (
      selectInfo.start_x + selectInfo.start_y >
      selectInfo.end_x + selectInfo.end_y
    ) {
      console.log("troca");
      selectInfo.start_x = lastObj.getGridPos().x;
      selectInfo.start_y = lastObj.getGridPos().y;

      selectInfo.end_x = firstObj.getGridPos().x;
      selectInfo.end_y = firstObj.getGridPos().y;
    }

    // find the direction of the word
    // DOWN
    if (selectInfo.start_x == selectInfo.end_x) {
      for (let i = selectInfo.start_y; i <= selectInfo.end_y; i++) {
        selectInfo.selected_coors.push({ x: selectInfo.start_x, y: i });
      }
    }
    // RIGHT
    else if (selectInfo.start_y == selectInfo.end_y) {
      for (let i = selectInfo.start_x; i <= selectInfo.end_x; i++) {
        selectInfo.selected_coors.push({ x: i, y: selectInfo.start_y });
      }
    }
    // // RIGHT-DOWN
    else if (
      selectInfo.start_x - selectInfo.start_y ==
      selectInfo.end_x - selectInfo.end_y
    ) {
      let counter = selectInfo.start_x;
      for (let i = selectInfo.start_y; i <= selectInfo.end_y; i++) {
        selectInfo.selected_coors.push({
          x: counter++,
          y: i,
        });
      }
    }
    // // LEFT-DOWN
    else if (
      selectInfo.start_x + selectInfo.start_y ==
      selectInfo.end_x + selectInfo.end_y
    ) {
      let counter = selectInfo.start_x;
      for (let i = selectInfo.start_y; i <= selectInfo.end_y; i++) {
        selectInfo.selected_coors.push({
          x: counter--,
          y: i,
        });
      }
    } else {
      console.log("direction not found");
    }
    return selectInfo.selected_coors;
  }
}
