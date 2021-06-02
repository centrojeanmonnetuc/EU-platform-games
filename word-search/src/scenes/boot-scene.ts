import axios from "axios";
import { Directions, Word } from "../interfaces/utils.interface";

export class BootScene extends Phaser.Scene {
  // general vars
  private gameId: string | null;

  // database params
  private num_horizontal_cells: number;
  private num_vertical_cells: number;
  private words: Word[];
  private directions: Directions;
  private timer: boolean;
  private time_to_complete: number;

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

        this.num_horizontal_cells = config.num_horizontal_cells;
        this.num_vertical_cells = config.num_vertical_cells;
        this.words = config.words;
        this.directions = config.directions;
        this.timer = config.timer;
        this.time_to_complete = config.time_to_complete;

        this.load.on("complete", () => this.createCustom());
        // this.load.image(
        //   back_card_obj.id,
        //   prefix + back_card_obj.path + back_card_obj.server_path
        // );

        this.load.image("bg", "./assets/images/bg.jpg");
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
      num_horizontal_cells: this.num_horizontal_cells,
      num_vertical_cells: this.num_vertical_cells,
      words: this.words,
      directions: this.directions,
      timer: this.timer,
      time_to_complete: this.time_to_complete,
    });
  }
}
