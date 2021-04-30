import { scaleImageToFitFrame } from "../utils/resizeImage";
import { DisplayText } from "../objects/text";

export class Question {
  private scene: Phaser.Scene;
  private bgColor: number = 0xffffff;

  private container: Phaser.GameObjects.Container;
  private questions_w: number;
  private questions_h: number;

  private questionText: DisplayText;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.questions_w = width;
    this.questions_h = height;

    this.createContainer(width, height);
  }

  private createContainer(width: number, height: number) {
    this.container = this.scene.add.container(0, 0);

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.bgColor, 1);
    graphics.fillRoundedRect(0, 0, width, height, 10);

    this.questionText = new DisplayText(
      this.scene,
      width / 2,
      height / 2,
      "default",
      width - width * 0.1,
      38
    );
    this.container.add(graphics);
    this.container.add(this.questionText.getText());
  }

  public center(gameWidth: number, gameHeight: number): void {
    this.container.setPosition(
      gameWidth / 2 - this.questions_w / 2,
      this.questions_w / 6
    );
  }

  public getQuestContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public setQuestionText(text: string): void {
    this.questionText.changeDisplayedText(text);
  }
}
