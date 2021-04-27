export const scaleImageToFitFrame = (
  maxWidth: number,
  maxHeight: number,
  imgObj: Phaser.GameObjects.Image
): Phaser.GameObjects.Image => {
  let maxScaleWidth = 1;
  let maxScaleHeight = 1;

  // find scale width interval
  maxScaleWidth = maxWidth / imgObj.width;
  // find scale height interval
  maxScaleHeight = maxHeight / imgObj.height;

  let newScaleValue = Math.min(
    Number(maxScaleWidth.toFixed(3)),
    Number(maxScaleHeight.toFixed(3))
  );

  imgObj
    .setScale(newScaleValue)
    .setSize(
      Math.floor(imgObj.width * newScaleValue),
      Math.floor(imgObj.height * newScaleValue)
    );

  imgObj.setData("scaled_value", newScaleValue);
  imgObj.setData("scaled_w", Math.floor(imgObj.width * newScaleValue));
  imgObj.setData("scaled_h", Math.floor(imgObj.height * newScaleValue));

  return imgObj;
};
