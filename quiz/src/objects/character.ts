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

  constructor(
    scene: Phaser.Scene,
    initX: number,
    finalX: number,
    centerY: number,
    gameWidth: number,
    questionContainer: Question
  ) {
    this.scene = scene;
    this.initX = initX;
    this.finalX = finalX;
    this.centerY = centerY;
    this.gameWidth = gameWidth;
    this.questionContainer = questionContainer;

    this.createCharacter();
    this.createAnimations();
    this.playCharacterAppearAnimation();
  }

  private createCharacter(): void {
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

  private playCharacterAppearAnimation(): void {
    this.character.play("correct_answer");

    this.scene.tweens.add({
      targets: this.character,
      x: this.initX - (this.character.width * this.characterScaleValue) / 4,
      ease: "Linear",
      duration: 1000,
      onComplete: () => this.playCharacterJustificationAnimation(),
    });
  }

  private playCharacterJustificationAnimation(): void {
    this.scene.tweens.add({
      targets: [this.character, this.questionContainer.getQuestContainer()],
      x: this.gameWidth,
      ease: "Linear",
      duration: 1500,
      onComplete: () => this.playCharacterComeBackAnimation(),
    });
  }

  private playCharacterComeBackAnimation(): void {
    this.scene.tweens.add({
      targets: this.questionContainer.getQuestContainer(),
      x: this.questionContainer.getCenterX(this.gameWidth),
      ease: "Linear",
      duration: 1500,
      onComplete: () => this.character.stop(),
    });

    // flip character
    this.flipCharacter();

    this.scene.tweens.add({
      targets: this.character,
      x: this.finalX + (this.character.width * this.characterScaleValue) / 4, // adjust the /4 value to align the character
      ease: "Linear",
      duration: 1500,
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
}
