import { CONST } from "../const/const";
import { scaleImageToFitFrame } from "../utils/resizeImage";
import { DisplayText } from "../objects/text";

export class QuestionNumber {
  private scene: Phaser.Scene;

  private container: Phaser.GameObjects.Container;
  private totalQuestions: number;
  private text: DisplayText;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    totalQuestions: number
  ) {
    this.scene = scene;
    this.totalQuestions = totalQuestions;
    this.displayQuestionNumber(posX, posY, totalQuestions);
  }

  private displayQuestionNumber(
    posX: number,
    posY: number,
    totalQuestions: number
  ): void {
    this.container = this.scene.add.container(0, 0);
    const iconScale = 0.2;
    let icon = this.scene.add.image(posX, posY, "question");

    icon = scaleImageToFitFrame(64, 64, icon);

    const textStr = `${CONST.CURRENT_QUESTION + 1}/${totalQuestions}`;
    this.text = new DisplayText(
      this.scene,
      posX + icon.width * iconScale,
      posY,
      textStr,
      100,
      64,
      "#000000"
    );

    const width = icon.getData("scaled_w") + this.text.getText().width;
    this.container.add(icon);
    this.container.add(this.text.getText());
    this.container.setX(-width * 1.2);
  }

  public setCurrentQuestion(num: number): void {
    const textStr = `${num + 1}/${this.totalQuestions}`;
    this.text.changeDisplayedText(textStr);
  }
}
