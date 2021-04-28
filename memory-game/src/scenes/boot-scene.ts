import axios from "axios";

export class BootScene extends Phaser.Scene {
  // general vars
  private totalCards: number;

  // database params
  private destroyCard: boolean;
  private timeCardIsVisible: number = 800; // - 200ms  -> card turning time 200 ms
  private timeToComplete: number | null;
  private maxAttempts: number | null;
  private gameId: string | null;
  private imagesArr: string[] = [];
  private backCardId: string;

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
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    const prefix = "";
    // const prefix = "http://localhost";

    const get_game_str = prefix + "/api/games/game/" + this.gameId;

    await axios
      .get(get_game_str)
      .then((resp) => {
        console.log(resp.data);
        const config = resp.data.config;
        this.timeToComplete = config.time_to_complete;
        this.maxAttempts = config.max_attempts;
        this.destroyCard = config.destroyCard;
        this.totalCards = config.total_images;

        const assets = resp.data.assets;
        const images = assets.images;
        const back_card_obj = images.back_card;

        this.load.on("complete", () => this.createCustom());
        this.load.image(
          back_card_obj.id,
          prefix + back_card_obj.path + back_card_obj.server_path
        );
        this.backCardId = back_card_obj.id;

        for (let i = 0; i < this.totalCards; i++) {
          let cardObj = assets.images.front_cards[i];
          this.load.image(
            cardObj.id,
            prefix + cardObj.path + cardObj.server_path
          );

          // push ids to arr
          this.imagesArr.push(cardObj.id);
        }

        this.load.image("star", "assets/images/star.png");

        this.load.start();
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  createCustom(): void {
    this.scene.start("GameScene", {
      destroyCard: this.destroyCard,
      timeCardIsVisible: this.timeCardIsVisible,
      timeToComplete: this.timeToComplete,
      maxAttempts: this.maxAttempts,
      imagesArr: this.imagesArr,
      backCardId: this.backCardId,
    });
  }
}
