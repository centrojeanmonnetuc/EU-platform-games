import { CONST } from "../const/const";
import { Piece } from "./piece";

export class Puzzle {
  private scene: Phaser.Scene;

  private numHorizontalPieces: number;
  private numVerticalPieces: number;

  private pieceW: number;
  private pieceH: number;
  private pieceRadius: number;

  constructor(
    scene: Phaser.Scene,
    numHorizontalPieces: number,
    numVerticalPieces: number,
    pieceW: number,
    pieceH: number,
    pieceRadius: number
  ) {
    this.scene = scene;
    this.numHorizontalPieces = numHorizontalPieces;
    this.numVerticalPieces = numVerticalPieces;
    this.pieceW = pieceW;
    this.pieceH = pieceH;
    this.pieceRadius = pieceRadius;
  }

  // dispose the pieces within the board
  public generatePiecesInPuzzleBoard(image: Phaser.GameObjects.Image): void {
    /**
     * TYPE
     *  (top, left, bottom, right)
     *  -> 1, 1, 1, 1 : only pieces with out socket
     *  -> -1, -1, -1, -1 : only pieces with in socket
     *  -> 0, 1, -1, 0 : socket out right, socket in bottom and non socket top and left
     *  -> 1, -1, 1, -1 : top and bottom out socket, left and right in socket
     *  -> etc...
     */
    var ARR_G_PIECES_LINE = [],
      ARR_G_PIECES = [];
    var graphic_piece;
    var g_offsetX = 0;
    var g_offsetY = 0;
    var puzzle_offset = image.getTopLeft();
    var type_top, type_right, type_bottom, type_left;
    var piece_type_obj;

    var g = this.scene.add.graphics();
    g.lineStyle(1, 0x000000, 1);

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
          g
        );

        graphic_piece.drawPiece(
          puzzle_offset.x + i * this.pieceW,
          puzzle_offset.y + j * this.pieceH,
          -1
        );

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
    console.log(ARR_G_PIECES);
  }
}
