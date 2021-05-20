import { Word } from "../interfaces/utils.interface";
import { WordObj } from "./word";

export class Words {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private wordsArr: WordObj[] = [];

  constructor(scene: Phaser.Scene, words: Word[], cell_size: number) {
    this.scene = scene;

    // console.log(this.text);
    console.log(words);
    this.drawWords(words, cell_size);
  }

  private drawWords(words: Word[], cell_size: number) {
    // container with words
    this.container = this.scene.add.container(Math.floor(0), Math.floor(0));
    var word_height_container_counter = 0;

    var grid_words_arr: Word[] = [...words];
    // shuffle the grid words array;
    grid_words_arr = this.shuffleArray(grid_words_arr);

    for (let i = 0; i < grid_words_arr.length; i++) {
      const word = new WordObj(
        this.scene,
        0,
        word_height_container_counter,
        grid_words_arr[i],
        Math.floor(cell_size / 1.8)
      );
      word_height_container_counter += Math.floor(cell_size / 1.4);
      this.container.add(word.getTextObj());

      this.wordsArr.push(word);
    }
  }

  private shuffleArray(array: Word[]): Word[] {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  public setWordsPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  public scribeWord(
    word: string,
    lineWidth: number,
    lineColor: number,
    lineAlpha: number,
    duration: number
  ): void {
    for (const w of this.wordsArr) {
      console.log(w);
      console.log(word);
      if (w.getText() === word) {
        w.scribeWord(duration, lineWidth, lineColor, lineAlpha);
      }
    }
  }
}
