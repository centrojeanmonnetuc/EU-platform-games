import axios from "axios";

export class BootScene extends Phaser.Scene {
  // general vars
  private totalCards: number;

  // database params
  private destroyCard: boolean;
  private timeCardIsVisible: number; // - 200ms  -> card turning time 200 ms
  private timer: number;
  private timeToComplete: number;
  private maxAttempts: number;
  private gameId: string | null;
  private imagesArr: string[] = [];
  private backCardId: string;
  private totalImagesArr: number[] = [3, 6, 8, 10];

  // private prefix: string = "http://localhost";
  private prefix: string = "";

  constructor() {
    super({
      key: "BootScene",
    });
  }

  init(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.gameId = urlParams.get("id");
  }

  async preload(): Promise<void> {
    // send info to the server that the game was initialized
    axios({
      method: "post",
      url: this.prefix + "/api/games/statistics-game-opened",
      data: {
        gameId: this.gameId,
      },
    });

    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    const get_game_str = this.prefix + "/api/games/game/" + this.gameId;

    const turn_speed_arr = [600, 500, 400, 200];

    await axios
      .get(get_game_str)
      .then((resp) => {
        console.log(resp.data);
        const config = resp.data.config;
        this.timer = config.timer;
        this.timeToComplete = config.time_to_complete;
        this.maxAttempts = config.max_attempts;
        this.destroyCard = config.destroy_card;
        this.totalCards = this.totalImagesArr[config.total_images];
        this.timeCardIsVisible = turn_speed_arr[config.turn_speed];

        const assets = resp.data.assets;
        const back_card_obj = assets.back_card;

        this.load.on("complete", () => this.createCustom());
        this.load.image(
          back_card_obj.id,
          this.prefix + back_card_obj.path + back_card_obj.server_path
        );
        this.backCardId = back_card_obj.id;

        for (let i = 0; i < this.totalCards; i++) {
          const cardObj = assets.front_cards[i].pair;
          this.load.image(
            cardObj.id,
            this.prefix + cardObj.path + cardObj.server_path
          );

          // push ids to arr
          this.imagesArr.push(cardObj.id);
        }

        this.load.image("bg", "assets/images/bg2.jpg");
        this.load.image("hourglass", "assets/images/hourglass.png");
        this.load.image("star", "assets/images/star.png");

        this.load.audio("right_guess", "./assets/sounds/right_guess.mp3");
        this.load.audio("finish_game", "./assets/sounds/finish_game.mp3");
        this.load.audio("game_over", "./assets/sounds/game_over.mp3");

        this.load.start();
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  createCustom(): void {
    this.scene.start("GameScene", {
      totalCards: this.totalCards,
      destroyCard: this.destroyCard,
      timeCardIsVisible: this.timeCardIsVisible,
      timer: this.timer,
      timeToComplete: this.timeToComplete,
      maxAttempts: this.maxAttempts,
      imagesArr: this.imagesArr,
      backCardId: this.backCardId,
      prefix: this.prefix,
      gameId: this.gameId,
    });
  }
}
