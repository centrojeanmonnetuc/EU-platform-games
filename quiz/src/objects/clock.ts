import { CONST } from "../const/const";
import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Clock {
  private scene: Phaser.Scene;
  private clockImage: Phaser.GameObjects.Image;
  private timeContainer: Phaser.GameObjects.Container;

  private posX: number;
  private posY: number;
  private width: number;
  private height: number;

  private text: Phaser.GameObjects.Text;
  private endingColor: number = 0xff0000;

  // animations
  private animClock: Phaser.Tweens.Tween | null = null;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.scene = scene;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;

    this.createClock();
  }

  public createClock(): void {
    this.clockImage = this.scene.add.image(0, 0, "hourglass");
    this.clockImage = scaleImageToFitFrame(
      this.width,
      this.height,
      this.clockImage
    );
    this.timeContainer = this.scene.add.container();
    this.text = this.scene.add.text(0, 16, "--", {
      fontFamily: "Arial",
      fontSize: 64,
      color: "#000000",
      align: "center",
    });
    this.text.setPosition(
      this.clockImage.getBounds().right + 20,
      this.clockImage.y
    );
    this.text.setOrigin(0, 0.5);
    this.timeContainer.add(this.clockImage);
    this.timeContainer.add(this.text);

    const offsetX =
      this.clockImage.getBounds().left + this.text.getBounds().right;
    this.timeContainer.setPosition(this.posX, this.posY);
  }

  public updateTime(time: string): void {
    if (parseInt(time) === 8 && this.animClock === null) {
      this.shakeImage();
    }
    if (parseInt(time) <= 6) {
      this.text.setTint(this.endingColor);
    }
    this.text.setText(time);
  }

  private shakeImage(): void {
    this.animClock = this.scene.tweens.add({
      targets: this.clockImage,
      duration: 500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      scale:
        this.clockImage.getData("scaled_value") +
        this.clockImage.getData("scaled_value") * 0.2,
    });
  }

  public cancelAnims(): void {
    if (this.animClock !== null) {
      this.animClock.stop();
      this.animClock = null;
    }
  }

  public clearClock(): void {
    this.clockImage.destroy();
    this.text.destroy();
    this.timeContainer.destroy();
  }
}
