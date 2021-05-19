import { ObjectPosition } from "../interfaces/utils.interface";

export class Populate {
  private scene: Phaser.Scene;
  private populatedGrid: string[][];

  constructor(
    scene: Phaser.Scene,
    grid: string[][],
    num_horizontal_cells: number,
    num_vertical_cells: number,
    empty_char: string,
    ascii_uppercase: string
  ) {
    this.scene = scene;

    this.populatedGrid = this.populateGridRndChars(
      grid,
      num_horizontal_cells,
      num_vertical_cells,
      empty_char,
      ascii_uppercase
    );
  }

  public getPopulatedGrid(): string[][] {
    return this.populatedGrid;
  }

  private populateGridRndChars(
    grid: string[][],
    num_horizontal_cells: number,
    num_vertical_cells: number,
    empty_char: string,
    ascii_uppercase: string
  ): string[][] {
    for (let i = 0; i < num_vertical_cells; i++) {
      for (let j = 0; j < num_horizontal_cells; j++) {
        if (grid[i][j] == empty_char) {
          grid[i][j] = this.randomCharFromStr(ascii_uppercase);
        }
      }
    }

    return grid;
  }

  private randomCharFromStr(str: string) {
    return str[this.getRandomNum(0, str.length - 1)];
  }

  private getRandomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1)) + min;
  }
}
