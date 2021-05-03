import { scaleImageToFitFrame } from "../utils/resizeImage";
import { Answer } from "../objects/answer";

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

  public getAnswerAtIndex(index: number): Phaser.GameObjects.Container {
    return this.answersContainers[index].getAnswerContainer();
  }

  public setReviewAnswers(userChoice: number, rightChoice: number): void {
    let obj;
    for (let i = 0; i < this.numAnswers; i++) {
      obj = this.answersContainers[i];
      if (i === userChoice) {
        obj.setAnswerColor("yellow");
      } else if (i === rightChoice) {
        obj.setAnswerColor("green");
      } else {
        obj.setAnswerColor("red");
      }
    }
  }
}
