import { LockPosition, PieceObj } from "../interfaces/utils.interface";
export class Piece {
  private scene: Phaser.Scene;

  private pieceW: number;
  private pieceH: number;
  private pieceRadius: number;

  private offsetX: number;
  private offsetY: number;
  private top: number;
  private right: number;
  private bottom: number;
  private left: number;
  private lineWidth: number;
  private fillColor: number;

  private graphics: Phaser.GameObjects.Graphics;
  private hitAreaPoints: any;

  /*
   *Image
   */
  private image: Phaser.GameObjects.Image;
  private x_offset: number;
  private y_offset: number;
  private line_ref: number;
  private column_ref: number;
  private lock_pos: LockPosition;

  constructor(
    scene: Phaser.Scene,
    pieceW: number,
    pieceH: number,
    pieceRadius: number,
    offsetX: number,
    offsetY: number,
    top: number,
    right: number,
    bottom: number,
    left: number,
    lineWidth: number,
    fillColor: number
  ) {
    this.scene = scene;
    this.pieceW = pieceW;
    this.pieceH = pieceH;
    this.pieceRadius = pieceRadius;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.lineWidth = lineWidth;
    this.fillColor = fillColor;

    this.pieceW_zommedOut = 100;
    this.pieceH_zommedOut = 100;
    this.pieceRadius_zommedOut = 20;

    this.graphics = this.scene.add.graphics();
  }

  public drawPiece(posX: number, posY: number, depth: number): void {
    var path = this.scene.add.path(posX, posY);
    var g_vec1: Phaser.Math.Vector2,
      g_vec2: Phaser.Math.Vector2,
      line1: Phaser.Curves.Line,
      line2: Phaser.Curves.Line;
    const startPoint = 4 / 10,
      endPoint = 6 / 10,
      controlPoint_1 = 3 / 10,
      controlPoint_2 = 5 / 10,
      controlPoint_3 = 7 / 10;

    var curve, curve_p1, curve_p2, curve_p3, curve_p4, curve_p5;

    if (this.top == 0) {
      g_vec1 = new Phaser.Math.Vector2(this.offsetX, this.offsetY);
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY
      );

      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    } else {
      g_vec1 = new Phaser.Math.Vector2(this.offsetX, this.offsetY);
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * startPoint,
        this.offsetY
      );
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);

      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * endPoint,
        this.offsetY
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY
      );
      line2 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line2);

      // the variable "top" permits reverse the socket bcz it multiplies by 1 or -1
      curve_p1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * startPoint,
        this.offsetY
      );
      curve_p2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_1,
        this.offsetY - (this.top * this.pieceRadius) / 2
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_2,
        this.offsetY - this.top * this.pieceRadius
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_3,
        this.offsetY - (this.top * this.pieceRadius) / 2
      );
      curve_p5 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * endPoint,
        this.offsetY
      );

      curve = new Phaser.Curves.Spline([
        curve_p1,
        curve_p2,
        curve_p3,
        curve_p4,
        curve_p5,
      ]);
      path.add(curve);
    }

    if (this.right == 0) {
      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH
      );

      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    } else {
      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH * startPoint
      );
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);

      curve_p1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH * startPoint
      );
      curve_p2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW + (this.right * this.pieceRadius) / 2,
        this.offsetY + this.pieceH * controlPoint_1
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW + this.right * this.pieceRadius,
        this.offsetY + this.pieceH * controlPoint_2
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW + (this.right * this.pieceRadius) / 2,
        this.offsetY + this.pieceH * controlPoint_3
      );
      curve_p5 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH * endPoint
      );

      curve = new Phaser.Curves.Spline([
        curve_p1,
        curve_p2,
        curve_p3,
        curve_p4,
        curve_p5,
      ]);
      path.add(curve);

      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH * endPoint
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH
      );
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    }

    if (this.bottom == 0) {
      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH
      );

      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    } else {
      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW,
        this.offsetY + this.pieceH
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * endPoint,
        this.offsetY + this.pieceH
      );
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);

      curve_p1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * endPoint,
        this.offsetY + this.pieceH
      );
      curve_p2 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_3,
        this.offsetY + this.pieceH + (this.bottom * this.pieceRadius) / 2
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_2,
        this.offsetY + this.pieceH + this.bottom * this.pieceRadius
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_1,
        this.offsetY + this.pieceH + (this.bottom * this.pieceRadius) / 2
      );
      curve_p5 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * startPoint,
        this.offsetY + this.pieceH
      );

      curve = new Phaser.Curves.Spline([
        curve_p1,
        curve_p2,
        curve_p3,
        curve_p4,
        curve_p5,
      ]);
      path.add(curve);

      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * startPoint,
        this.offsetY + this.pieceH
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH
      );

      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    }

    if (this.left == 0) {
      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH
      );
      g_vec2 = new Phaser.Math.Vector2(this.offsetX, this.offsetY);
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    } else {
      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH
      );
      g_vec2 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH * endPoint
      );
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);

      curve_p1 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH * endPoint
      );
      curve_p2 = new Phaser.Math.Vector2(
        this.offsetX - (this.left * this.pieceRadius) / 2,
        this.offsetY + this.pieceH * controlPoint_3
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX - this.left * this.pieceRadius,
        this.offsetY + this.pieceH * controlPoint_2
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX - (this.left * this.pieceRadius) / 2,
        this.offsetY + this.pieceH * controlPoint_1
      );
      curve_p5 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH * startPoint
      );

      curve = new Phaser.Curves.Spline([
        curve_p1,
        curve_p2,
        curve_p3,
        curve_p4,
        curve_p5,
      ]);
      path.add(curve);

      g_vec1 = new Phaser.Math.Vector2(
        this.offsetX,
        this.offsetY + this.pieceH * startPoint
      );
      g_vec2 = new Phaser.Math.Vector2(this.offsetX, this.offsetY);
      line1 = new Phaser.Curves.Line(g_vec1, g_vec2);
      path.add(line1);
    }

    this.graphics.beginPath();

    path.closePath();
    path.draw(this.graphics);

    this.hitAreaPoints = path.getPoints();
    this.graphics.lineStyle(this.lineWidth, 0x000000, 0.5);
    this.graphics.fillStyle(this.fillColor, 1);
    this.graphics.fillPoints(this.hitAreaPoints);
    //align piece to the center

    if (this.left === 1) {
      posX += this.pieceRadius / 2;
    }
    if (this.right === 1) {
      posX -= this.pieceRadius / 2;
    }
    if (this.top === 1) {
      posY += this.pieceRadius / 2;
    }
    if (this.bottom === 1) {
      posY -= this.pieceRadius / 2;
    }

    // console.log(posX);
    // console.log(posY);

    this.graphics.setPosition(posX - this.pieceW / 2, posY - this.pieceH / 2);
    this.graphics.setDepth(depth);

    this.graphics.closePath();
  }

  public getPieceGraphObj(): Phaser.GameObjects.Graphics {
    return this.graphics;
  }

  public getHitAreaPoints(): any {
    return this.hitAreaPoints;
  }

  public bindImageWithPiece(
    image: Phaser.GameObjects.Image,
    lineIndex: number,
    columnIndex: number
  ): Piece {
    this.image = image;

    this.image.setMask(this.graphics.createGeometryMask());
    this.x_offset = this.graphics.x - this.image.x;
    this.y_offset = this.graphics.y - this.image.y;
    this.line_ref = lineIndex;
    this.column_ref = columnIndex;
    this.lock_pos = {
      x: this.graphics.x,
      y: this.graphics.y,
    };

    this.image.setInteractive();
    this.scene.input.setDraggable(this.image);
    this.image.input.draggable = true;

    this.image.setData("image", { l: lineIndex, c: columnIndex });

    return this;
  }

  public resizeBindedPiece(
    pieceW: number,
    pieceH: number,
    pieceRadius: number,
    scaleValue: number
  ): void {
    this.pieceW = pieceW;
    this.pieceH = pieceH;
    this.pieceRadius = pieceRadius;
    this.image.setScale(scaleValue);
    this.graphics.setScale(scaleValue);
  }

  public setPiecePosition(posX: number, posY: number): void {
    if (this.left === 1) {
      posX += this.pieceRadius / 2;
    }
    if (this.right === 1) {
      posX -= this.pieceRadius / 2;
    }
    if (this.top === 1) {
      posY += this.pieceRadius / 2;
    }
    if (this.bottom === 1) {
      posY -= this.pieceRadius / 2;
    }

    this.graphics.setPosition(posX - this.pieceW / 2, posY - this.pieceH / 2);
  }

  public setImagePosition(posX: number, posY: number): void {
    this.image.setPosition(posX, posY);
  }

  public setBindedPiecePosition(posX: number, posY: number): void {
    // const final_x = posX - this.x_offset;
    // const final_y = posY - this.y_offset;
    // this.image.setPosition(final_x, final_y);
    // this.graphics.setPosition(final_x + this.x_offset, final_y + this.y_offset);
    this.setPiecePosition(posX, posY);
    this.setImagePosition(posX, posY);
  }

  public setZoomIn(): void {
    this.pieceW_zommedIn = this.pieceW;
    this.pieceH_zommedIn = this.pieceH;
    this.pieceRadius_zommedIn = this.pieceRadius;
  }

  public setZoomOut(scaleValue: number): void {
    this.pieceW_zommedOut = scaleValue * this.pieceW;
    this.pieceH_zommedOut = scaleValue * this.pieceH;
    this.pieceRadius_zommedOut = scaleValue * this.pieceRadius;
  }
}
