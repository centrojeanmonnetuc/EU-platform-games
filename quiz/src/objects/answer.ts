import { scaleImageToFitFrame } from "../utils/resizeImage";
import { DisplayText } from "../objects/text";

export class Answer {
  private scene: Phaser.Scene;

  private container: Phaser.GameObjects.Container;
  private bgColor: number = 0xffffff;
  private answerW: number;
  private answerH: number;

  private posX: number;

  private answerText: DisplayText;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.scene = scene;
    this.posX = posX;

    this.answerW = width;
    this.answerH = height;

    this.createContainer(posX, posY, width, height);
  }

  private createContainer(
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.container = this.scene.add.container(0, 0);

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.bgColor, 1);
    graphics.fillRoundedRect(
      posX - width / 2,
      posY - height / 2,
      width,
      height,
      10
    );

    this.answerText = new DisplayText(
      this.scene,
      posX,
      posY,
      "default",
      width - width * 0.1,
      28
    );

    this.container.add(graphics);
    this.container.add(this.answerText.getText());
  }

  public getAnswerContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public getAnswerContainerBottom(): number {
    return this.posX + this.answerH / 2;
  }

  public setAnswerText(text: string): void {
    this.answerText.changeDisplayedText(text);
  }
}
