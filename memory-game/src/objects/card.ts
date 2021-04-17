import { CONST } from "../const/const";
import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Card {
  private scene: Phaser.Scene;
  private cardImgRef: number;
  private cardX: number;
  private cardY: number;
  private cardW: number;
  private cardH: number;

  private cardBack: Phaser.GameObjects.Image;
  private cardBackTexture: string;
  private cardFrontTexture: string;

  private flipTween: Phaser.Tweens.Tween;
  private flipSpeed: number = 200;
  private flipZoom: number = 1.1;

  // flag to control what texture needs to render
  private cardIsBack: boolean = true;

  private scaleX_Back: number;
  private scaleY_Back: number;

  constructor(
    scene: Phaser.Scene,
    cardW: number,
    cardH: number,
    cardImgRef: number,
    cardFrontTexture: string,
    cardBackTexture: string
  ) {
    this.scene = scene;
    this.cardW = cardW;
    this.cardH = cardH;
    this.cardImgRef = cardImgRef;
    this.cardFrontTexture = cardFrontTexture;
    this.cardBackTexture = cardBackTexture;

    this.buildCard();
  }

  private buildCard(): void {
    this.cardBack = this.scene.add
      .image(0, 0, this.cardBackTexture)
      .setOrigin(0)
      .setVisible(false);

    let cardFront = this.scene.add
      .image(0, 0, this.cardFrontTexture)
      .setOrigin(0)
      .setVisible(false);

    this.scaleX_Back = this.cardW / this.cardBack.width;
    this.scaleY_Back = this.cardH / this.cardBack.height;

    let scaleX_Front = this.cardW / cardFront.width;
    let scaleY_Front = this.cardH / cardFront.height;

    this.cardBack.setScale(this.scaleX_Back, this.scaleY_Back);
    cardFront.setScale(scaleX_Front, scaleY_Front);

    let rt = this.scene.make.renderTexture(
      { width: this.cardW, height: this.cardH },
      false
    );
    rt.draw(this.cardBack, 0, 0).saveTexture("card_back");

    rt = this.scene.make.renderTexture(
      { width: this.cardW, height: this.cardH },
      false
    );
    rt.draw(cardFront, 0, 0).saveTexture("card_front_" + this.cardFrontTexture);
  }

  public placeCard(cardX: number, cardY: number): void {
    // because origin is in the middle, this translates the images to its TOP LEFT
    let imageOffset = {
      x: (this.scaleX_Back * this.cardBack.width) / 2,
      y: (this.scaleX_Back * this.cardBack.height) / 2,
    };
    this.cardBack = this.scene.add
      .image(cardX + imageOffset.x, cardY + imageOffset.y, "card_back")
      .setInteractive();
  }

  public flipCard(): void {
    this.cardBack.disableInteractive();

    this.cardIsBack = !this.cardIsBack;

    // first tween: raise and flip the card
    this.flipTween = this.scene.tweens.add({
      targets: this.cardBack,
      scaleY: this.flipZoom,
      scaleX: 0.1,
      duration: this.flipSpeed,
      ease: "Power1",
      yoyo: true,
      onComplete: () => this.onCompleteHandler(this.cardBack),
      onYoyo: () => this.onCardComeBack(this.cardBack),
    });
  }

  private onCardComeBack(card: Phaser.GameObjects.Image): void {
    if (this.cardIsBack) {
      card.setTexture("card_back");
    } else {
      card.setTexture("card_front_" + this.cardFrontTexture);
    }
  }

  private onCompleteHandler(card: Phaser.GameObjects.Image): void {
    this.cardBack.setInteractive();
  }

  public newCardPosition(posX: number, posY: number): void {
    this.cardX = posX;
    this.cardY = posY;
  }

  public getCard(): Phaser.GameObjects.Image {
    return this.cardBack;
  }

  public getCardImgRef(): number {
    return this.cardImgRef;
  }

  public getCardIsBack(): boolean {
    return this.cardIsBack;
  }
}
