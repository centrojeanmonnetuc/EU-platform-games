import { CONST } from "../const/const";
import { TopBar } from "../objects/top-bar";
import { PuzzleGrid } from "../objects/puzzle-grid";
import { Puzzle } from "../objects/puzzle";
import { checkLockPosition } from "../utils/puzzle";

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

  private depthCounter: number = 0;
  private pieceLockTolerance: number = 15;

  /**
   * Sounds
   */
  private select_sound: Phaser.Sound.BaseSound;
  private drop_sound: Phaser.Sound.BaseSound;
  private right_sound: Phaser.Sound.BaseSound;
  private complete_sound: Phaser.Sound.BaseSound;

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
    CONST.TOTAL_PIECES = horizontal * vertical;

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
    const piecesObjArr = puzzle.generateOutsidePieces(puzzleGrid.getImageAux());
    console.log(piecesObjArr);

    this.input.on("dragstart", (pointer, gameObject) =>
      this.dragHandlerStart(gameObject)
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) =>
      this.dragHandler(gameObject, dragX, dragY, piecesObjArr)
    );
    this.input.on("dragend", (pointer, gameObject) =>
      this.dragEndHandler(gameObject, piecesObjArr)
    );

    // this.input.on(
    //   "pointerdown",
    //   function (pointer) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );

    /**
     * SOUND
     *
     */
    this.select_sound = this.sound.add("select");
    this.drop_sound = this.sound.add("drop_piece");
    this.right_sound = this.sound.add("right_place");
    this.complete_sound = this.sound.add("complete_puzzle");
  }

  dragHandlerStart(gameObject) {
    gameObject.setDepth(++this.depthCounter);
    this.select_sound.play();
  }

  dragHandler(gameObject, dragX, dragY, piecesObjArr) {
    const line_index = gameObject.getData("line_ref");
    const col_index = gameObject.getData("column_ref");
    const x_offset = gameObject.getData("x_offset");
    const y_offset = gameObject.getData("y_offset");
    const lock_pos = gameObject.getData("lock_pos");

    var temp_pieceObj = piecesObjArr[line_index][col_index].pieceObj;

    // check POSITION
    if (
      checkLockPosition(
        lock_pos,
        dragX + x_offset,
        dragY + y_offset,
        this.pieceLockTolerance
      )
    ) {
      // put piece in right place
      const final_x = lock_pos.x - x_offset;
      const final_y = lock_pos.y - y_offset;
      gameObject.setPosition(final_x, final_y);
      temp_pieceObj.setPosition(final_x + x_offset, final_y + y_offset);
    } else {
      gameObject.setPosition(dragX, dragY);
      temp_pieceObj.setPosition(dragX + x_offset, dragY + y_offset);
    }
  }

  dragEndHandler(gameObject, piecesObjArr) {
    // check if its right position
    const lock_pos = gameObject.getData("lock_pos");
    const line_index = gameObject.getData("line_ref");
    const col_index = gameObject.getData("column_ref");
    var temp_pieceObj = piecesObjArr[line_index][col_index].pieceObj;

    if (temp_pieceObj.x == lock_pos.x && temp_pieceObj.y == lock_pos.y) {
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
      } else {
        this.right_sound.play();
      }
    } else {
      this.drop_sound.play();
    }
  }
}
