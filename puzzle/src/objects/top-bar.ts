export class TopBar {
  private scene: Phaser.Scene;
  private barBody: Phaser.GameObjects.Graphics;
  private gameWidth: number;
  private gameHeight: number;
  private barHeightScale: number;
  private barColor: number;
  private barStrokeColor: number;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.gameWidth = width;
    this.gameHeight = height;
    this.barBody = new Phaser.GameObjects.Graphics(this.scene);

    // height size of the bar in relation with the game height
    this.barHeightScale = 8;
    this.barColor = 0x0000aa;
    this.barStrokeColor = 0xffcc00;

    this.buildBar();
  }

  private buildBar(): void {
    this.barBody = this.scene.add.graphics();

    // apply styles
    this.barBody.beginPath();
    this.barBody.fillStyle(this.barStrokeColor, 1);
    this.barBody.fillRoundedRect(
      0,
      0,
      this.gameWidth,
      this.gameHeight / (this.barHeightScale - 0.3),
      {
        tl: 0,
        tr: 0,
        bl: 20,
        br: 20,
      }
    );
    this.barBody.strokePath();
    this.barBody.closePath();

    this.barBody.beginPath();
    this.barBody.fillStyle(this.barColor, 1);
    this.barBody.fillRoundedRect(
      0,
      0,
      this.gameWidth,
      this.gameHeight / this.barHeightScale,
      {
        tl: 0,
        tr: 0,
        bl: 24,
        br: 24,
      }
    );
    this.barBody.strokePath();
    this.barBody.closePath();
  }

  public getHeight(): number {
    return this.gameHeight / this.barHeightScale;
  }
}
