import { CONST } from "../const/const";
import {
  Directions,
  Word,
  ObjectPosition,
} from "../interfaces/utils.interface";
import { Background } from "../objects/background";
import { Clock } from "../objects/clock";
import { Place } from "../objects/place";
import { Populate } from "../objects/populate";
import { Select } from "../objects/select";
import { VisualGrid } from "../objects/visual-grid";
import { Words } from "../objects/words";

export class GameScene extends Phaser.Scene {
  private freezeGame: boolean = false;

  // field and game setting
  private gameHeight: number;
  private gameWidth: number;

  private gameId: string;
  private prefix: string;

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
  private visual: VisualGrid;
  private gird_w_ratio: number = 0.7;
  private gird_h_ratio: number = 0.8;
  private side_gap: number = 50;
  private cells_gap: number = 1;
  private lineColor: number = 0xffcc5c;

  // side words
  private sideWords: Words;
  private scribeDuration: number = 1000;
  private lineWidth: number = 8;
  private lineAlpha: number = 0.7;

  // scribe word

  // emitters
  private mainEmitter: Phaser.Events.EventEmitter;

  /**
   * Sounds
   */
  private right_guess: Phaser.Sound.BaseSound;
  private finish_game: Phaser.Sound.BaseSound;
  private game_over: Phaser.Sound.BaseSound;

  /**
   * Timer
   */
  private text: Phaser.GameObjects.Text;
  private displayText: string;
  private timedEvent: Phaser.Time.TimerEvent;
  private clock: Clock;

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

    this.gameId = data.gameId;
    this.prefix = data.prefix;

    // console.log(data);
  }

  create(): void {
    const bg = new Background(this, "bg", this.gameWidth, this.gameHeight);
    bg.setAlpha(0.3);
    this.mainEmitter = new Phaser.Events.EventEmitter();

    // upper case and join words
    this.words = this.getFormattedWords(this.words);

    CONST.TOTAL_WORDS = this.words.length;

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

    this.visual = new VisualGrid(
      this,
      populate.getPopulatedGrid(),
      this.num_horizontal_cells,
      this.num_vertical_cells,
      this.gameWidth * this.gird_w_ratio,
      this.gameHeight * this.gird_h_ratio,
      this.side_gap,
      this.cells_gap
    );
    // center grid
    const gridH =
      this.visual.getGridBounds().bottom - this.visual.getGridBounds().top;
    const gridCenterY = this.gameHeight / 1.8 - gridH / 2;
    this.visual.setPosition(this.side_gap, gridCenterY);

    this.sideWords = new Words(this, this.words, this.visual.getCellSize());
    this.sideWords.setWordsPosition(
      this.gameWidth * this.gird_w_ratio,
      this.visual.getGridBounds().top
    );

    const selection = new Select(
      this,
      populate.getPopulatedGrid(),
      this.visual.getCells(),
      this.lineColor,
      this.num_horizontal_cells,
      this.mainEmitter
    );
    this.mainEmitter.on("guessedWord", this.wordInputHandler, this);

    this.right_guess = this.sound.add("right_guess");
    this.finish_game = this.sound.add("finish_game");
    this.game_over = this.sound.add("game_over");

    // // text
    let updatedText = "";
    if (this.timer) {
      // this.displayText = "Tempo para acabar o jogo\n";
      CONST.TIME = this.time_to_complete;
      updatedText = `${CONST.TIME}`;
      // timer
      this.timedEvent = this.time.delayedCall(
        this.time_to_complete * 1000,
        this.onEventTimeOver,
        [],
        this
      );

      this.clock = new Clock(this, this.gameWidth, this.gameHeight * 0.1);
      this.clock.updateTime(updatedText);
    }
  }

  update(): void {
    if (this.timer && !CONST.GAME_OVER) {
      this.clock.updateTime(
        `${(this.time_to_complete - this.timedEvent.elapsed / 1000).toFixed(0)}`
      );
    }

    if (CONST.GAME_OVER && !this.freezeGame) {
      this.freezeGame = true;
      if (this.timer) {
        this.clock.cancelAnims();
      }

      this.scene.launch("GameEndScene", {
        width: this.gameWidth,
        height: this.gameHeight,
        win: CONST.WIN,
        gameId: this.gameId,
        prefix: this.prefix,
        timer: this.timer ? (this.timedEvent.elapsed / 1000).toFixed(0) : null,
      });
    }
  }

  private onEventTimeOver(): void {
    console.log("time over");
    CONST.GAME_OVER = true;
    CONST.WIN = false;
  }

  private wordInputHandler(data: any) {
    console.log(data);
    let match = false;
    for (const w of this.words) {
      if (w.word === data.word) {
        // match
        match = true;
        break;
      }
    }

    if (match) {
      console.log("match");
      console.log(data.gridInfo);
      // color cells
      for (const c of data.gridInfo) {
        this.visual.setCellColor(c.x, c.y, this.lineColor);
      }
      // scribe word
      this.sideWords.scribeWord(
        data.word,
        this.lineWidth,
        this.lineColor,
        this.lineAlpha,
        this.scribeDuration
      );

      // game over
      CONST.CURRENT_WORDS_D++;
      console.log(CONST.CURRENT_WORDS_D);
      console.log(CONST.TOTAL_WORDS);
      if (CONST.CURRENT_WORDS_D === CONST.TOTAL_WORDS) {
        CONST.GAME_OVER = true;
        CONST.WIN = true;
      } else {
        this.right_guess.play();
      }
    } else {
      console.log(" no match");
    }
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
