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
  private g: Phaser.GameObjects.Graphics;

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
    fillColor: number,
    g: Phaser.GameObjects.Graphics
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
    this.g = g;
  }

  public drawPiece(
    posX: number,
    posY: number,
    depth: number
  ): Phaser.GameObjects.Graphics {
    // var g = this.scene.add.graphics();
    // g.lineStyle(this.lineWidth, 0x000000, 1);

    var path = this.scene.add.path();
    var g_vec1, g_vec2, line1, line2;
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

    path.draw(this.g);

    // FILL PATH
    var points = path.getPoints();
    //g.fillStyle(0x4b86b4, 0.95);
    this.g.fillStyle(0x696969, 1);
    this.g.fillStyle(this.fillColor, 1);
    this.g.fillPoints(points);

    this.g.setPosition(posX, posY);
    this.g.setDepth(depth);

    return this.g;
  }
}
