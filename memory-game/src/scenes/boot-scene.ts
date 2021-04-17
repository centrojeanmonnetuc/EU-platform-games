export class BootScene extends Phaser.Scene {
  // database params
  private destroyCard: boolean = false;
  private timeCardIsVisible: number = 800; // - 200ms  -> card turning time 200 ms
  private timeToComplete: number | null = 3;
  private maxAttempts: number | null = null;

  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    this.load.image("back", "../../assets/images/back.png");
    this.load.image("bear", "../../assets/images/bear.png");
    this.load.image("eagle", "../../assets/images/eagle.png");
    this.load.image("koala", "../../assets/images/koala.png");
    this.load.image("parrot", "../../assets/images/parrot.png");
    this.load.image("PT_flag", "../../assets/images/pt.png");
    this.load.image("DE_flag", "../../assets/images/de.jpg");
    this.load.image("1", "../../assets/images/1.jpg");
    this.load.image("1", "../../assets/images/2.png");
    this.load.image("1", "../../assets/images/3.jpg");
  }

  create(): void {
    const imagesArr = [
      "bear",
      "eagle",
      "koala",
      "parrot",
      "PT_flag",
      "DE_flag",
      "1",
      "2",
      "3",
      "back",
    ];
    const imagesArr2 = [
      "bear",
      "eagle",
      "koala",
      "parrot",
      "PT_flag",
      "DE_flag",
      "1",
      "2",
      "3",
      "back",
    ];
    this.scene.start("GameScene", {
      destroyCard: this.destroyCard,
      timeCardIsVisible: this.timeCardIsVisible,
      imagesArr: imagesArr,
      timeToComplete: this.timeToComplete,
      maxAttempts: this.maxAttempts,
    });
  }
}
