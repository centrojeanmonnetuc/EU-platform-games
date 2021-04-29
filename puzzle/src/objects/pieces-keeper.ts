import { CONST } from "../const/const";
import { PiecesBoard, PieceCoor } from "../interfaces/utils.interface";
import { getRndInteger } from "../utils/puzzle";
import { Piece } from "./piece";

export class PiecesKeeper {
  private scene: Phaser.Scene;

  private gapW: number;
  private gapH: number;
  private container1: PiecesBoard;
  private container2: PiecesBoard;
  private pieces: Piece[];

  // limit of trys to put the piece in random position not overlapping with others
  private limitTrys: number = 20;

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
    let counterTrys: number;
    let rndPos: PieceCoor;
    let tempCoordsArr: PieceCoor[] = [];
    for (let i = 0; i < this.pieces.length; i++) {
      counterTrys = 0;
      do {
        // console.log("try " + counterTrys + "...");
        rndPos = this.getRandomContainerPos();
      } while (
        ++counterTrys < this.limitTrys &&
        this.verifyOverlap(rndPos, tempCoordsArr)
      );

      tempCoordsArr.push({
        x: rndPos.x,
        y: rndPos.y,
      });
      this.pieces[i].setBindedPiecePosition(rndPos.x, rndPos.y);
      this.pieces[i].setPieceInitCoors({ x: rndPos.x, y: rndPos.y });
    }
  }

  private getRandomContainerPos(): PieceCoor {
    const randomContainer = getRndInteger(1, 2);
    let randomX, randomY;
    if (randomContainer === 1) {
      randomX = getRndInteger(this.container1.x, this.container1.width);
      randomY = getRndInteger(this.container1.y, this.container1.height);
    } else {
      randomX = getRndInteger(this.container2.x, this.container2.width);
      randomY = getRndInteger(this.container2.y, this.container2.height);
    }

    return {
      x: randomX,
      y: randomY,
    };
  }

  private verifyOverlap(tempRndPos: PieceCoor, arr: PieceCoor[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (
        tempRndPos.x > arr[i].x - this.gapW &&
        tempRndPos.x < arr[i].x + this.gapW &&
        tempRndPos.y > arr[i].y - this.gapH &&
        tempRndPos.y < arr[i].y + this.gapH
      ) {
        console.log("overlap");
        return true;
      }
    }
    return false;
  }
}
