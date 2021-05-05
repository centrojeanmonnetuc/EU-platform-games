import {
  PieceBoardPos,
  PieceCoor,
  PieceObj,
} from "../interfaces/utils.interface";

export class Piece {
  private scene: Phaser.Scene;

  // piece info
  private piece: Phaser.GameObjects.Image;
  private image: Phaser.GameObjects.Image;
  private initCoords: PieceCoor;
  private scaledValue: number;
  private boardPos: PieceBoardPos;

  constructor(
    scene: Phaser.Scene,
    piece: Phaser.GameObjects.Image,
    image: Phaser.GameObjects.Image,
    scaledValue: number,
    boardPos: PieceBoardPos
  ) {
    this.scene = scene;
    this.piece = piece;
    this.image = image;
    this.scaledValue = scaledValue;
    this.boardPos = boardPos;

    this.bindPieceWithImage();
  }

  public scaleDownPiece(flag: boolean): void {
    let scale = 1;
    if (flag) {
      scale = this.scaledValue;
    }
    this.image.setScale(scale);
    this.piece.setScale(scale);
  }

  private bindPieceWithImage(): void {
    // data
    this.image.setData("line", this.boardPos.lineIndex);
    this.image.setData("col", this.boardPos.columnIndex);
    // interactive
    this.image.setInteractive({ draggable: true });
    // depth
    this.image.setDepth(2);
    this.piece.setDepth(1);

    this.image.setMask(this.piece.createBitmapMask());
  }

  public setPiecePosition(pieceCoor: PieceCoor): void {
    this.image.setPosition(pieceCoor.x, pieceCoor.y);
    this.piece.setPosition(pieceCoor.x, pieceCoor.y);
  }

  public setInitCoords(pieceCoor: PieceCoor): void {
    this.initCoords = pieceCoor;
  }

  public getPieceImage(): Phaser.GameObjects.Image {
    return this.image;
  }

  public setPieceDepth(value: number): void {
    this.image.setDepth(value);
    this.piece.setDepth(value);
  }

  public getInitCoords(): PieceCoor {
    return this.initCoords;
  }
}
