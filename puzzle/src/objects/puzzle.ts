import { CONST } from "../const/const";
import { Piece } from "./piece";
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

    var g_offsetX = 0;
    var g_offsetY = 0;
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

        const graphic_piece = new Piece(
          this.scene,
          this.pieceW,
          this.pieceH,
          this.pieceRadius,
          g_offsetX,
          g_offsetY,
          type_top,
          type_right,
          type_bottom,
          type_left,
          1,
          0x4b86b4,
          { x: 0, y: 0 }
        );

        // socket info
        let offsetX = 0,
          offsetY = 0;
        if (type_left === 1) {
          offsetX -= this.pieceRadius / 2;
        }
        if (type_right === 1) {
          offsetX += this.pieceRadius / 2;
        }
        if (type_top === 1) {
          offsetY -= this.pieceRadius / 2;
        }
        if (type_bottom === 1) {
          offsetY += this.pieceRadius / 2;
        }
        // get the piece right lock coordinates
        const lockX =
          image.getTopLeft().x + i * this.pieceW + this.pieceW / 2 + offsetX;
        const lockY =
          image.getTopLeft().y + j * this.pieceH + this.pieceH / 2 + offsetY;
        const rightCoorObj = { x: lockX, y: lockY };
        this.piecesRightLockCoors.push(rightCoorObj);

        if (piecePositionHelper) {
          graphic_piece.drawPiece(lockX, lockY, -1, backgroundPuzzleImage);
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

  public generateOutsidePieces(
    puzzleImage: Phaser.GameObjects.Image
  ): Piece[][] {
    var g_offsetX = 0;
    var g_offsetY = 0;

    var width_piece_rt: number,
      height_piece_rt: number,
      piece_draw_x: number,
      piece_draw_y: number;
    var info_piece: PieceInfo;
    var ARR_MOVE_PIECES_LINE: Piece[] = [];
    var ARR_MOVE_PIECES: Piece[][] = [];

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
        var pieceImage = this.scene.add
          .image(this.pieceW / 2, this.pieceH / 2, "piece[" + j + "," + i + "]")
          .setOrigin(0.5);

        // // 1: egde case -> find dual piece socket
        // // 1 for horizontal dual socket
        // // 2 for vertical dual socker
        // if (dualSocketPieceVerifier(info_piece) == 1) {
        //   piece_draw_x += this.pieceRadius;
        // }
        // if (dualSocketPieceVerifier(info_piece) == 2) {
        //   piece_draw_y += this.pieceRadius;
        // }
        // // 2: edge case -> in the last column there are pieces that are "dual socket" but finish the right side at 0
        // if (info_piece.l == 1 && info_piece.r == 0) {
        //   piece_draw_x += this.pieceRadius;
        // }
        // // 3: edge case -> in the last line there are pieces that are "dual socket" but finish the bottom at 0
        // if (info_piece.t == 1 && info_piece.b == 0) {
        //   piece_draw_y += this.pieceRadius;
        // }

        // // get the piece right lock coordinates
        // const lockX = i * this.pieceW + this.pieceW / 2;
        // const lockY = j * this.pieceH + this.pieceH / 2;

        const pieceRightLockCoor = this.piecesRightLockCoors[
          this.numHorizontalPieces * j + i
        ];

        const piece = new Piece(
          this.scene,
          this.pieceW,
          this.pieceH,
          this.pieceRadius,
          g_offsetX,
          g_offsetY,
          info_piece.t,
          info_piece.r,
          info_piece.b,
          info_piece.l,
          0.5,
          0x696969,
          { x: pieceRightLockCoor.x, y: pieceRightLockCoor.y }
        );
        piece.drawPiece(this.pieceW / 2, this.pieceH / 2, -1);
        // console.log(piece.getPieceGraphObj());
        // piece.drawPiece(
        //   puzzleImage.getTopLeft().x + piece_draw_x,
        //   puzzleImage.getTopLeft().y + piece_draw_y,
        //   -1
        // );

        piece.bindImageWithPiece(pieceImage, j, i);
        const pieceObj = piece.bindImageWithPiece(pieceImage, j, i);
        ARR_MOVE_PIECES_LINE.push(pieceObj);

        // // set the piece position
        // var random_piece_pos = {
        //   x: getRndInteger(0, 400),
        //   y: getRndInteger(0, 600),
        // };

        piece.resizeBindedPiece(
          this.pieceScaleValue * this.pieceW,
          this.pieceScaleValue * this.pieceH,
          this.pieceScaleValue * this.pieceRadius,
          this.pieceScaleValue
        );
        // piece.setBindedPiecePosition(random_piece_pos.x, random_piece_pos.y);
        // // piece.setPiecePosition(400, 300);
        // // piece.setImagePosition(400, 300);
        piece.setBindedPiecePosition(400, 300);
      }
      ARR_MOVE_PIECES.push(ARR_MOVE_PIECES_LINE);
      ARR_MOVE_PIECES_LINE = [];
    }

    return ARR_MOVE_PIECES;
  }

  public convertTo1D(pieces: Piece[][]): Piece[] {
    const newArr: Piece[] = [];
    for (let j = 0; j < this.numVerticalPieces; j++) {
      for (let i = 0; i < this.numHorizontalPieces; i++) {
        newArr.push(pieces[j][i]);
      }
    }
    return newArr;
  }

  public getPiecesRightLockCoors(): PieceCoor[] {
    return this.piecesRightLockCoors;
  }
}
