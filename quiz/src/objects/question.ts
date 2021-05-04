import { scaleImageToFitFrame } from "../utils/resizeImage";
import { DisplayText } from "../objects/text";

export class Question {
  private scene: Phaser.Scene;
  private bgColor: number = 0xffffff;

  private container: Phaser.GameObjects.Container;
  private posX: number;
  private posY: number;
  private questions_w: number;
  private questions_h: number;

  private questionText: DisplayText;

  // right or wrong image
  private image: Phaser.GameObjects.Image;
  // animations
  private tween: Phaser.Tweens.Tween;

  // event
  private emitter: Phaser.Events.EventEmitter;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    width: number,
    height: number,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene;
    this.posX = posX;
    this.posY = posY;
    this.questions_w = width;
    this.questions_h = height;
    this.emitter = emitter;

    this.answerInfo(false);
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
      38,
      0x696969
    );
    this.container.add(graphics);
    this.container.add(this.questionText.getText());

    this.container.setPosition(this.posX - this.questions_w / 2, this.posY);

    // event listener
    // answerInfoInQuestionContainer
    this.emitter.on("answerInfoInQuestionContainer", this.answerInfo, this);
  }

  public center(gameWidth: number): void {}

  public getCenterX(gameWidth: number): number {
    return gameWidth / 2 - this.questions_w / 2;
  }

  public getQuestContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public setQuestionText(text: string): void {
    this.questionText.changeDisplayedText(text);
  }

  public answerInfo(userRight: boolean): void {
    const scaleValue = 0.5;
    const containerLeft = this.posX - this.questions_w / 2;
    if (userRight) {
      this.image = this.scene.add.image(containerLeft, this.posY, "correct");
    } else {
      this.image = this.scene.add.image(containerLeft, this.posY, "wrong");
    }
    this.image.setScale(scaleValue);
    this.tween = this.scene.tweens.add({
      targets: this.image,
      scale: scaleValue * 1.5,
      duration: 800,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
      hold: 800,
    });
  }

  public clearAnswerInfo(): void {
    this.image.destroy();
    this.tween.stop();
  }
}
