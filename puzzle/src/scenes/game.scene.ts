import { CONST } from "../const/const";
import { TopBar } from "../objects/top-bar";
import { PuzzleGrid } from "../objects/puzzle-grid";
import { Puzzle } from "../objects/puzzle";

export class GameScene extends Phaser.Scene {
  // field and game setting
  private gameHeight: number;
  private gameWidth: number;

  // objects
  private topBar: TopBar;

  private timeToComplete: number | null;
  private piecesSize: number | null;
  private puzzleImage: any;

  private numHorizontalPieces: number;
  private numVerticalPieces: number;

  private pieceW: number;
  private pieceH: number;
  private pieceRadius: number;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(data: any): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;

    this.timeToComplete = data.timeToComplete;
    this.piecesSize = data.piecesSize;
    this.puzzleImage = data.puzzleImage;
  }

  create(): void {
    this.topBar = new TopBar(this, this.gameWidth, this.gameHeight);

    var puzzleGrid = new PuzzleGrid(
      this,
      this.gameWidth,
      this.gameHeight - this.topBar.getHeight(),
      this.topBar.getHeight(),
      this.puzzleImage.id
    );

    // Number of horizontal and vertical pieces that compose the puzzle
    const { horizontal, vertical } = puzzleGrid.calculatePuzzlePieces(
      this.piecesSize
    );
    this.numHorizontalPieces = horizontal;
    this.numVerticalPieces = vertical;

    // dimentions (widht and height) of each piece that reproduces the image (puzzle)
    const { width, height } = puzzleGrid.calculatePieceDimensions(
      this.numHorizontalPieces,
      this.numVerticalPieces
    );
    this.pieceW = width;
    this.pieceH = height;
    this.pieceRadius = (this.pieceW + this.pieceH) / 2 / 3;

    // console.log(puzzleGrid.getImage().width);
    // console.log(puzzleGrid.getImage().height);
    // console.log(this.numHorizontalPieces);
    // console.log(this.numVerticalPieces);
    // console.log(this.pieceW);
    // console.log(this.pieceH);

    var puzzle = new Puzzle(
      this,
      this.numHorizontalPieces,
      this.numVerticalPieces,
      this.pieceW,
      this.pieceH,
      this.pieceRadius
    );

    puzzle.generatePiecesInPuzzleBoard(puzzleGrid.getImage());

    // this.input.on(
    //   "pointerdown",
    //   function (pointer) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );
  }
}
