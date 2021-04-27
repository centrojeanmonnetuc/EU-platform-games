import axios from "axios";

export class BootScene extends Phaser.Scene {
  // general vars

  // database params
  private timeToComplete: number | null;
  private piecesSize: number | null;
  private puzzleImage: number | null;

  private gameId: string;

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

    const text_prefix = "http://localhost";
    // const prefix = "";
    const prefix = text_prefix;

    const get_game_str = prefix + "/api/games/game/" + this.gameId;

    await axios
      .get(get_game_str)
      .then((resp) => {
        this.load.audio("select", "assets/sounds/select.mp3");
        this.load.audio("drop_piece", "assets/sounds/drop.mp3");
        this.load.audio("right_place", "assets/sounds/right_place.mp3");
        this.load.audio("complete_puzzle", "assets/sounds/complete.mp3");

        console.log(resp.data);

        const config = resp.data.config;
        this.timeToComplete = config.time_to_complete;
        this.piecesSize = config.pieces_size;

        const assets = resp.data.assets;
        const puzzleImage = assets.images.final_img;
        this.puzzleImage = puzzleImage;

        this.load.on("complete", () => this.createCustom());
        this.load.image(
          puzzleImage.id,
          prefix + puzzleImage.path + puzzleImage.server_path
        );

        // this.load.image("star", "assets/images/star.png");

        this.load.start();
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  createCustom(): void {
    this.scene.start("GameScene", {
      timeToComplete: this.timeToComplete,
      piecesSize: this.piecesSize,
      puzzleImage: this.puzzleImage,
    });
  }
}
