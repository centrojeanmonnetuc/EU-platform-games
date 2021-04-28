import {
  ObjectSize,
  NumPieces,
  PiecesBoard,
} from "../interfaces/utils.interface";
import { scaleImageToFitFrame } from "../utils/resizeImage";

export class PuzzleGrid {
  private scene: Phaser.Scene;
  private boardW: number;
  private boardH: number;
  private centerGridOffsetY: number;

  private puzzlePercW: number = 0.7;
  private piecesPercW: number = 0.3;

  private puzzleW: number;
  private puzzleH: number;
  private imageAlpha: number = 0.2;

  private gapInBetween: number = 50;
  private gapSide: number = 20;

  private image: Phaser.GameObjects.Image;
  private imageAux: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    boardW: number,
    boardH: number,
    puzzleW: number,
    puzzleH: number,
    imageRef: string
  ) {
    this.scene = scene;
    this.boardW = boardW;
    this.boardH = boardH;
    this.puzzleW = boardW * puzzleW - this.gapSide * 2;
    this.puzzleH = boardH * puzzleH - this.gapSide * 2;

    this.image = this.addImage(imageRef, this.imageAlpha, true, 0.5);
    this.setImagePos(this.image, this.boardW / 2, this.boardH / 2);

    this.imageAux = this.addImage(imageRef, 1, false, 0);
    this.setImagePos(
      this.imageAux,
      this.boardW / 2 - this.imageAux.width / 2,
      this.boardH / 2 - this.imageAux.height / 2
    );
  }

  public addImage(
    imageRef: string,
    alpha: number,
    visble: boolean,
    origin: number
  ): Phaser.GameObjects.Image {
    var imageObj = this.scene.add
      .image(0, 0, imageRef)
      .setInteractive()
      .setAlpha(alpha)
      .setVisible(visble)
      .setOrigin(origin);
    imageObj = scaleImageToFitFrame(this.puzzleW, this.puzzleH, imageObj);

    // imageObj.setPosition(this.gapSide, this.centerGridOffsetY + this.gapSide);

    return imageObj;
  }

  public setImagePos(
    image: Phaser.GameObjects.Image,
    posX: number,
    posY: number
  ): void {
    image.setPosition(posX, posY);
  }

  public calculatePuzzlePieces(sizeOfPiece: number): NumPieces {
    return {
      horizontal: Math.floor((this.puzzleW - this.gapSide * 2) / sizeOfPiece),
      vertical: Math.floor((this.puzzleH - this.gapSide * 2) / sizeOfPiece),
    };
  }

  public calculatePieceDimensions(
    maxPiecesH: number,
    maxPiecesV: number
  ): ObjectSize {
    return {
      width: this.image.width / maxPiecesH,
      height: this.image.height / maxPiecesV,
    };
  }

  public getImage(): Phaser.GameObjects.Image {
    return this.image;
  }

  public getImageAux(): Phaser.GameObjects.Image {
    return this.imageAux;
  }

  public getPiecesPercW(): number {
    return this.piecesPercW;
  }

  public getPiecesBoardDimensions(): PiecesBoard {
    return {
      x: this.puzzleW + 2 * this.gapSide,
      y: this.centerGridOffsetY + this.gapSide,
      width: this.boardW - this.gapSide,
      height: this.boardH - this.gapSide,
    };
  }
}
