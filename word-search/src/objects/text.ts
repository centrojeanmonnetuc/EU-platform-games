export class DisplayText {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    text: string,
    wrapW: number,
    fontSize: number,
    color: string
  ) {
    this.scene = scene;

    this.text = this.scene.make.text({
      x: posX,
      y: posY,
      text: text,
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontFamily: "Arial",
        fontSize: fontSize,
        color: color,
        wordWrap: {
          width: wrapW,
          useAdvancedWrap: true,
        },
      },
    });

    // console.log(this.text);
  }

  public changeDisplayedText(text: string) {
    this.text.setText(text);
  }

  public changeTextPositios(posX: number, posY: number) {
    this.text.setPosition(posX, posY);
  }

  public getText(): Phaser.GameObjects.Text {
    return this.text;
  }
}
