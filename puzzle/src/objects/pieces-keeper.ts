import { CONST } from "../const/const";
import { PiecesBoard, LockPosition } from "../interfaces/utils.interface";
import { getRndInteger } from "../utils/puzzle";
import { Piece } from "./piece";

export class PiecesKeeper {
  private scene: Phaser.Scene;

  private gapW: number;
  private gapH: number;
  private container1: PiecesBoard;
  private container2: PiecesBoard;
  private pieces: Piece[];

  constructor(
    scene: Phaser.Scene,
    gapW: number,
    gapH: number,
    container1: PiecesBoard,
    container2: PiecesBoard,
    pieces: Piece[]
  ) {
    this.scene = scene;
    this.gapW = gapW;
    this.gapH = gapH;
    this.container1 = container1;
    this.container2 = container2;
    this.pieces = pieces;

    // console.log(container1);
    // console.log(container2);

    this.putPiecesInContainers();
  }

  private putPiecesInContainers(): void {
    for (let i = 0; i < this.pieces.length; i++) {
      const rndPos = this.getRandomContainerPos();
      this.pieces[i].setBindedPiecePosition(rndPos.x, rndPos.y);
    }
  }

  private getRandomContainerPos(): LockPosition {
    const randomContainer = getRndInteger(1, 2);
    let randomX, randomY;
    if (randomContainer === 1) {
      randomX = getRndInteger(
        this.container1.x + this.gapW,
        this.container1.width - this.gapW
      );
      randomY = getRndInteger(
        this.container1.y + this.gapH,
        this.container1.height - this.gapH
      );
    } else {
      randomX = getRndInteger(
        this.container2.x + this.gapW,
        this.container2.width - this.gapW
      );
      randomY = getRndInteger(
        this.container2.y + this.gapH,
        this.container2.height - this.gapH
      );
    }

    return {
      x: randomX,
      y: randomY,
    };
  }
}
