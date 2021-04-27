import { Card } from "./card";
import { ObjectSize, NumPieces } from "../interfaces/utils.interface";
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
  private gapSide: number = 50;

  private image: Phaser.GameObjects.Image;
  private imageAux: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    boardW: number,
    boardH: number,
    offsetY: number,
    imageRef: string
  ) {
    this.scene = scene;
    this.boardW = boardW;
    this.boardH = boardH;
    this.centerGridOffsetY = offsetY;

    this.puzzleW = this.boardW * this.puzzlePercW - this.gapSide * 2;
    this.puzzleH = this.boardH - this.gapSide * 2;

    this.image = this.addImage(imageRef, this.imageAlpha, true);
    this.imageAux = this.addImage(imageRef, 1, false);
  }

  public addImage(
    imageRef: string,
    alpha: number,
    visble
  ): Phaser.GameObjects.Image {
    var imageObj = this.scene.add
      .image(0, 0, imageRef)
      .setInteractive()
      .setAlpha(alpha)
      .setVisible(visble);
    imageObj = scaleImageToFitFrame(this.puzzleW, this.puzzleH, imageObj);

    imageObj.setPosition(
      this.puzzleW / 2 + this.gapSide,
      this.centerGridOffsetY + this.puzzleH / 2 + this.gapSide
    );

    return imageObj;
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
}
