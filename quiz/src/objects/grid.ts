import { ObjectSize } from "../interfaces/utils.interface";

export class Grid {
  private scene: Phaser.Scene;
  private boardW: number;
  private boardH: number;
  private numCardsW: number;
  private numCardsH: number;

  private gapInBetween: number = 50;
  private gapSide: number = 100;

  private centerGridOffsetY: number;

  constructor(
    scene: Phaser.Scene,
    boardW: number,
    boardH: number,
    offsetY: number
  ) {
    this.scene = scene;
    this.boardW = boardW - this.gapSide * 2;
    this.centerGridOffsetY = offsetY;
    this.boardH = boardH - this.centerGridOffsetY - this.gapSide * 2;
  }

  public doGridCalculations(numCardsW: number, numCardsH: number): ObjectSize {
    // save the number of cards in the class
    this.numCardsW = numCardsW;
    this.numCardsH = numCardsH;

    const cardWidth = this.boardW / numCardsW - this.gapInBetween;
    const cardHeight = this.boardH / numCardsH - this.gapInBetween;

    return {
      width: cardWidth,
      height: cardHeight,
    };
  }

  public createGrid(cards: Card[], cardW: number, cardH: number): void {
    let counter = 0;
    for (let i = 0; i < this.numCardsH; i++) {
      for (let j = 0; j < this.numCardsW; j++) {
        cards[counter].placeCard(
          j * (cardW + this.gapInBetween) +
            this.gapSide +
            this.gapInBetween / 2,
          i * (cardH + this.gapInBetween) +
            this.centerGridOffsetY +
            this.gapSide
        );

        counter++;
      }
    }

    console.log(cardH / 2);
    console.log(cards);
  }
}
