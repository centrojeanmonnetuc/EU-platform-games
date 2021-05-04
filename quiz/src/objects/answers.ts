import { scaleImageToFitFrame } from "../utils/resizeImage";
import { Answer } from "../objects/answer";
import { UserAnswers } from "../interfaces/utils.interface";

export class Answers {
  private scene: Phaser.Scene;

  private numAnswers: number;
  private answersContainers: Answer[] = [];
  private answers: string[];

  // event
  private emitter: Phaser.Events.EventEmitter;

  constructor(
    scene: Phaser.Scene,
    numAnswers: number,
    posX: number,
    posY: number,
    width: number,
    height: number,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene;
    this.numAnswers = numAnswers;
    this.emitter = emitter;

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
      const ans = new Answer(
        this.scene,
        i,
        centerX,
        posY_counter,
        width,
        height,
        this.emitter
      );
      this.answersContainers.push(ans);
      posY_counter += height + spaceInBetween;
    }
  }

  public setAnswers(answersArr: string[]): void {
    for (let i = 0; i < this.numAnswers; i++) {
      this.answersContainers[i].setAnswerText(answersArr[i]);
    }
  }

  public drawBorderOnRightAnswer(index: number): void {
    this.answersContainers[index].drawBorder(true);
    this.answersContainers[index].setDefault();
  }

  public changeAnswerAlpha(
    userAnswer: number | null,
    rightAnswer: number | null,
    flag: boolean
  ): void {
    for (let i = 0; i < this.numAnswers; i++) {
      if (flag) {
        if (i !== rightAnswer) {
          this.answersContainers[i].changeSignificance(flag);
        }
      } else {
        this.answersContainers[i].changeSignificance(flag);
      }
    }
  }

  public resumeUserAnswers(userIndex: number, rightIndex: number): void {
    for (let i = 0; i < this.numAnswers; i++) {
      if (i === userIndex) {
        this.answersContainers[i].setSelected(userIndex === rightIndex);
      }
    }
  }
}
