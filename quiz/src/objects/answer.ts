import { scaleImageToFitFrame } from "../utils/resizeImage";
import { DisplayText } from "../objects/text";

export class Answer {
  private scene: Phaser.Scene;

  private container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private posX: number;
  private posY: number;
  private answerW: number;
  private answerH: number;
  private index: number;

  private answerText: DisplayText;

  private bgColor: number = 0xffffff;
  private rightColor: number = 0x1dca3c;
  private wrongColor: number = 0xca421d;
  private yellow: number = 0xffcc00;
  private selectedColor: number = 0xd3d3d3;
  private borderSize: number = 5;

  // event
  private emitter: Phaser.Events.EventEmitter;

  constructor(
    scene: Phaser.Scene,
    index: number,
    posX: number,
    posY: number,
    width: number,
    height: number,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene;
    this.index = index;

    this.posX = posX;
    this.posY = posY;
    this.answerW = width;
    this.answerH = height;

    this.emitter = emitter;

    this.createContainer(posX, posY, width, height);
  }

  private createContainer(
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.container = this.scene.add.container(0, 0);

    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(this.bgColor, 1);
    this.graphics.fillRoundedRect(
      posX - width / 2,
      posY - height / 2,
      width,
      height
    );

    this.answerText = new DisplayText(
      this.scene,
      posX,
      posY,
      "default",
      width - width * 0.1,
      28,
      0x696969
    );

    this.container.add(this.graphics);
    this.container.add(this.answerText.getText());

    this.container.setInteractive(
      new Phaser.Geom.Rectangle(
        posX - width / 2,
        posY - height / 2,
        width,
        height
      ),
      Phaser.Geom.Rectangle.Contains
    );

    this.container.on("pointerdown", () => {
      this.emitter.emit("selectedAnswer", this, true);
    });
  }

  public getAnswerContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public getAnswerContainerBottom(): number {
    return this.posX + this.answerH / 2;
  }

  public setAnswerText(text: string): void {
    this.answerText.changeDisplayedText(text);
    this.paintContainer(this.bgColor);
  }

  public getAnswerIndex(): number {
    return this.index;
  }

  private paintContainer(color: number): void {
    // this.graphics.clear();
    this.graphics.fillStyle(color, 1);
    this.graphics.fillRoundedRect(
      this.posX - this.answerW / 2,
      this.posY - this.answerH / 2,
      this.answerW,
      this.answerH
    );
  }

  public setSelected(userRight: boolean): void {
    this.drawBorder(userRight);
    this.graphics.fillStyle(this.selectedColor, 1);
    this.graphics.fillRoundedRect(
      this.posX - this.answerW / 2,
      this.posY - this.answerH / 2,
      this.answerW,
      this.answerH
    );
  }

  public drawBorder(userRight: boolean): void {
    this.graphics.fillStyle(userRight ? this.rightColor : this.wrongColor, 1);
    this.graphics.fillRoundedRect(
      this.posX - this.answerW / 2 - this.borderSize,
      this.posY - this.answerH / 2 - this.borderSize,
      this.answerW + this.borderSize * 2,
      this.answerH + this.borderSize * 2
    );
  }

  public setDefault(): void {
    this.graphics.fillStyle(this.bgColor, 1);
    this.graphics.fillRoundedRect(
      this.posX - this.answerW / 2,
      this.posY - this.answerH / 2,
      this.answerW,
      this.answerH
    );
  }

  public clearGraphics(): void {
    this.graphics.clear();
    this.setDefault();
  }

  public changeSignificance(flag: boolean): void {
    if (flag) {
      this.container.setAlpha(0.5);
    } else {
      this.container.setAlpha(1);
      this.clearGraphics();
    }
  }
}
