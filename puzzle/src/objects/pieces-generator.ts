import { PieceType } from "../interfaces/utils.interface";

export class PiecesGenerator {
  private scene: Phaser.Scene;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private pieceW: number;
  private pieceH: number;
  private pieceRadius: number;
  private pieceGraphic: Phaser.GameObjects.Graphics;

  private lineWidth: number = 0.5;
  private fillColor: number = 0x696969;

  constructor(
    scene: Phaser.Scene,
    pieceW: number,
    pieceH: number,
    pieceRadius: number,
    piecesParams: number[]
  ) {
    this.scene = scene;
    this.pieceW = pieceW;
    this.pieceH = pieceH;
    this.pieceRadius = pieceRadius;

    this.generator(piecesParams);
  }

  private generator(piecesParams: number[]): void {
    this.pieceGraphic = this.scene.add.graphics();
    const arrSize = piecesParams.length;
    let controlArr = [];
    // const arrSize = 1;
    for (let i = 0; i < arrSize; i++) {
      controlArr.push(piecesParams[i]);
      for (let j = 0; j < arrSize; j++) {
        controlArr.push(piecesParams[j]);
        for (let k = 0; k < arrSize; k++) {
          controlArr.push(piecesParams[k]);
          for (let m = 0; m < arrSize; m++) {
            controlArr.push(piecesParams[m]);

            if (!this.verifyRepeatedNumbers(controlArr)) {
              const pieceFormat: PieceType = {
                top: piecesParams[i],
                right: piecesParams[j],
                bottom: piecesParams[k],
                left: piecesParams[m],
              };
              this.setOffset(pieceFormat);
              // console.log(
              //   piecesParams[i],
              //   piecesParams[j],
              //   piecesParams[k],
              //   piecesParams[m]
              // );
              this.drawPiece(
                this.pieceW / 2,
                this.pieceH / 2,
                piecesParams[i],
                piecesParams[j],
                piecesParams[k],
                piecesParams[m],
                -1,
                false
              );
            }

            controlArr.pop();
          }
          controlArr.pop();
        }
        controlArr.pop();
      }
      controlArr.pop();
    }
  }

  private verifyRepeatedNumbers(arr: number[]): boolean {
    let counter_1 = 0;
    let counter0 = 0;
    let counter1 = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === -1) {
        counter_1++;
      } else if (arr[i] === 0) {
        counter0++;
      } else if (arr[i] === 1) {
        counter1++;
      }
    }
    if (counter_1 > 2 || counter0 > 2 || counter1 > 2) return true;

    return false;
  }

  private setOffset(pieceType: PieceType): void {
    this.offsetX = 0;
    this.offsetY = 0;
    if (pieceType.top === 1) {
      this.offsetY += this.pieceRadius;
    }
    if (pieceType.left === 1) {
      this.offsetX += this.pieceRadius;
    }
  }

  public drawPiece(
    posX: number,
    posY: number,
    top: number,
    right: number,
    bottom: number,
    left: number,
    depth: number,
    transparent: boolean
  ): void {
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

    if (top == 0) {
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
        this.offsetY - (top * this.pieceRadius) / 2
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_2,
        this.offsetY - top * this.pieceRadius
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_3,
        this.offsetY - (top * this.pieceRadius) / 2
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

    if (right == 0) {
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
        this.offsetX + this.pieceW + (right * this.pieceRadius) / 2,
        this.offsetY + this.pieceH * controlPoint_1
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW + right * this.pieceRadius,
        this.offsetY + this.pieceH * controlPoint_2
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW + (right * this.pieceRadius) / 2,
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

    if (bottom == 0) {
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
        this.offsetY + this.pieceH + (bottom * this.pieceRadius) / 2
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_2,
        this.offsetY + this.pieceH + bottom * this.pieceRadius
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX + this.pieceW * controlPoint_1,
        this.offsetY + this.pieceH + (bottom * this.pieceRadius) / 2
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

    if (left == 0) {
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
        this.offsetX - (left * this.pieceRadius) / 2,
        this.offsetY + this.pieceH * controlPoint_3
      );
      curve_p3 = new Phaser.Math.Vector2(
        this.offsetX - left * this.pieceRadius,
        this.offsetY + this.pieceH * controlPoint_2
      );
      curve_p4 = new Phaser.Math.Vector2(
        this.offsetX - (left * this.pieceRadius) / 2,
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
    path.closePath();

    this.pieceGraphic.beginPath();
    path.draw(this.pieceGraphic);

    const hitAreaPoints = path.getPoints();
    this.pieceGraphic.lineStyle(this.lineWidth, 0x696969, 5);
    this.pieceGraphic.fillStyle(this.fillColor, 1);
    this.pieceGraphic.fillPoints(hitAreaPoints);

    // align piece to the center
    if (left === 1) {
      posX += this.pieceRadius / 2;
    }
    if (right === 1) {
      posX -= this.pieceRadius / 2;
    }
    if (top === 1) {
      posY += this.pieceRadius / 2;
    }
    if (bottom === 1) {
      posY -= this.pieceRadius / 2;
    }

    this.pieceGraphic.closePath();
    this.pieceGraphic.setVisible(false);
    this.pieceGraphic.setDepth(-2);
    let width = this.offsetX + this.pieceW;
    let height = this.offsetY + this.pieceH;
    if (right === 1) {
      width += this.pieceRadius;
    }
    if (bottom === 1) {
      height += this.pieceRadius;
    }
    const pieceTexture = this.scene.add
      .renderTexture(0, 0, width, height)
      .setVisible(false);
    pieceTexture.draw(this.pieceGraphic);
    pieceTexture.saveTexture(`piece_${top}_${right}_${bottom}_${left}`);

    // var img = this.scene.add.image(300, 100, "outside_piece_0_-1_1_0");

    // reset graphics
    this.pieceGraphic.clear();
  }
}
