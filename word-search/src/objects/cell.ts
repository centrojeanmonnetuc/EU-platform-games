import { ObjectPosition } from "../interfaces/utils.interface";

export class Cell {
  private scene: Phaser.Scene;
  private cell: Phaser.GameObjects.Image;
  private gridPos: ObjectPosition;
  private char: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    gridIndex: ObjectPosition,
    char: string
  ) {
    this.scene = scene;
    this.gridPos = gridIndex;
    this.char = char;

    this.createCell(x, y, texture);
  }

  private createCell(x: number, y: number, texture: string): void {
    this.cell = this.scene.add.image(x, y, texture);
    this.cell.setOrigin(0).setInteractive().setDepth(-1);
  }

  public getCellImg(): Phaser.GameObjects.Image {
    return this.cell;
  }

  public getChar(): string {
    return this.char;
  }

  public getGridPos(): ObjectPosition {
    return this.gridPos;
  }

  public setColor(color: number): void {
    this.cell.setTint(color);
  }
}
