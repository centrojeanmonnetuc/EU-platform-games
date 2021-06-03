import { CONST } from "../const/const";
import { Card } from "../objects/card";
import { TopBar } from "../objects/top-bar";
import { Grid } from "../objects/grid";
import { CardFlipInfo } from "../interfaces/utils.interface";
import { shuffle } from "../utils/shuffleArray";
import { Background } from "../objects/background";
import { Clock } from "../objects/clock";

export class GameScene extends Phaser.Scene {
  // field and game setting
  private gameHeight: number;
  private gameWidth: number;
  private gameId: string;
  private prefix: string;

  // objects
  private topBar: TopBar;
  private card: Card;
  private grid: Grid;
  private cards: Card[] = [];

  // database params
  private totalCards: number;
  private numCardsHorizontal: number;
  private numCardsVertical: number;
  private destroyCard: boolean;
  private timeCardIsVisible: number;
  private imagesArr: string[];
  private timer: boolean;
  private timeToComplete: number;
  private maxAttempts: number;
  private backCardId: string;

  // game flow
  private flippedCardsIndex: CardFlipInfo[] = [];

  private matches: number = 0;

  private text: Phaser.GameObjects.Text;
  private displayText: string;
  private timedEvent: Phaser.Time.TimerEvent;
  private clock: Clock;

  private freezeGame: boolean = false;

  /**
   * Sounds
   */
  private right_guess: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(data: any): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;

    this.totalCards = data.totalCards;
    this.destroyCard = data.destroyCard;
    this.timeCardIsVisible = data.timeCardIsVisible;
    this.imagesArr = data.imagesArr;
    this.timer = data.timer;
    this.timeToComplete = data.timeToComplete;
    this.maxAttempts = data.maxAttempts;
    this.backCardId = data.backCardId;
    this.gameId = data.gameId;
    this.prefix = data.prefix;

    switch (this.imagesArr.length) {
      case 3:
        this.numCardsHorizontal = 3;
        this.numCardsVertical = 2;
        break;
      case 6:
        this.numCardsHorizontal = 4;
        this.numCardsVertical = 3;
        break;
      case 8:
        this.numCardsHorizontal = 4;
        this.numCardsVertical = 4;
        break;
      case 10:
        this.numCardsHorizontal = 5;
        this.numCardsVertical = 4;
        break;
    }
  }

  create(): void {
    // this.topBar = new TopBar(this, this.gameWidth, this.gameHeight);
    const bg = new Background(this, "bg", this.gameWidth, this.gameHeight);
    bg.setAlpha(0.5);

    this.grid = new Grid(this, this.gameWidth, this.gameHeight);

    // gets the card width and height
    const { width, height } = this.grid.doGridCalculations(
      this.numCardsHorizontal,
      this.numCardsVertical
    );

    const numbersArr: number[] = [];

    this.imagesArr.forEach((image, index) => {
      numbersArr.push(index);
      numbersArr.push(index);
    });

    // shuffle randonmly the array with the references to the cards
    // console.log(shuffle(numbersArr));
    shuffle(numbersArr).forEach((number, index) =>
      this.cards.push(
        new Card(
          this,
          width,
          height,
          number,
          this.imagesArr[number],
          this.backCardId,
          this.timeCardIsVisible / 2
        )
      )
    );

    this.grid.createGrid(this.cards, width, height);
    console.log(this.grid.getGridBounds());
    // center y
    const gridH =
      this.grid.getGridBounds().bottom - this.grid.getGridBounds().top;
    let tcHeight = 2;
    if (this.totalCards === 6) {
      tcHeight = 1.8;
    }
    if (this.totalCards === 8) {
      tcHeight = 1.7;
    }
    if (this.totalCards === 10) {
      tcHeight = 1.8;
    }
    this.grid.setGridPosition(0, this.gameHeight / 2 - gridH / tcHeight);

    // Input
    this.input.on("gameobjectdown", this.cardDown, this);

    // total cards
    CONST.TOTAL = this.imagesArr.length;

    // text
    let updatedText = "";
    if (this.timer) {
      // this.displayText = "Tempo para acabar o jogo\n";
      CONST.TIME = this.timeToComplete;
      updatedText = `${CONST.TIME}`;
      // timer
      this.timedEvent = this.time.delayedCall(
        this.timeToComplete * 1000,
        this.onEventTimeOver,
        [],
        this
      );

      this.clock = new Clock(this, this.gameWidth, this.gameHeight * 0.1);
      this.clock.updateTime(updatedText);
    } else {
      if (this.maxAttempts > 0) {
        this.displayText = "Tentativas restantes para acabar o jogo\n";
        CONST.MAX_ATTEMPTS = this.maxAttempts;
        updatedText = `${this.displayText}${CONST.MAX_ATTEMPTS}`;
      } else {
        this.displayText = "Tentativas\n";
        updatedText = `${this.displayText}${CONST.ATTEMPTS}`;
      }
      // TEXT
      this.text = this.add.text(0, 16, updatedText, {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      });
      this.text.setPosition(
        this.gameWidth / 2 - this.text.width / 2,
        this.text.height / 2
      );
    }

    this.right_guess = this.sound.add("right_guess");
  }

  update(): void {
    if (this.timer && !CONST.GAME_OVER) {
      this.clock.updateTime(
        `${(this.timeToComplete - this.timedEvent.elapsed / 1000).toFixed(0)}`
      );
    }

    if (CONST.GAME_OVER && !this.freezeGame) {
      this.freezeGame = true;
      if (this.timer) {
        this.clock.cancelAnims();
      }
      this.scene.launch("GameEndScene", {
        width: this.gameWidth,
        height: this.gameHeight,
        win: CONST.WIN,
        gameId: this.gameId,
        prefix: this.prefix,
        timer: this.timer ? (this.timedEvent.elapsed / 1000).toFixed(0) : null,
      });
    }
  }
  private onEventTimeOver(): void {
    console.log("time over");
    CONST.GAME_OVER = true;
    CONST.WIN = false;
  }

  private cardDown(pointer: any, gameobject: any, event: any): void {
    // verify if the gameobject is a card
    const cardRef = this.cards.find((elem) => elem.getCard() === gameobject);
    if (
      cardRef &&
      this.flippedCardsIndex.length < 2 &&
      cardRef.getCardIsBack() &&
      !CONST.GAME_OVER
    ) {
      cardRef.flipCard();

      const cardIndex = this.cards.findIndex(
        (elem) => elem.getCard() === gameobject
      );
      const cardImgRef = cardRef.getCardImgRef();
      this.flippedCardsIndex.push({
        index: cardIndex,
        imageRef: cardImgRef,
      });

      // if there are two flipped cards
      if (this.flippedCardsIndex.length === 2) {
        this.time.delayedCall(
          this.timeCardIsVisible * 1.5,
          this.checkPairMatch,
          [],
          this
        );
      }
    }
  }

  private checkPairMatch(): void {
    const fristElem = this.flippedCardsIndex[0];
    const secondElem = this.flippedCardsIndex[1];

    // exists a match
    if (fristElem?.imageRef === secondElem?.imageRef) {
      console.log("match!!");
      // delete cards or let them in the board
      this.flippedCardsIndex.forEach((elem) => {
        if (this.destroyCard) {
          this.cards[elem.index].getCard().setVisible(false);
        } else {
          // disable flip
          this.cards[elem.index].getCard().disableInteractive();
        }
      });
      this.matches++;
      // count matches
      if (this.matches === this.imagesArr.length) {
        CONST.GAME_OVER = true;
        CONST.WIN = true;
      } else {
        this.right_guess.play();
      }
    } else {
      // no match
      console.log("try again");

      // flip the cards
      this.flippedCardsIndex.forEach((elem) => {
        this.cards[elem.index].flipCard();
      });
    }

    if (!this.timer) {
      if (this.maxAttempts > 0) {
        CONST.MAX_ATTEMPTS--;
        this.text.setText(`${this.displayText}${CONST.MAX_ATTEMPTS}`);
        if (CONST.MAX_ATTEMPTS === 0) {
          CONST.GAME_OVER = true;
          CONST.WIN = false;
        }
      } else {
        CONST.ATTEMPTS++;
        this.text.setText(`${this.displayText}${CONST.ATTEMPTS}`);
      }
    }

    // reset array
    this.flippedCardsIndex = [];
  }
}
