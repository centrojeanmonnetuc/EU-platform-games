import { Card } from "../objects/card";
import { ObjectSize } from "../interfaces/utils.interface";

export class Grid {
  private scene: Phaser.Scene;
  private boardW: number;
  private boardH: number;
  private numCardsW: number;
  private numCardsH: number;

  private gapInBetween: number = 50;
  private gapSide: number = 150;

  private centerGridOffsetY: number;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, boardW: number, boardH: number) {
    this.scene = scene;
    this.boardW = boardW - this.gapSide * 2;
    this.boardH = boardH - this.gapSide * 2;
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
    this.container = this.scene.add.container();
    let counter = 0;
    for (let i = 0; i < this.numCardsH; i++) {
      for (let j = 0; j < this.numCardsW; j++) {
        const x =
          j * (cardW + this.gapInBetween) +
          this.gapSide +
          this.gapInBetween / 2;
        const y = i * (cardH + this.gapInBetween) + this.gapSide;

        cards[counter].placeCard(x, y);

        this.container.add(cards[counter].getCard());
        counter++;
      }
    }

    console.log(cardH / 2);
    console.log(cards);
  }

  public getGridBounds(): any {
    return this.container.getBounds();
  }

  public setGridPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }
}
