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
    this.timer = data.timer;

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
    this.mainEmitter.on("selectedAnswer", this.selectedAnswerHandler, this);

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

    // this.input.on(
    //   "pointerdown",
    //   function (pointer: any) {
    //     console.log(pointer.x, pointer.y);
    //   },
    //   this
    // );

    this.changeQuestionHandler("right");

    // CONST.GAME_OVER = true;
    // this.scene.launch("GameEndScene", {
    //   width: this.gameWidth,
    //   height: this.gameHeight,
    //   emitter: this.mainEmitter,
    // });

    // CONST.USER_ANSWERS.push({ userIndex: 0, rightIndex: 2 });
    // CONST.USER_ANSWERS.push({ userIndex: 1, rightIndex: 0 });
    // CONST.USER_ANSWERS.push({ userIndex: 4, rightIndex: 1 });
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

    // resume scene
    if (CONST.GAME_OVER) {
      if (this.questions[CONST.CURRENT_QUESTION] == null) {
        this.buttons.enableRightBtn(false);
        // launch
        this.scene.launch("GameEndScene", {
          width: this.gameWidth,
          height: this.gameHeight,
          emitter: this.mainEmitter,
        });
        return;
      }
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
      const userAnswerObj = CONST.USER_ANSWERS[currentQuestIndex];
      this.answersContainer.setReviewAnswers(
        userAnswerObj.userIndex,
        userAnswerObj.rightIndex
      );
    } else {
      this.character.deleteCharacter();

      this.buttons.enableLeftButton(false);

      // disable next button (right) if the user was not yet selected a answer
      this.buttons.enableRightBtn(false);

      // enable user input in answers
      this.mainEmitter.on("selectedAnswer", this.selectedAnswerHandler, this);

      // create character
      this.character.createCharacter();
    }
  }

  private selectedAnswerHandler(answerObj: Answer) {
    // disable emitter
    this.mainEmitter.off("selectedAnswer");

    // verify if is the correct answer
    const questionObj = this.questions[CONST.CURRENT_QUESTION];
    const userAnswer = answerObj.getAnswerIndex();
    const userAnswerInfo = questionObj.rightAnswer === userAnswer;
    answerObj.userInputHandler(userAnswerInfo);

    // play character animation
    this.character.playCharacterAppearAnimation();

    // save user answer
    CONST.USER_ANSWERS.push({
      userIndex: userAnswer,
      rightIndex: questionObj.rightAnswer,
    });
  }

  private completedAnimationHandler(): void {
    // resets
    // disable or enable swipe question button
    const rightBtnInfo = this.questions[CONST.CURRENT_QUESTION + 1] == null;
    if (rightBtnInfo) {
      // end game
      this.buttons.enableRightBtn(false);
      this.character.deleteCharacter();
      this.mainEmitter.removeListener("selectedAnswer");
      CONST.GAME_OVER = true;
      this.scene.launch("GameEndScene", {
        width: this.gameWidth,
        height: this.gameHeight,
        emitter: this.mainEmitter,
      });
    } else {
      this.buttons.enableRightBtn(true);
    }
  }
}
