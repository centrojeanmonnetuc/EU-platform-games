export class Text {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, posX: number, posY: number, text: string) {
    this.scene = scene;
    this.text = this.scene.add.text(posX, posY, text, {
      fontFamily: "Arial",
      fontSize: 32,
      color: "#ffffff",
      align: "center",
    });

    console.log(this.text);
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

// constructor(scene: Phaser.Scene, posX: number, posY: number, text: string) {
//   this.scene = scene;
//   this.text = this.scene.add.text(-100, -100, text);

//   WebFont.load({
//     google: {
//       families: ["Mouse Memoirs"],
//     },
//     active: () => this.initText(posX, posY, text),
//   });

//   console.log(this.text);
// }

// private initText(posX: number, posY: number, text: string): void {
//   this.text = this.scene.add.text(posX, posY, text, {
//     fontFamily: "Mouse Memoirs",
//     fontSize: 64,
//     color: "#ffffff",
//     align: "center",
//   });
// }

// public setText(updatedText: string) {
//   // console.log(this.text);
//   this.text.setText(updatedText);
// }

// public changePosition(posX: number, posY: number) {
//   console.log("sdfs");
//   this.text.setPosition(posX, posY);
// }

// public getText(): Phaser.GameObjects.Text {
//   return this.text;
// }
