import { scaleImageToFitFrame } from "../utils/resizeImage";
import { Answer } from "../objects/answer";

export class Answers {
  private scene: Phaser.Scene;

  private numAnswers: number;
  private answersContainers: Answer[] = [];
  private answers: string[];

  constructor(
    scene: Phaser.Scene,
    numAnswers: number,
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.scene = scene;
    this.numAnswers = numAnswers;

    this.createContainer(posX, posY, width, height);
  }

  private createContainer(
    centerX: number,
    initPosY: number,
    width: number,
    height: number
  ) {
    const spaceInBetween = height / 2;

    let posY_counter = initPosY;

    for (let i = 0; i < this.numAnswers; i++) {
      const ans = new Answer(this.scene, centerX, posY_counter, width, height);
      this.answersContainers.push(ans);
      posY_counter += height + spaceInBetween;
    }
  }

  public setAnswers(answersArr: string[]): void {
    for (let i = 0; i < this.numAnswers; i++) {
      this.answersContainers[i].setAnswerText(answersArr[i]);
    }
  }
}
