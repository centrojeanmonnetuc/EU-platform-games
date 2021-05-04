import { CONST } from "../const/const";
import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Clock {
  private scene: Phaser.Scene;
  private clockImage: Phaser.GameObjects.Image;
  private timeContainer: Phaser.GameObjects.Container;

  private text: Phaser.GameObjects.Text;
  private endingColor: number = 0xff0000;

  // animations
  private animClock: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    width: number,
    height: number
  ) {
    this.scene = scene;

    this.clockImage = this.scene.add.image(0, 0, "hourglass");
    this.clockImage = scaleImageToFitFrame(width, height, this.clockImage);
    // this.clockImage.setPosition(width / 2, this.clockImage.y);
    this.timeContainer = this.scene.add.container();
    this.text = this.scene.add.text(0, 16, "100", {
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
    this.timeContainer.setPosition(posX, posY);
  }

  public updateTime(time: string): void {
    if (parseInt(time) === 8) {
      this.shakeImage();
    }
    if (parseInt(time) <= 6) {
      this.text.setTint(this.endingColor);
    }
    this.text.setText(time);
  }

  private shakeImage(): void {
    this.scene.tweens.add({
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
    this.scene.tweens.destroy();
  }
}
