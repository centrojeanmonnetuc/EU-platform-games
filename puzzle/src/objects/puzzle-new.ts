import { CONST } from "../const/const";
import { Piece } from "./piece-new";
import {
  PieceInfo,
  PieceBoardPos,
  PiecesBoard,
  PieceCoor,
} from "../interfaces/utils.interface";
import { dualSocketPieceVerifier, getRndInteger } from "../utils/puzzle";

export class Puzzle {
  private scene: Phaser.Scene;

  private numHorizontalPieces: number;
  private numVerticalPieces: number;

  private pieceW: number;
  private pieceH: number;
  private pieceRadius: number;
  private pieceScaleValue: number;

  private piecesInfoArr: PieceInfo[][];
  private piecesBoardDimensions: PiecesBoard;

  private piecesRightLockCoors: PieceCoor[] = [];

  constructor(
    scene: Phaser.Scene,
    numHorizontalPieces: number,
    numVerticalPieces: number,
    pieceW: number,
    pieceH: number,
    pieceRadius: number,
    pieceScaleValue: number,
    piecesBoardDimensions: PiecesBoard
  ) {
    this.scene = scene;
    this.numHorizontalPieces = numHorizontalPieces;
    this.numVerticalPieces = numVerticalPieces;
    this.pieceW = pieceW;
    this.pieceH = pieceH;
    this.pieceRadius = pieceRadius;
    this.pieceScaleValue = pieceScaleValue;
    this.piecesBoardDimensions = piecesBoardDimensions;
  }

  // dispose the pieces within the board
  public generatePiecesInPuzzleBoard(
    image: Phaser.GameObjects.Image,
    piecePositionHelper: boolean,
    backgroundPuzzleImage: boolean
  ): PieceCoor[] {
    /**
     * TYPE
     *  (top, left, bottom, right)
     *  -> 1, 1, 1, 1 : only pieces with out socket
     *  -> -1, -1, -1, -1 : only pieces with in socket
     *  -> 0, 1, -1, 0 : socket out right, socket in bottom and non socket top and left
     *  -> 1, -1, 1, -1 : top and bottom out socket, left and right in socket
     *  -> etc...
     */
    var ARR_G_PIECES_LINE: PieceInfo[] = [];
    var ARR_G_PIECES: PieceInfo[][] = [];
    var piece_type_obj: PieceInfo;

    var puzzle_offset = image.getTopLeft();
    var type_top: number,
      type_right: number,
      type_bottom: number,
      type_left: number;

    // g.lineStyle(1, 0x000000, 1);

    for (let j = 0; j < this.numVerticalPieces; j++) {
      for (let i = 0; i < this.numHorizontalPieces; i++) {
        // first line
        if (j == 0) {
          type_top = 0;
          // first piece
          if (i == 0) {
            type_right = -1;
            type_bottom = 1;
            type_left = 0;
          }
          // anterior socket type
          else if (ARR_G_PIECES_LINE[i - 1].r == -1) {
            type_right = 1;
            type_bottom = -1;
            type_left = 1;
          } else {
            type_right = -1;
            type_bottom = 1;
            type_left = -1;
          }
        }
        // lines in the middle
        else {
          //console.log('it: %d, i: %d, bottom: %d', j, i, ARR_G_PIECES[j - 1][i].b)
          if (ARR_G_PIECES[j - 1][i].b == 1) {
            type_top = -1;
            type_bottom = -1;
            type_right = 1;
            type_left = 1;
          } else {
            type_top = 1;
            type_bottom = 1;
            type_right = -1;
            type_left = -1;
          }
        }
        // left
        if (i == 0) {
          type_left = 0;
        }
        // right
        else if (i == this.numHorizontalPieces - 1) {
          type_right = 0;
        }
        // last line
        if (j == this.numVerticalPieces - 1) {
          type_bottom = 0;
        }

        // socket info
        let offsetX = 0,
          offsetY = 0;
        if (type_left === 1) {
          offsetX += this.pieceRadius / 2;
        }
        if (type_right === 1) {
          offsetX -= this.pieceRadius / 2;
        }
        if (type_top === 1) {
          offsetY += this.pieceRadius / 2;
        }
        if (type_bottom === 1) {
          offsetY -= this.pieceRadius / 2;
        }
        // get the piece right lock coordinates
        // fit in pieces - offset radius
        const lockX =
          image.getTopLeft().x + i * this.pieceW + this.pieceW / 2 - offsetX;
        const lockY =
          image.getTopLeft().y + j * this.pieceH + this.pieceH / 2 - offsetY;
        const rightCoorObj = { x: lockX, y: lockY };
        this.piecesRightLockCoors.push(rightCoorObj);

        if (piecePositionHelper) {
          const pieceType = `piece_${type_top}_${type_right}_${type_bottom}_${type_left}`;
          const piece = this.scene.add.image(lockX, lockY, pieceType);
          piece.setAlpha(0.3);
        }

        piece_type_obj = {
          t: type_top,
          r: type_right,
          b: type_bottom,
          l: type_left,
          pos_x: puzzle_offset.x + i * this.pieceW,
          pos_y: puzzle_offset.y + j * this.pieceH,
        };
        ARR_G_PIECES_LINE.push(piece_type_obj);
      }
      ARR_G_PIECES.push(ARR_G_PIECES_LINE);
      ARR_G_PIECES_LINE = [];
    }
    this.piecesInfoArr = ARR_G_PIECES;
    return this.piecesRightLockCoors;
  }

  public generateOutsidePieces(puzzleImage: Phaser.GameObjects.Image): Piece[] {
    var width_piece_rt: number,
      height_piece_rt: number,
      piece_draw_x: number,
      piece_draw_y: number;
    var info_piece: PieceInfo;
    var arrRefPieces: Piece[] = [];

    for (let j = 0; j < this.numVerticalPieces; j++) {
      for (let i = 0; i < this.numHorizontalPieces; i++) {
        info_piece = this.piecesInfoArr[j][i];

        // height
        height_piece_rt = this.pieceH;
        piece_draw_y = j * this.pieceH;
        if (info_piece.t == 1) {
          height_piece_rt += this.pieceRadius;
          piece_draw_y -= this.pieceRadius;
        }
        if (info_piece.b == 1) {
          height_piece_rt += this.pieceRadius;
        }
        // width
        width_piece_rt = this.pieceW;
        piece_draw_x = i * this.pieceW;
        if (info_piece.r == 1) {
          width_piece_rt += this.pieceRadius;
        }
        if (info_piece.l == 1) {
          width_piece_rt += this.pieceRadius;
          piece_draw_x -= this.pieceRadius;
        }

        this.scene.make
          .renderTexture(
            { width: width_piece_rt, height: height_piece_rt },
            false
          )
          .draw(puzzleImage, -piece_draw_x, -piece_draw_y)
          .saveTexture("piece[" + j + "," + i + "]");
        const pieceImage = this.scene.add
          .image(
            width_piece_rt / 2,
            height_piece_rt / 2,
            "piece[" + j + "," + i + "]"
          )
          .setOrigin(0.5);

        const pieceType = `piece_${info_piece.t}_${info_piece.r}_${info_piece.b}_${info_piece.l}`;
        const piece = this.scene.add.image(
          width_piece_rt / 2,
          height_piece_rt / 2,
          pieceType
        );

        const pieceObj = new Piece(
          this.scene,
          piece,
          pieceImage,
          this.pieceScaleValue,
          { lineIndex: j, columnIndex: i }
        );
        pieceObj.scaleDownPiece(true);
        arrRefPieces.push(pieceObj);
      }
    }
    return arrRefPieces;
  }
}
