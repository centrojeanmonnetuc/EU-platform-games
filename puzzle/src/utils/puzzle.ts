export const dualSocketPieceVerifier = (obj) => {
  if (obj.t == 1 && obj.b == 1) return 2;
  if (obj.r == 1 && obj.l == 1) return 1;
  return 0;
};

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const checkLockPosition = (lock_pos, obj_x, obj_y, lock_offset) => {
  if (
    obj_x > lock_pos.x - lock_offset &&
    obj_x < lock_pos.x + lock_offset &&
    obj_y > lock_pos.y - lock_offset &&
    obj_y < lock_pos.y + lock_offset
  ) {
    return true;
  }
  return false;
};
