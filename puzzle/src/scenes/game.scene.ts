import { CONST } from "../const/const";
import { TopBar } from "../objects/top-bar";
import { PuzzleGrid } from "../objects/puzzle-grid";
import { Puzzle } from "../objects/puzzle";
import { checkLockPosition } from "../utils/puzzle";
import { PiecesKeeper } from "../objects/pieces-keeper";
import { PiecesBoard } from "../interfaces/utils.interface";
import { Piece } from "../objects/piece";

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
  private pieceLockTolerance: number = 30;

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

    // what's the scale for this piece to fit in the side containers?
    this.outsidePiecesScale = (this.gameWidth * 0.1) / this.pieceW;

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
    puzzle.generatePiecesInPuzzleBoard(puzzleGrid.getImage());
    const piecesArr = puzzle.generateOutsidePieces(puzzleGrid.getImageAux());

    const container1: PiecesBoard = {
      x: 0,
      y: 0,
      width: puzzleGrid.getImage().getBottomLeft().x,
      height: this.gameHeight,
    };
    const container2: PiecesBoard = {
      x: puzzleGrid.getImage().getTopRight().x,
      y: 0,
      width: this.gameWidth,
      height: this.gameHeight,
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
      this.dragHandlerStart(gameObject, piecesArr)
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) =>
      this.dragHandler(gameObject, dragX, dragY, piecesArr)
    );
    this.input.on("dragend", (pointer, gameObject, dragX, dragY) =>
      this.dragEndHandler(gameObject, dragX, dragY, piecesArr)
    );
    // this.input.on(
    //   "pointerdown",
    //   function (pointer) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );
    // /**
    //  * SOUND
    //  *
    //  */
    // this.select_sound = this.sound.add("select");
    // this.drop_sound = this.sound.add("drop_piece");
    // this.right_sound = this.sound.add("right_place");
    // this.complete_sound = this.sound.add("complete_puzzle");
    // // text
    // let updatedText = "";
    // if (this.timeToComplete) {
    //   this.displayText = "Tempo para acabar o jogo\n";
    //   CONST.TIME = this.timeToComplete;
    //   updatedText = `${this.displayText}${CONST.TIME}`;
    //   // timer
    //   this.timedEvent = this.time.delayedCall(
    //     this.timeToComplete * 1000,
    //     this.onEventTimeOver,
    //     [],
    //     this
    //   );
    // }
    // console.log(this.timeToComplete);
    // // TEXT
    // this.text = this.add.text(0, 16, updatedText, {
    //   fontFamily: "Arial",
    //   fontSize: 32,
    //   color: "#ffffff",
    //   align: "center",
    // });
    // this.text.setPosition(
    //   this.gameWidth / 2 - this.text.width / 2,
    //   this.topBar.getHeight() / 2 - this.text.height / 2
    // );
  }

  update(): void {
    if (this.timeToComplete && !CONST.GAME_OVER) {
      this.text.setText(
        `${this.displayText}${(
          this.timeToComplete -
          this.timedEvent.elapsed / 1000
        ).toFixed(0)}`
      );
    }
  }

  private dragHandlerStart(gameObject: any, arr: Piece[][]) {
    // gameObject.setDepth(++this.depthCounter);
    // this.select_sound.play();
    const indexL = gameObject.getData("image").l;
    const indexC = gameObject.getData("image").c;
    const pieceObj = arr[indexL][indexC];
    pieceObj.resizeBindedPiece(this.pieceW, this.pieceH, this.pieceRadius, 1);
    // console.log(arr.find((elem) => console.log(elem)));
  }

  private dragHandler(gameObject: any, dragX: any, dragY: any, arr: Piece[][]) {
    const indexL = gameObject.getData("image").l;
    const indexC = gameObject.getData("image").c;
    const pieceObj = arr[indexL][indexC];

    pieceObj.setBindedPiecePosition(dragX, dragY);

    // // check POSITION
    // if (
    //   checkLockPosition(
    //     lock_pos,
    //     dragX + x_offset,
    //     dragY + y_offset,
    //     this.pieceLockTolerance
    //   )
    // ) {
    //   // put piece in right place
    //   const final_x = lock_pos.x - x_offset;
    //   const final_y = lock_pos.y - y_offset;
    //   gameObject.setPosition(final_x, final_y);
    //   temp_pieceObj.setPosition(final_x + x_offset, final_y + y_offset);
    // } else {
    //   gameObject.setPosition(dragX, dragY);
    //   temp_pieceObj.setPosition(dragX + x_offset, dragY + y_offset);
    // }
  }

  private dragEndHandler(
    gameObject: any,
    dragX: any,
    dragY: any,
    arr: Piece[][]
  ) {
    console.log(dragX);
    console.log(dragY);
    // check if its right position
    const indexL = gameObject.getData("image").l;
    const indexC = gameObject.getData("image").c;
    const pieceObj = arr[indexL][indexC];
    pieceObj.resizeBindedPiece(
      this.pieceW * this.outsidePiecesScale,
      this.pieceH * this.outsidePiecesScale,
      this.pieceRadius * this.outsidePiecesScale,
      this.outsidePiecesScale
    );
    pieceObj.setBindedPiecePosition(300, 300);

    // if (temp_pieceObj.x == lock_pos.x && temp_pieceObj.y == lock_pos.y) {
    //   // disable piece draggablility
    //   this.input.setDraggable(gameObject, false);
    //   gameObject.input.draggable = false;
    //   gameObject.setDepth(1);
    //   // count piece
    //   CONST.CURRENT_PIECES++;
    //   // PIECES_TEXT.setText(CONST.CURRENT_PIECES + "/" + CONST.TOTAL_PIECES);

    //   // VERIFY END OF PUZZLE
    //   if (CONST.CURRENT_PIECES == CONST.TOTAL_PIECES) {
    //     this.complete_sound.play();
    //     CONST.GAME_OVER = true;
    //     this.scene.launch("GameEndScene", {
    //       width: this.gameWidth,
    //       height: this.gameHeight,
    //       win: true,
    //     });
    //   } else {
    //     this.right_sound.play();
    //   }
    // } else {
    //   this.drop_sound.play();
    // }
  }

  private onEventTimeOver(): void {
    console.log("time over");
    CONST.GAME_OVER = true;

    this.scene.launch("GameEndScene", {
      width: this.gameWidth,
      height: this.gameHeight,
      win: false,
    });
  }
}
