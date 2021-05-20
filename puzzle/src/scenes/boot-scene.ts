import axios from "axios";

export class BootScene extends Phaser.Scene {
  // general vars

  // database params
  private piecesSize: number;
  private puzzleImage: number;

  private timeToComplete: number;
  private timer: boolean;
  private backgroundPuzzleImage: boolean;
  private piecePositionHelper: boolean;
  private movePiecesFreely: boolean;

  private gameId: string | null;

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

    // const prefix = "";
    const prefix = "http://localhost";

    const get_game_str = prefix + "/api/games/game/" + this.gameId;

    await axios
      .get(get_game_str)
      .then((resp) => {
        this.load.audio("select", "assets/sounds/select.mp3");
        this.load.audio("drop_piece", "assets/sounds/drop.mp3");
        this.load.audio("right_place", "assets/sounds/right_place.mp3");
        this.load.audio("complete_puzzle", "assets/sounds/complete.mp3");

        this.load.image("bg", "assets/images/bg.jpg");
        this.load.image("star", "assets/images/star.png");
        this.load.image("hourglass", "assets/images/hourglass.png");

        console.log(resp.data);

        const config = resp.data.config;
        this.piecesSize = config.pieces_size;
        this.movePiecesFreely = config.move_pieces_freely;
        this.piecePositionHelper = config.piece_position_helper;
        this.backgroundPuzzleImage = config.background_puzzle_image;
        this.timer = config.timer;
        this.timeToComplete = config.time_to_complete;

        const assets = resp.data.assets;
        const puzzleImage = assets.puzzle_image;
        this.puzzleImage = puzzleImage;

        this.load.on("complete", () => this.createCustom());
        this.load.image(
          puzzleImage.id,
          prefix + puzzleImage.path + puzzleImage.server_path
        );

        this.load.start();
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  createCustom(): void {
    this.scene.start("GameScene", {
      timer: this.timer,
      timeToComplete: this.timeToComplete,
      piecesSize: this.piecesSize,
      puzzleImage: this.puzzleImage,
      piecePositionHelper: this.piecePositionHelper,
      backgroundPuzzleImage: this.backgroundPuzzleImage,
      movePiecesFreely: this.movePiecesFreely,
    });
  }
}
