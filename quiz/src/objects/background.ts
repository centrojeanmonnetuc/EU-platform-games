import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Background {
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    image: string,
    gameWidth: number,
    gameHeight: number
  ) {
    this.scene = scene;

    let bg = this.scene.add.image(0, 0, image);
    this.fitImage(bg, gameWidth, gameHeight);
  }

  private fitImage(
    image: Phaser.GameObjects.Image,
    width: number,
    height: number
  ): void {
    image = scaleImageToFitFrame(1000000, height, image);
    image.setOrigin(0);
  }
}
