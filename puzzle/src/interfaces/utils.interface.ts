export interface ObjectSize {
  width: number;
  height: number;
}

export interface NumPieces {
  horizontal: number;
  vertical: number;
}

export interface PieceInfo {
  t: number;
  r: number;
  b: number;
  l: number;
  pos_x: number;
  pos_y: number;
}

export interface PieceObj {
  pieceImg: Phaser.GameObjects.Image;
  pieceObj: Phaser.GameObjects.Graphics;
}

export interface PiecesBoard {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LockPosition {
  x: number;
  y: number;
}
