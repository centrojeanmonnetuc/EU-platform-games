import { CONST } from "../const/const";
import { QuestionObj } from "../interfaces/utils.interface";
import { Question } from "./question";

export class Character {
  private scene: Phaser.Scene;

  private character: Phaser.GameObjects.Sprite;
  private characterScaleValue: number = 0.6;

  private initX: number;
  private finalX: number;
  private centerY: number;
  private gameWidth: number;

  // objects with that the character interactes
  private questionContainer: Question;
  // questions array
  private questions: QuestionObj[];

  // animation settings:
  private globalEase: string = "Linear";

  // event
  private emitter: Phaser.Events.EventEmitter;

  // debug
  private debug: number = 100;
  // private debug: number = 1;

  constructor(
    scene: Phaser.Scene,
    initX: number,
    finalX: number,
    centerY: number,
    gameWidth: number,
    questionContainer: Question,
    questions: QuestionObj[],
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene;
    this.initX = initX;
    this.finalX = finalX;
    this.centerY = centerY;
    this.gameWidth = gameWidth;
    this.questionContainer = questionContainer;
    this.questions = questions;
    this.emitter = emitter;

    this.createCharacter();
    this.createAnimations();
  }

  public createCharacter(): void {
    this.characterScaleValue = 0.6;
    this.character = this.scene.add.sprite(0, 0, "right");
    this.character
      .setOrigin(0, 0.5)
      .setDepth(1)
      .setScale(this.characterScaleValue)
      .setPosition(
        -this.character.width * this.characterScaleValue,
        this.centerY
      );
  }

  public deleteCharacter(): void {
    this.character.destroy();
  }

  private createAnimations(): void {
    this.scene.anims.create({
      key: "correct_answer",
      frames: "right",
      frameRate: 30,
      repeat: -1,
    });
    // this.scene.anims.create({
    //   key: "wrong_answer",
    //   frames: "wrong",
    //   frameRate: 30,
    //   repeat: 0,
    // });
  }

  public playCharacterAppearAnimation(): void {
    this.character.play("correct_answer");
    this.scene.tweens.add({
      targets: this.character,
      x: this.initX - (this.character.width * this.characterScaleValue) / 4,
      ease: this.globalEase,
      duration: 1000 / this.debug,
      onComplete: () => this.playCharacterJustificationAnimation(),
    });
  }

  private playCharacterJustificationAnimation(): void {
    this.scene.tweens.add({
      targets: [this.character, this.questionContainer.getQuestContainer()],
      x: this.gameWidth,
      ease: this.globalEase,
      duration: 1600 / this.debug,
      onComplete: () => this.playCharacterComeBackAnimation(),
    });
  }

  private playCharacterComeBackAnimation(): void {
    // justification apperance
    const questionObj = this.questions[CONST.CURRENT_QUESTION];

    // set justification
    this.questionContainer.setQuestionText(questionObj.justification);

    this.scene.tweens.add({
      targets: this.questionContainer.getQuestContainer(),
      x: this.questionContainer.getCenterX(this.gameWidth),
      ease: this.globalEase,
      duration: 1000 / this.debug,
      onComplete: () => {
        this.completedAnimation();
      },
    });

    // flip character
    this.flipCharacter();

    this.scene.tweens.add({
      targets: this.character,
      x: this.finalX + (this.character.width * this.characterScaleValue) / 4, // adjust the /4 value to align the character
      ease: this.globalEase,
      duration: 1000 / this.debug,
    });
  }

  private flipCharacter(): void {
    this.character.setScale(
      -1 * this.characterScaleValue,
      1 * this.characterScaleValue
    );
    const actualCharX = this.character.x;
    this.character.setX(
      actualCharX + this.character.width * this.characterScaleValue
    );
  }

  private completedAnimation(): void {
    this.character.stop();
    this.emitter.emit("completedAnimation", this);
  }
}
