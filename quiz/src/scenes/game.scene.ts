import { CONST } from "../const/const";
import { AnswerObj, QuestionObj } from "../interfaces/utils.interface";
import { ObjectPosition } from "../interfaces/utils.interface";

import { Background } from "../objects/background";
import { Question } from "../objects/question";
import { Answers } from "../objects/answers";
import { Buttons } from "../objects/buttons";

export class GameScene extends Phaser.Scene {
  // field and game setting
  private gameHeight: number;
  private gameWidth: number;

  // configs
  private containerW = 0.7;
  private qContainerH = 0.22;
  private aContainerH = 0.08;

  // database params
  private questions: QuestionObj[];
  private timeToRespQuestion: number;
  private timer: boolean | number;

  //objects
  private questionContainer: Question;
  private answersContainer: Answers;
  private buttons: Buttons;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(data: any): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;

    this.questions = data.questions;
    this.timeToRespQuestion = data.timeToRespQuestion;
    this.timer = data.timer;

    console.log(data);
  }

  create(): void {
    CONST.CURRENT_QUESTION = -1;
    new Background(this, "bg", this.gameWidth, this.gameHeight);

    /**
     * Question
     */
    const questContainerWidth = this.gameWidth * this.containerW;
    const questContainerHeight = this.gameHeight * this.qContainerH;
    this.questionContainer = new Question(
      this,
      questContainerWidth,
      questContainerHeight
    );
    this.questionContainer.center(this.gameWidth, this.gameHeight);

    /**
     * Answers
     */
    const questContainerBounds = this.questionContainer
      .getQuestContainer()
      .getBounds();
    this.answersContainer = new Answers(
      this,
      4,
      questContainerBounds.centerX,
      questContainerBounds.centerY + questContainerHeight,
      this.gameWidth * this.containerW,
      this.gameHeight * this.aContainerH
    );
    const btnPosY = this.gameHeight - this.gameHeight * this.aContainerH;
    const btnLeftPosX = questContainerBounds.centerX - questContainerWidth / 2;
    const btnRightPosX = questContainerBounds.centerX + questContainerWidth / 2;
    const btnLeft: ObjectPosition = { x: btnLeftPosX, y: btnPosY };
    const btnRight: ObjectPosition = { x: btnRightPosX, y: btnPosY };

    /**
     * Buttons
     */
    const questionsEmitter = new Phaser.Events.EventEmitter();
    this.buttons = new Buttons(
      this,
      "btn2",
      btnLeft,
      btnRight,
      questionsEmitter
    );
    questionsEmitter.on("changeQuestion", this.changeQuestionHandler, this);

    // this.input.on(
    //   "pointerdown",
    //   function (pointer: any) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );

    this.changeQuestionHandler("right");
  }

  private changeQuestionHandler(type: string) {
    if (type === "left") {
      CONST.CURRENT_QUESTION--;
    } else if (type === "right") {
      CONST.CURRENT_QUESTION++;
    }
    var quest = this.questions[CONST.CURRENT_QUESTION].question;

    this.questionContainer.setQuestionText(quest);

    var answers: string[] = [];
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer1);
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer2);
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer3);
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer4);

    this.answersContainer.setAnswers(answers);
  }
}
