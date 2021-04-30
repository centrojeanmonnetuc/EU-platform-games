import { scaleImageToFitFrame } from "../utils/resizeImage";

export class Background {
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    imageRef: string,
    gameWidth: number,
    gameHeight: number
  ) {
    this.scene = scene;

    let bg = this.scene.add.image(0, 0, imageRef);
    bg = scaleImageToFitFrame(gameWidth * 1.4, gameHeight, bg);
    bg.setOrigin(0).setDepth(-20);
  }
}
