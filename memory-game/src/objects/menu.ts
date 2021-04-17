export class Menu {
  private scene: Phaser.Scene;
  private menuRect: Phaser.GameObjects.Graphics;

  private menuRatioW: number;
  private menuRatioH: number;
  private barColor: number;
  private barStrokeColor: number;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    width: number,
    height: number,
    offset: number
  ) {
    this.scene = scene;

    this.barColor = 0x0000aa;
    this.barStrokeColor = 0xffcc00;

    this.buildMenu(posX, posY, width, height, offset);
  }

  private buildMenu(
    posX: number,
    posY: number,
    width: number,
    height: number,
    offset: number
  ): void {
    this.menuRect = this.scene.add.graphics();

    // apply styles
    this.menuRect.beginPath();
    this.menuRect.fillStyle(this.barStrokeColor, 1);
    this.menuRect.fillRoundedRect(
      posX - offset / 2,
      posY - offset / 2,
      width + offset,
      height + offset,
      {
        tl: 20,
        tr: 20,
        bl: 20,
        br: 20,
      }
    );
    this.menuRect.strokePath();
    this.menuRect.closePath();

    this.menuRect.beginPath();
    this.menuRect.fillStyle(this.barColor, 1);
    this.menuRect.fillRoundedRect(posX, posY, width, height, {
      tl: 20,
      tr: 20,
      bl: 20,
      br: 20,
    });
    this.menuRect.strokePath();
    this.menuRect.closePath();
  }

  public getMenuRect(): Phaser.GameObjects.Graphics {
    return this.menuRect;
  }
}
