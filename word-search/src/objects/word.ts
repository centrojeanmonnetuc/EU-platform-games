import { Word } from "../interfaces/utils.interface";
export class WordObj {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;
  private line: Phaser.Geom.Line;
  private wordAlpha: number = 0.6;
  private text_string: string;
  private tween: Phaser.Tweens.Tween;
  private word_strikethrough: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    word: Word,
    fontSize: number
  ) {
    this.scene = scene;
    this.text_string = word.word;

    this.text = this.scene.add.text(x, y, word.word_input, {
      fontFamily: "Arial",
      fontSize: fontSize,
      color: "#FFFFFF",
    });
    this.text.setOrigin(0, 0);
  }

  public getTextObj(): Phaser.GameObjects.Text {
    return this.text;
  }

  public scribeWord(
    duration: number,
    lineWidth: number,
    lineColor: number,
    lineAlpha: number
  ): void {
    this.word_strikethrough = this.scene.add.graphics({
      lineStyle: { width: lineWidth, color: lineColor, alpha: lineAlpha },
    });

    this.scene.tweens.addCounter({
      from: this.text.getBounds().left,
      to: this.text.getBounds().right,
      duration: duration,
      onUpdate: (tween) => {
        var t = tween.getValue();

        this.word_strikethrough.clear();
        this.line = new Phaser.Geom.Line(
          this.text.getBounds().left,
          this.text.getBounds().centerY,
          t,
          this.text.getBounds().centerY
        );
        this.word_strikethrough.strokeLineShape(this.line);
      },
    });

    this.text.setAlpha(this.wordAlpha);
  }

  public getText(): string {
    return this.text_string;
  }
}
