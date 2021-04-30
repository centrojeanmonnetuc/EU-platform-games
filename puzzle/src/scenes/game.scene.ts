import { CONST } from "../const/const";
import { TopBar } from "../objects/top-bar";
import { PuzzleGrid } from "../objects/puzzle-grid";
import { Puzzle } from "../objects/puzzle";
import { checkLockPosition } from "../utils/puzzle";
import { PiecesKeeper } from "../objects/pieces-keeper";
import { PieceCoor, PiecesBoard } from "../interfaces/utils.interface";
import { Piece } from "../objects/piece";
import { Clock } from "../objects/clock";
import { Background } from "../objects/background";

export class GameScene extends Phaser.Scene {
  // field and game setting
  private gameHeight: number;
  private gameWidth: number;

  // puzzle dimensions
  private puzzleW: number = 0.6;
  private puzzleH: number = 0.7;

  //

  // objects
  private topBar: TopBar;
  private topBarSize: number = 0.1;

  private timeToComplete: number | null;
  private piecesSize: number;
  private puzzleImage: any;

  private numHorizontalPieces: number;
  private numVerticalPieces: number;

  private pieceW: number;
  private pieceH: number;
  private pieceRadius: number;
  private outsidePiecesScale: number;

  private depthCounter: number = 0;

  private pieceLockTolerance: number = 50;
  private piecesRightCoors: PieceCoor[];

  /**
   * Sounds
   */
  private select_sound: Phaser.Sound.BaseSound;
  private drop_sound: Phaser.Sound.BaseSound;
  private right_sound: Phaser.Sound.BaseSound;
  private complete_sound: Phaser.Sound.BaseSound;

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

    this.timeToComplete = data.timeToComplete;
    this.piecesSize = data.piecesSize;
    this.puzzleImage = data.puzzleImage;
  }

  create(): void {
    new Background(this, "bg", this.gameWidth, this.gameHeight);
    // this.topBar = new TopBar(this, this.gameWidth, this.gameHeight);

    // puzzle dimensions

    var puzzleGrid = new PuzzleGrid(
      this,
      this.gameWidth,
      this.gameHeight + this.topBarSize * this.gameHeight,
      this.puzzleW,
      this.puzzleH,
      this.puzzleImage.id
    );

    // Number of horizontal and vertical pieces that compose the puzzle
    const { horizontal, vertical } = puzzleGrid.calculatePuzzlePieces(
      this.piecesSize
    );
    this.numHorizontalPieces = horizontal;
    this.numVerticalPieces = vertical;
    CONST.TOTAL_PIECES = horizontal * vertical;
    // dimentions (widht and height) of each piece that reproduces the image (puzzle)
    const { width, height } = puzzleGrid.calculatePieceDimensions(
      this.numHorizontalPieces,
      this.numVerticalPieces
    );
    this.pieceW = width;
    this.pieceH = height;
    this.pieceRadius = (this.pieceW + this.pieceH) / 2 / 3;

    // piece size value in function of puzzle pieces size
    let pieceReductionValue;
    if (this.piecesSize === 150) {
      pieceReductionValue = 0.05;
    } else {
      pieceReductionValue = 0.1;
    }
    // what's the scale for this piece to fit in the side containers?
    this.outsidePiecesScale =
      (this.gameWidth * pieceReductionValue) / this.pieceW;

    // console.log(this.numHorizontalPieces);
    // console.log(this.numVerticalPieces);
    // console.log(this.pieceW);
    // console.log(this.pieceH);
    // console.log(this.pieceRadius);

    var puzzle = new Puzzle(
      this,
      this.numHorizontalPieces,
      this.numVerticalPieces,
      this.pieceW,
      this.pieceH,
      this.pieceRadius,
      this.outsidePiecesScale,
      puzzleGrid.getPiecesBoardDimensions()
    );
    this.piecesRightCoors = puzzle.generatePiecesInPuzzleBoard(
      puzzleGrid.getImage()
    );
    const piecesArr = puzzle.generateOutsidePieces(puzzleGrid.getImageAux());

    const container1: PiecesBoard = {
      x: this.pieceH * this.outsidePiecesScale,
      y: this.gameHeight * 0.1,
      width:
        puzzleGrid.getImage().getBounds().left -
        this.pieceH * this.outsidePiecesScale,
      height: this.gameHeight - this.pieceH * this.outsidePiecesScale,
    };
    const container2: PiecesBoard = {
      x:
        puzzleGrid.getImage().getBounds().right +
        this.pieceH * this.outsidePiecesScale,
      y: this.gameHeight * 0.1,
      width: this.gameWidth - this.pieceH * this.outsidePiecesScale,
      height: this.gameHeight - this.pieceH * this.outsidePiecesScale,
    };
    new PiecesKeeper(
      this,
      this.pieceW * 0.4,
      this.pieceH * 0.4,
      container1,
      container2,
      puzzle.convertTo1D(piecesArr)
    );

    // set pieces positions outside the puzzle board

    this.input.on("dragstart", (pointer: any, gameObject: any) =>
      this.dragHandlerStart(pointer, gameObject, piecesArr)
    );
    this.input.on(
      "drag",
      (pointer: any, gameObject: any, dragX: number, dragY: number) =>
        this.dragHandler(gameObject, dragX, dragY, piecesArr)
    );
    this.input.on("dragend", (pointer: any, gameObject: any) =>
      this.dragEndHandler(pointer, gameObject, piecesArr)
    );
    this.input.on(
      "pointerdown",
      function (pointer) {
        console.log(pointer.x, pointer.y);
      },
      this
    );
    /**
     * SOUND
     *
     */
    this.select_sound = this.sound.add("select");
    this.drop_sound = this.sound.add("drop_piece");
    this.right_sound = this.sound.add("right_place");
    this.complete_sound = this.sound.add("complete_puzzle");
    // // text
    let updatedText = "";
    if (this.timeToComplete) {
      // this.displayText = "Tempo para acabar o jogo\n";
      CONST.TIME = this.timeToComplete;
      updatedText = `${CONST.TIME}`;
      // timer
      this.timedEvent = this.time.delayedCall(
        this.timeToComplete * 1000,
        this.onEventTimeOver,
        [],
        this
      );

      this.clock = new Clock(this, this.gameWidth, this.gameHeight * 0.1);
      this.clock.updateTime(updatedText);
    }
  }

  update(): void {
    if (this.timeToComplete && !CONST.GAME_OVER) {
      this.clock.updateTime(
        `${(this.timeToComplete - this.timedEvent.elapsed / 1000).toFixed(0)}`
      );
    }
  }

  private dragHandlerStart(pointer: any, gameObject: any, arr: Piece[][]) {
    // gameObject.setDepth(++this.depthCounter);
    // this.select_sound.play();

    const indexL = gameObject.getData("piece").l;
    const indexC = gameObject.getData("piece").c;
    const pieceObj = arr[indexL][indexC];
    pieceObj.resizeBindedPiece(this.pieceW, this.pieceH, this.pieceRadius, 1);
    // pieceObj.setBindedPiecePosition(300, 300);
    pieceObj.setBindedPiecePosition(pointer.x, pointer.y);
    pieceObj.setPieceDepth(++this.depthCounter);
  }

  private dragHandler(gameObject: any, dragX: any, dragY: any, arr: Piece[][]) {
    const indexL = gameObject.getData("piece").l;
    const indexC = gameObject.getData("piece").c;
    const pieceObj = arr[indexL][indexC];

    pieceObj.setBindedPiecePosition(dragX, dragY);
  }

  private dragEndHandler(pointer: any, gameObject: any, arr: Piece[][]) {
    const indexL = gameObject.getData("piece").l;
    const indexC = gameObject.getData("piece").c;
    const pieceObj = arr[indexL][indexC];

    const rightPosObj = this.piecesRightCoors[
      this.numHorizontalPieces * indexL + indexC
    ];

    const pieceObjCoor: PieceCoor = {
      x: pieceObj.getImageObj().getBounds().centerX,
      y: pieceObj.getImageObj().getBounds().centerY,
    };
    // check if its right position
    if (this.verifyPieceLock(rightPosObj, pieceObjCoor)) {
      pieceObj.setBindedPiecePosition(rightPosObj.x, rightPosObj.y);
      pieceObj.setPieceDepth(1);
      // disable piece draggablility
      this.input.setDraggable(gameObject, false);
      gameObject.input.draggable = false;
      gameObject.setDepth(1);
      // count piece
      CONST.CURRENT_PIECES++;
      // PIECES_TEXT.setText(CONST.CURRENT_PIECES + "/" + CONST.TOTAL_PIECES);

      // VERIFY END OF PUZZLE
      if (CONST.CURRENT_PIECES == CONST.TOTAL_PIECES) {
        this.complete_sound.play();
        CONST.GAME_OVER = true;
        this.scene.launch("GameEndScene", {
          width: this.gameWidth,
          height: this.gameHeight,
          win: true,
        });
        if (this.timeToComplete) {
          this.clock.cancelAnims();
        }
      } else {
        this.right_sound.play();
      }
    } else {
      pieceObj.resizeBindedPiece(
        this.pieceW * this.outsidePiecesScale,
        this.pieceH * this.outsidePiecesScale,
        this.pieceRadius * this.outsidePiecesScale,
        this.outsidePiecesScale
      );
      // pieceObj.setBindedPiecePosition(pointer.x, pointer.y);
      // piece goes to default position
      pieceObj.setBindedPiecePosition(
        pieceObj.getPieceInitCoors().x,
        pieceObj.getPieceInitCoors().y
      );
      this.drop_sound.play();
    }
  }

  private verifyPieceLock(
    imageCenterCoors: PieceCoor,
    pieceCenterCoors: PieceCoor
  ): boolean {
    if (
      pieceCenterCoors.x > imageCenterCoors.x - this.pieceLockTolerance &&
      pieceCenterCoors.x < imageCenterCoors.x + this.pieceLockTolerance &&
      pieceCenterCoors.y > imageCenterCoors.y - this.pieceLockTolerance &&
      pieceCenterCoors.y < imageCenterCoors.y + this.pieceLockTolerance
    ) {
      return true;
    }
    return false;
  }

  private onEventTimeOver(): void {
    console.log("time over");
    CONST.GAME_OVER = true;
    this.clock.cancelAnims();

    this.scene.launch("GameEndScene", {
      width: this.gameWidth,
      height: this.gameHeight,
      win: false,
    });
  }
}
