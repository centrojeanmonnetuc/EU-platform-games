import { CONST } from "../const/const";
import { AnswerObj, QuestionObj } from "../interfaces/utils.interface";
import { ObjectPosition } from "../interfaces/utils.interface";

import { Background } from "../objects/background";
import { Question } from "../objects/question";
import { Answers } from "../objects/answers";
import { Buttons } from "../objects/buttons";
import { Answer } from "../objects/answer";
import { Character } from "../objects/character";

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
  private character: Character;

  // emitters
  private questionsEmitter: Phaser.Events.EventEmitter;
  private answerEmitter: Phaser.Events.EventEmitter;

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
    this.questionContainer.center(this.gameWidth);

    /**
     * Answers
     */
    this.answerEmitter = new Phaser.Events.EventEmitter();
    const questContainerBounds = this.questionContainer
      .getQuestContainer()
      .getBounds();
    this.answersContainer = new Answers(
      this,
      4,
      questContainerBounds.centerX,
      questContainerBounds.centerY + questContainerHeight,
      this.gameWidth * this.containerW,
      this.gameHeight * this.aContainerH,
      this.answerEmitter
    );
    this.answerEmitter.on("selectedAnswer", this.selectedAnswerHandler, this);

    /**
     * Buttons
     */
    const btnPosY = this.gameHeight - this.gameHeight * this.aContainerH;
    const btnLeftPosX = questContainerBounds.centerX - questContainerWidth / 2;
    const btnRightPosX = questContainerBounds.centerX + questContainerWidth / 2;
    const btnLeft: ObjectPosition = { x: btnLeftPosX, y: btnPosY };
    const btnRight: ObjectPosition = { x: btnRightPosX, y: btnPosY };

    this.questionsEmitter = new Phaser.Events.EventEmitter();
    this.buttons = new Buttons(
      this,
      "btn2",
      btnLeft,
      btnRight,
      this.questionsEmitter
    );
    this.questionsEmitter.on(
      "changeQuestion",
      this.changeQuestionHandler,
      this
    );

    /**
     * Animation
     */
    this.character = new Character(
      this,
      questContainerBounds.centerX - questContainerWidth / 2,
      questContainerBounds.centerX + questContainerWidth / 2,
      questContainerBounds.centerY,
      this.gameWidth,
      this.questionContainer
    );

    // this.input.on(
    //   "pointerdown",
    //   function (pointer: any) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );

    this.changeQuestionHandler("right");
  }

  private selectedAnswerHandler(answerObj: Answer) {
    // disable emitter
    this.answerEmitter.off("selectedAnswer");

    // verify if is the correct answer
    const questionObj = this.questions[CONST.CURRENT_QUESTION];
    const userAnswerInfo =
      questionObj.rightAnswer === answerObj.getAnswerIndex();
    answerObj.userInputHandler(userAnswerInfo);

    // set justification
    this.questionContainer.setQuestionText(questionObj.justification);
  }

  private changeQuestionHandler(type: string) {
    // disable emitter
    this.questionsEmitter.off("changeQuestion");

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