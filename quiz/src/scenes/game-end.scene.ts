import { Menu } from "../objects/menu";
import { DisplayText } from "../objects/text";
export class GameEndScene extends Phaser.Scene {
  private gameHeight: number;
  private gameWidth: number;
  private win: boolean;

  private modal: Phaser.GameObjects.Rectangle;
  private menu: Menu;
  private circle: Phaser.GameObjects.Graphics;
  private btn: Phaser.GameObjects.Graphics;

  // event
  private emitter: Phaser.Events.EventEmitter;

  constructor() {
    super({
      key: "GameEndScene",
    });
  }

  init(data: any): void {
    this.gameWidth = data.width;
    this.gameHeight = data.height;
    this.emitter = data.emitter;
  }

  create(): void {
    this.modal = this.add
      .rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 0.95)
      .setOrigin(0);
    const menuWidth = this.gameWidth * 0.8;
    const menuHeight = this.gameHeight * 0.45;
    const menuPosX = this.gameWidth / 2 - menuWidth / 2;
    const offsetShadow = menuWidth * 0.015;

    const radius = menuHeight / 5;
    const STAR_SCALE = 0.25;
    const circleCenterY = radius * 1.2;
    const menuPosY = radius * 2.5;

    this.menu = new Menu(
      this,
      menuPosX,
      menuPosY,
      menuWidth,
      menuHeight,
      offsetShadow
    );

    let menssage = "Resumo do jogo";
    let displayText = this.add.text(0, 0, menssage, {
      fontFamily: "Arial",
      fontSize: 32,
      color: "#ffffff",
      align: "center",
    });

    this.EUCircle(circleCenterY, radius, displayText, STAR_SCALE);

    this.answerInfo(this.gameWidth / 2, menuPosY, 0.4);

    // this.backBtn(menuPosY, menuWidth, menuHeight);

    const reload = () => {
      window.location.reload();
    };
    const playAgainBtn = this.button(
      this.gameWidth / 2,
      menuHeight * 1.5,
      "Jogar novamente",
      32,
      40,
      reload
    );
  }

  private answerInfo(centerX: number, posY: number, scale: number): void {
    const wrong = this.add.image(centerX, posY, "wrong");
    const right = this.add.image(centerX, posY, "correct");
    const centerOffsetX = right.width * scale * 1.5;
    const centerOffsetY = right.height * scale + posY;
    wrong.setScale(scale).setPosition(centerX - centerOffsetX, centerOffsetY);
    right.setScale(scale).setPosition(centerX + centerOffsetX, centerOffsetY);

    const wrongInfo = new DisplayText(
      this,
      centerX - centerOffsetX,
      wrong.getBounds().bottom + wrong.getBounds().height * 1.2,
      "3",
      wrong.width,
      82,
      "#ffffff"
    );
    const rightInfo = new DisplayText(
      this,
      centerX + centerOffsetX,
      wrong.getBounds().bottom + wrong.getBounds().height * 1.2,
      "3",
      wrong.width,
      82,
      "#ffffff"
    );

    const emitEvent = () => {
      this.emitter.emit("reviewGame");
      this.scene.stop("GameEndScene");
    };
    const reviewBtn = this.button(
      this.gameWidth / 2,
      rightInfo.getText().getBounds().bottom +
        rightInfo.getText().getBounds().height,
      "Rever respostas dadas",
      32,
      20,
      emitEvent
    );
  }

  private button(
    posX: number,
    posY: number,
    text: string,
    size: number,
    margin: number,
    func: any
  ): void {
    this.btn = this.add.graphics();
    this.btn.fillStyle(0xffcc00, 1);
    const textObj = new DisplayText(
      this,
      posX,
      posY,
      text,
      1000,
      size,
      "#0000aa"
    );

    const textBounds = textObj.getText().getBounds();
    const btnPosX = textBounds.left - margin;
    const btnPosY = textBounds.top - margin;
    const btnWidth = textBounds.width + 2 * margin;
    const btnHeight = textBounds.height + 2 * margin;
    this.btn.fillRoundedRect(btnPosX, btnPosY, btnWidth, btnHeight, margin);

    const shape = new Phaser.Geom.Rectangle(
      btnPosX,
      btnPosY,
      btnWidth,
      btnHeight
    );
    this.btn.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
    this.btn.on("pointerdown", func);
  }

  private EUCircle(
    centerY: number,
    radius: number,
    displayText: Phaser.GameObjects.Text,
    scale: number
  ): void {
    var circle = new Phaser.Geom.Circle(this.gameWidth / 2, centerY, radius);
    displayText.setPosition(this.gameWidth / 2, centerY).setOrigin(0.5);

    var points = circle.getPoints(12);
    let j = 0;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      if (j > points.length - 2) {
        j = 0;
      } else {
        j++;
      }

      let image = this.add
        .image(p.x, p.y, "star")
        .setScale(0.1)
        .setTint(0xffcc00);

      // this.tweens.add({
      //   targets: image,
      //   ease: "Sine.easeInOut",
      //   duration: 1000,
      //   repeat: -1,

      //   x: points[j].x,
      //   y: points[j].y,
      // });

      this.tweens.add({
        targets: image,
        scaleX: scale / 2,
        scaleY: scale / 1.8,
        ease: "Sine.easeInOut",
        duration: 1000,
        repeat: -1,
        yoyo: true,
      });
    }
  }
}
