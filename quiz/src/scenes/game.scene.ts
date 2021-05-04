import { CONST } from "../const/const";
import { AnswerObj, QuestionObj } from "../interfaces/utils.interface";
import { ObjectPosition, UserAnswers } from "../interfaces/utils.interface";

import { Background } from "../objects/background";
import { Question } from "../objects/question";
import { Answers } from "../objects/answers";
import { Buttons } from "../objects/buttons";
import { Answer } from "../objects/answer";
import { Character } from "../objects/character";
import { QuestionNumber } from "../objects/question-number";
import { Clock } from "../objects/clock";

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
  private questionNum: QuestionNumber;
  // clock
  private clock: Clock;
  private timedEvent: Phaser.Time.TimerEvent;
  private currentTime: string;
  private resetingClock: boolean;

  // emitters
  private mainEmitter: Phaser.Events.EventEmitter;

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

    console.log(data);
  }

  create(): void {
    CONST.CURRENT_QUESTION = -1;
    this.mainEmitter = new Phaser.Events.EventEmitter();
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
     * Question numerator
     */
    this.questionNum = new QuestionNumber(
      this,
      this.gameWidth,
      50,
      this.questions.length
    );

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
      this.gameHeight * this.aContainerH,
      this.mainEmitter
    );

    /**
     * Buttons
     */
    const btnPosY = this.gameHeight - this.gameHeight * this.aContainerH;
    const btnLeftPosX = questContainerBounds.centerX - questContainerWidth / 2;
    const btnRightPosX = questContainerBounds.centerX + questContainerWidth / 2;
    const btnLeft: ObjectPosition = { x: btnLeftPosX, y: btnPosY };
    const btnRight: ObjectPosition = { x: btnRightPosX, y: btnPosY };

    this.buttons = new Buttons(
      this,
      "btn2",
      btnLeft,
      btnRight,
      this.mainEmitter
    );
    this.mainEmitter.on("changeQuestion", this.changeQuestionHandler, this);

    /**
     * Animation
     */
    this.character = new Character(
      this,
      questContainerBounds.centerX - questContainerWidth / 2,
      questContainerBounds.centerX + questContainerWidth / 2,
      questContainerBounds.centerY,
      this.gameWidth,
      this.questionContainer,
      this.questions,
      this.mainEmitter
    );
    this.mainEmitter.on(
      "completedAnimation",
      this.completedAnimationHandler,
      this
    );
    this.mainEmitter.on("reviewGame", this.reviewGameHandler, this);

    /**
     * Clock
     */
    this.clock = new Clock(this, this.gameWidth / 2, 150, 100, 100);

    this.changeQuestionHandler("right");

    // this.input.on(
    //   "pointerdown",
    //   function (pointer: any) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );
  }
  update(): void {
    if (this.timeToRespQuestion && !this.resetingClock && !CONST.GAME_OVER) {
      this.currentTime = (
        this.timeToRespQuestion -
        this.timedEvent.elapsed / 1000
      ).toFixed(0);
      this.clock.updateTime(`${this.currentTime}`);
    }
  }
  private onEventTimeOver(): void {
    console.log("time to respond question over");

    // this.clock.cancelAnims();

    this.mainEmitter.emit("selectedAnswer", null, false);
  }

  private reviewGameHandler(): void {
    // start from beging
    CONST.CURRENT_QUESTION = -1;
    this.changeQuestionHandler("right");
  }

  private changeQuestionHandler(type: string) {
    if (type === "left") {
      CONST.CURRENT_QUESTION--;
    } else if (type === "right") {
      CONST.CURRENT_QUESTION++;
    }
    // set question number text
    this.questionNum.setCurrentQuestion(CONST.CURRENT_QUESTION);

    // resume scene
    if (this.questions[CONST.CURRENT_QUESTION] == null) {
      if (!CONST.GAME_OVER) {
        // resets
        this.character.deleteCharacter();
        this.mainEmitter.removeListener("selectedAnswer");
        CONST.GAME_OVER = true;
      }
      this.buttons.enableRightBtn(false);
      // launch
      this.scene.launch("GameEndScene", {
        width: this.gameWidth,
        height: this.gameHeight,
        emitter: this.mainEmitter,
      });
      return;
    }

    // Update clock
    if (this.timeToRespQuestion && !CONST.GAME_OVER) {
      // flag that enable the update
      this.resetingClock = false;
      // timer
      this.timedEvent = this.time.delayedCall(
        this.timeToRespQuestion * 1000,
        this.onEventTimeOver,
        [],
        this
      );
      this.clock.updateTime(`${this.timeToRespQuestion}`);
    }

    // set new question and answers
    var quest = this.questions[CONST.CURRENT_QUESTION].question;
    this.questionContainer.setQuestionText(quest);
    var answers: string[] = [];
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer1);
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer2);
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer3);
    answers.push(this.questions[CONST.CURRENT_QUESTION].answers.answer4);
    this.answersContainer.setAnswers(answers);

    if (CONST.GAME_OVER) {
      // set buttons
      const leftInfo = this.questions[CONST.CURRENT_QUESTION - 1] == null;
      if (leftInfo) {
        this.buttons.enableLeftButton(false);
      } else {
        this.buttons.enableLeftButton(true);
      }
      const rightInfo = this.questions[CONST.CURRENT_QUESTION + 1] == null;
      if (rightInfo) {
        // where we do nothing, need active to load the resume scene
      } else {
        this.buttons.enableRightBtn(true);
      }
      // set answers
      const currentQuestIndex = CONST.CURRENT_QUESTION;
      const userAnswerObj: UserAnswers = CONST.USER_ANSWERS[currentQuestIndex];
      this.answersContainer.setReviewAnswers({
        userIndex: userAnswerObj.userIndex,
        rightIndex: userAnswerObj.rightIndex,
      });

      if (this.timeToRespQuestion) {
        // set time
        this.clock.updateTime(CONST.USER_TIMES[currentQuestIndex]);
      }
    } else {
      this.character.deleteCharacter();

      this.buttons.enableLeftButton(false);

      this.mainEmitter.on("selectedAnswer", this.selectedAnswerHandler, this);

      // disable next button (right) if the user was not yet selected a answer
      this.buttons.enableRightBtn(false);

      // create character
      this.character.createCharacter();
    }
  }

  private selectedAnswerHandler(answerObj: Answer, responded: boolean) {
    // disable emitter
    this.mainEmitter.removeListener("selectedAnswer");

    console.log(responded);

    // disable time
    if (this.timeToRespQuestion) {
      // STOP CLOCK
      this.timedEvent.remove();
      // flag that disables the update
      this.resetingClock = true;
      // save time
      CONST.USER_TIMES.push(this.currentTime);
    }

    // verify if is the correct answer
    const questionObj = this.questions[CONST.CURRENT_QUESTION];
    let userAnswer = -1;
    if (responded) {
      userAnswer = answerObj.getAnswerIndex();
      const userAnswerInfo = questionObj.rightAnswer === userAnswer;
      answerObj.userInputHandler(userAnswerInfo);
    } else {
      this.answersContainer.revealRightAnswer(questionObj.rightAnswer);
    }

    // play character animation
    this.character.playCharacterAppearAnimation();

    // save user answer
    const newAnswer: UserAnswers = {
      userIndex: userAnswer,
      rightIndex: questionObj.rightAnswer,
    };
    CONST.USER_ANSWERS.push(newAnswer);
  }

  private completedAnimationHandler(): void {
    this.buttons.enableRightBtn(true);
  }
}
