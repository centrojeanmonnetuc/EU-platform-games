import { Menu } from "../objects/menu";
import axios from "axios";

export class GameEndScene extends Phaser.Scene {
  private gameHeight: number;
  private gameWidth: number;
  private win: boolean;
  private gameId: string;
  private prefix: string;
  private timer: number;

  private modal: Phaser.GameObjects.Rectangle;
  private menu: Menu;
  private circle: Phaser.GameObjects.Graphics;
  private btn: Phaser.GameObjects.Graphics;

  private finish_game: Phaser.Sound.BaseSound;
  private game_over: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "GameEndScene",
    });
  }

  init(data: any): void {
    this.gameWidth = data.width;
    this.gameHeight = data.height;
    this.win = data.win;
    this.gameId = data.gameId;
    this.prefix = data.prefix;
    this.timer = data.timer;
  }

  create(): void {
    this.modal = this.add
      .rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 0.6)
      .setOrigin(0);

    const menuWidth = this.gameWidth * 0.5;
    const menuHeight = this.gameHeight * 0.5;
    const menuPosX = this.gameWidth / 2 - menuWidth / 2;
    const menuPosY = this.gameHeight / 2 - menuHeight / 2;
    const offsetShadow = menuWidth * 0.015;

    this.menu = new Menu(
      this,
      menuPosX,
      menuPosY,
      menuWidth,
      menuHeight,
      offsetShadow
    );

    let menssage = "";
    if (this.win) {
      menssage = "Parabéns, ganhaste!";
    } else {
      menssage = "Não conseguiste, tenta outra vez!";
    }
    let displayText = this.add.text(0, 0, menssage, {
      fontFamily: "Arial",
      fontSize: 32,
      color: "#ffffff",
      align: "center",
    });

    displayText
      .setPosition(this.gameWidth / 2, menuPosY + displayText.height * 2)
      .setOrigin(0.5);

    const STAR_SCALE = 0.25;
    var circle = new Phaser.Geom.Circle(
      this.gameWidth / 2,
      menuPosY + menuHeight / 2.2,
      (menuHeight - menuPosY) / 2.1
    );

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
        scaleX: STAR_SCALE / 1.6,
        scaleY: STAR_SCALE / 1.6,
        ease: "Sine.easeInOut",
        duration: 1000,
        repeat: -1,
        yoyo: true,
      });
    }

    this.btn = this.add.graphics();

    this.btn.fillStyle(0xffff00, 1);

    const btnWidth = menuWidth / 2;
    const btnHeight = menuHeight / 8;
    const btnPosX = this.gameWidth / 2 - menuWidth / 4;
    const btnPosY = menuPosY + menuHeight * 0.8;

    //  32px radius on the corners
    this.btn.fillRoundedRect(btnPosX, btnPosY, btnWidth, btnHeight, 24);

    let backText = this.add.text(0, 0, "Jogar novamente", {
      fontFamily: "Arial",
      fontSize: 32,
      color: "#0000aa",
      align: "center",
    });

    backText
      .setPosition(this.gameWidth / 2, btnPosY + displayText.height)
      .setOrigin(0.5);

    var shape = new Phaser.Geom.Rectangle(
      btnPosX,
      btnPosY,
      btnWidth,
      btnHeight
    );
    this.btn.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
    this.btn.on("pointerdown", () => {
      window.location.reload();
    });

    this.finish_game = this.sound.add("finish_game");
    this.game_over = this.sound.add("game_over");
    if (this.win) {
      this.finish_game.play();
    } else {
      this.game_over.play();
    }

    // send info to the server that the game was initialized
    axios({
      method: "post",
      url: this.prefix + "/api/games/statistics-game-finished",
      data: {
        gameId: this.gameId,
        win: this.win,
        timer: this.timer,
      },
    });
  }
}
