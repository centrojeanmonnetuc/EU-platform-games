import { CONST } from "../const/const";
import { Directions, Word } from "../interfaces/utils.interface";
import { Background } from "../objects/background";
import { Place } from "../objects/place";
import { Populate } from "../objects/populate";
import { Select } from "../objects/select";
import { VisualGrid } from "../objects/visual-grid";

export class GameScene extends Phaser.Scene {
  // field and game setting
  private gameHeight: number;
  private gameWidth: number;

  private num_horizontal_cells: number;
  private num_vertical_cells: number;
  private words: Word[];
  private directions: Directions;
  private timer: boolean;
  private time_to_complete: number;

  // grid
  private wordsGrid: string[][];
  private ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private empty_char: string = "*";

  // visual grid
  private gird_w_ratio = 0.7;
  private gird_h_ratio = 0.8;
  private side_gap = 50;
  private cells_gap = 1;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(data: any): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;

    this.num_horizontal_cells = data.num_horizontal_cells;
    this.num_vertical_cells = data.num_vertical_cells;
    this.words = data.words;
    this.directions = data.directions;
    this.timer = data.timer;
    this.time_to_complete = data.time_to_complete;

    // console.log(data);
  }

  create(): void {
    // new Background(this, "bg", this.gameWidth, this.gameHeight);

    // upper case and join words
    this.words = this.getFormattedWords(this.words);

    const placeWords = new Place(
      this,
      this.num_horizontal_cells,
      this.num_vertical_cells,
      this.words,
      this.directionsArray(this.directions),
      this.empty_char
    );

    const populate = new Populate(
      this,
      placeWords.getGrid(),
      this.num_horizontal_cells,
      this.num_vertical_cells,
      this.empty_char,
      this.ascii_uppercase
    );

    this.wordsGrid = populate.getPopulatedGrid();
    placeWords.printGrid(
      this.wordsGrid,
      this.num_horizontal_cells,
      this.num_vertical_cells
    );

    const visual = new VisualGrid(
      this,
      populate.getPopulatedGrid(),
      this.num_horizontal_cells,
      this.num_vertical_cells,
      this.gameWidth * this.gird_w_ratio,
      this.gameHeight * this.gird_h_ratio,
      this.side_gap,
      this.cells_gap
    );

    // visual.setGridContainerPosition(0, 0);

    const selection = new Select(
      this,
      populate.getPopulatedGrid(),
      visual.getCells(),
      this.num_horizontal_cells
    );
  }

  private getFormattedWords = (arr: Word[]) => {
    const tempWords: Word[] = [];
    arr.forEach((elem) => {
      // upper case
      const word = elem.word.toUpperCase();
      // join spaced words
      tempWords.push({ word: word.split(" ").join(""), word_input: word });
    });
    return tempWords;
  };

  private directionsArray = (directions: Directions) => {
    const temp: string[] = [];
    for (let [key, value] of Object.entries(directions)) {
      if (value) {
        temp.push(key);
      }
    }
    return temp;
  };
}
