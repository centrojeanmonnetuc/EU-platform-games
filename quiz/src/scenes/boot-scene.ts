import axios from "axios";
import { AnswerObj, QuestionObj } from "../interfaces/utils.interface";

export class BootScene extends Phaser.Scene {
  // general vars
  private gameId: string | null;

  // database params
  private questions: QuestionObj[];
  private timeToRespQuestion: number;
  private timer: boolean | number;

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
        // console.log(resp.data);
        const config = resp.data.config;
        this.questions = config.questions;
        this.timeToRespQuestion = config.time_to_resp_question;
        this.timer = config.timer;

        // const assets = resp.data.assets;

        this.load.on("complete", () => this.createCustom());
        // this.load.image(
        //   back_card_obj.id,
        //   prefix + back_card_obj.path + back_card_obj.server_path
        // );

        this.load.image("bg", "./assets/images/bg_1.png");
        this.load.image("q_marks", "./assets/images/questions_marks.png");
        this.load.image("btn", "./assets/images/btn_1.png");
        this.load.image("btn2", "./assets/images/btn_2.png");
        this.load.image("correct", "./assets/images/correct.png");
        this.load.image("wrong", "./assets/images/wrong.png");
        this.load.image("listening", "./assets/images/listening.png");
        this.load.image("star", "assets/images/star.png");

        this.load.audio("right_answer", "./assets/sounds/right_answer.mp3");
        this.load.audio("wrong_answer", "./assets/sounds/wrong_answer.mp3");

        this.load.atlas(
          "right",
          "./assets/images/spritesheet_right.png",
          "./assets/images/spritesheet_right.json"
        );
        this.load.atlas(
          "wrong",
          "./assets/images/spritesheet_wrong.png",
          "./assets/images/spritesheet_wrong.json"
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
      questions: this.questions,
      timeToRespQuestion: this.timeToRespQuestion,
      timer: this.timer,
    });
  }
}
