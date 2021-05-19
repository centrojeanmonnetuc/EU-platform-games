import {
  ObjectPosition,
  SelectInfo,
  GridPos,
} from "../interfaces/utils.interface";
import { Cell } from "../objects/cell";

export class Select {
  private scene: Phaser.Scene;
  private num_hor_cells: number;

  // select
  private selection: Phaser.GameObjects.Graphics;
  private line: Phaser.Geom.Line;
  private lineColor: number = 0xffcc5c;

  // objects selected
  private firstObj: Cell;
  private lastObj: Cell;

  constructor(
    scene: Phaser.Scene,
    populatedGrid: string[][],
    cells: Cell[],
    num_hor_cells: number
  ) {
    this.scene = scene;
    this.num_hor_cells = num_hor_cells;

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

      const cellBounds = gameObject[0].getBounds();

      line.setTo(cellBounds.centerX, cellBounds.centerY, pointer.x, pointer.y);
      selection.clear();
      selection.lineStyle(2, lineColor);
      selection.strokeLineShape(line);

      this.firstObj = this.findClickedChar(cells, gameObject[0]);
    });

    this.scene.input.on("pointermove", (pointer: any) => {
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
      this.lastObj = this.findClickedChar(cells, gameObject[0]);

      selection.clear();
      this.discoverWord(this.firstObj, this.lastObj, populatedGrid);

      // verify word
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

  private discoverWord(
    firstObj: Cell,
    lastObj: Cell,
    grid: string[][]
  ): string {
    var guess = {
      word: "",
      direction: "",
      first_cell_pos: "",
      last_cell_pos: "",
      cells: [],
    };

    console.log(firstObj);
    console.log(lastObj);
    const firstCellBounds = firstObj.getCellImg().getBounds();
    const lastCellBounds = lastObj.getCellImg().getBounds();

    // corresponds to the grid witdth
    // offset to skip a column in a 1-D array
    let cell_offset = this.num_hor_cells;

    // to work for reverse words
    // if (guess.frist_cell_pos > guess.last_cell_pos) {
    //   let temp_cell_pos = guess.last_cell_pos;
    //   guess.last_cell_pos = guess.frist_cell_pos;
    //   guess.frist_cell_pos = temp_cell_pos;
    // }

    const selectInfo: SelectInfo = {
      start_x: firstObj.getGridPos().x,
      start_y: firstObj.getGridPos().y,
      end_x: lastObj.getGridPos().x,
      end_y: lastObj.getGridPos().y,
      selected_coors: [],
    };
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
      console.log("rd");
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
      console.log("ld");
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
    console.log(selectInfo.selected_coors);
    console.log("Word Guess: " + guess.word);
    return guess.word;
  }
}
