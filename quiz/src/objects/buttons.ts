import { ObjectPosition } from "../interfaces/utils.interface";
import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Buttons {
  private scene: Phaser.Scene;

  private spaceButtons: number = 40;
  private btnLeft: Phaser.GameObjects.Image;
  private btnRight: Phaser.GameObjects.Image;

  // event
  private emitter: Phaser.Events.EventEmitter;

  constructor(
    scene: Phaser.Scene,
    imgRef: string,
    btnLeftPos: ObjectPosition,
    btnRightPos: ObjectPosition,
    emitter: Phaser.Events.EventEmitter
  ) {
    this.scene = scene;
    this.emitter = emitter;

    this.btnLeft = this.createBtn(
      btnLeftPos,
      imgRef,
      this.btnLeft,
      true,
      "left"
    );
    this.btnRight = this.createBtn(
      btnRightPos,
      imgRef,
      this.btnRight,
      false,
      "right"
    );
  }

  private createBtn(
    btnPos: ObjectPosition,
    imgRef: string,
    imgObj: Phaser.GameObjects.Image,
    swapDirection: boolean,
    type: string
  ): Phaser.GameObjects.Image {
    // custom
    const scaleValue = 0.3;
    if (swapDirection) {
      imgObj = this.scene.add.image(
        btnPos.x - this.spaceButtons,
        btnPos.y,
        imgRef
      );
      imgObj.setScale(-scaleValue);
    } else {
      imgObj = this.scene.add.image(
        btnPos.x + this.spaceButtons,
        btnPos.y,
        imgRef
      );
      imgObj.setScale(scaleValue);
    }

    imgObj.setInteractive();
    imgObj.on("pointerdown", () => this.clickHandler(type));

    return imgObj;
  }

  private clickHandler(type: string): void {
    this.emitter.emit("changeQuestion", type);
  }

  private disableButton(btnRef: Phaser.GameObjects.Image) {
    btnRef.setAlpha(0.6);
    btnRef.disableInteractive();
  }
  private enableButton(btnRef: Phaser.GameObjects.Image) {
    btnRef.setAlpha(1);
    btnRef.setInteractive();
  }

  public enableRightBtn(flag: boolean): void {
    if (flag) {
      this.enableButton(this.btnRight);
    } else {
      this.disableButton(this.btnRight);
    }
  }

  public enableLeftButton(flag: boolean): void {
    if (flag) {
      this.enableButton(this.btnLeft);
    } else {
      this.disableButton(this.btnLeft);
    }
  }
}
