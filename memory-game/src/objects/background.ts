import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Background {
  private scene: Phaser.Scene;
  private backgroundImage: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    image: string,
    gameWidth: number,
    gameHeight: number
  ) {
    this.scene = scene;

    this.backgroundImage = this.scene.add.image(0, 0, image);
    this.backgroundImage = this.fitImage(
      this.backgroundImage,
      gameWidth,
      gameHeight
    );
  }

  private fitImage(
    image: Phaser.GameObjects.Image,
    width: number,
    height: number
  ): Phaser.GameObjects.Image {
    image = scaleImageToFitFrame(width * 1.3, height, image);
    image.setOrigin(0.5);
    const imageBounds = image.getBounds();
    image.setPosition(width / 2, height / 2);

    return image;
  }

  public setAlpha(val: number): void {
    this.backgroundImage.setAlpha(val);
  }
}
