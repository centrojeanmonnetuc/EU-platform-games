import {
  Word,
  ObjectPosition,
  WordsInfo,
  WordGrid,
  DirectionInfo,
} from "../interfaces/utils.interface";

export class Place {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;
  private grid: string[][];
  private wordsInfo: WordsInfo = {
    input: [],
    placed: [],
    not_placed: [],
  };
  private empty_char: string;

  constructor(
    scene: Phaser.Scene,
    num_horizontal_cells: number,
    num_vertical_cells: number,
    words: Word[],
    directions: string[],
    empty_char: string
  ) {
    this.scene = scene;
    this.empty_char = empty_char;

    this.wordSearch(
      words,
      num_horizontal_cells,
      num_vertical_cells,
      directions
    );
  }

  public getGrid(): string[][] {
    return this.grid;
  }

  // WORDSEARCH ALGORTIHM FUNCTIONS
  private wordSearch(
    words: Word[],
    num_hor_cells: number,
    num_ver_cells: number,
    directions: string[]
  ) {
    // sort words_arr by the biggest length
    words.sort(function (a, b) {
      return a.word.length < b.word.length ? 1 : -1;
    });

    this.grid = this.createGrid(num_hor_cells, num_ver_cells);
    this.grid = this.initGrid(
      this.grid,
      num_hor_cells,
      num_ver_cells,
      this.empty_char
    );
    this.printGrid(this.grid, num_hor_cells, num_ver_cells);

    var rnd_direction_pos,
      rnd_direction,
      info_direction,
      rnd_grid_pos,
      grid_pos;

    for (let i = 0; i < words.length; i++) {
      const wordObj = words[i];
      console.log("start putting the word: " + wordObj.word);
      var word_placed = false;

      // array to keep track of the free grid positions that a certain word can occupie
      // in a current time of the words placing
      const grid_free_positions: ObjectPosition[] = this.getGridFreePositions(
        this.grid,
        num_hor_cells,
        num_ver_cells
      );
      // array with the current directions to explore
      var word_poss_directions = [...directions];
      console.log(word_poss_directions);
      while (word_poss_directions.length > 0 && !word_placed) {
        // get random direction
        rnd_direction_pos = this.getRandomProb(word_poss_directions.length);
        rnd_direction = word_poss_directions[rnd_direction_pos];

        // info about the direction
        info_direction = this.wordDirection(rnd_direction);

        // update direction possibilities array
        word_poss_directions = this.removeItemOnce(
          word_poss_directions,
          rnd_direction
        );

        // get the free positions for this word in this direction
        var grid_test_free_positions = [...grid_free_positions];

        // test all possibilites until the word is placed successfully
        while (grid_test_free_positions.length > 0 && !word_placed) {
          // test all possibilites to place the word (in random way)
          rnd_grid_pos = this.getRandomNum(
            0,
            grid_test_free_positions.length - 1
          );
          grid_pos = grid_test_free_positions[rnd_grid_pos];

          // define word position coordinates
          const word_info: WordGrid = {
            wordObj: wordObj,
            start_x: grid_pos.x,
            start_y: grid_pos.y,
            end_x:
              grid_pos.x + info_direction.right * (wordObj.word.length - 1),
            end_y: grid_pos.y + info_direction.down * (wordObj.word.length - 1),
            direction: info_direction,
          };

          // verify if the word is to big for the grid in the given position
          if (this.wordInsideGrid(word_info, num_hor_cells, num_ver_cells)) {
            // verify word colision with others words
            // verify if word is placable
            if (!this.wordColision(this.grid, word_info)) {
              // place the word
              // update the GRID with the current word
              // update the flag
              this.grid = this.placeWord(this.grid, word_info);
              word_placed = true;

              // push word_info to words information array
              this.wordsInfo.placed.push(word_info);
            }
          }
          // update the free position track array
          grid_test_free_positions = this.removeItemOnce(
            grid_test_free_positions,
            grid_pos
          );
        }
      }
      if (!word_placed) {
        // console.log("Didn't put " + word_info.word);
        this.wordsInfo.not_placed.push(wordObj);
      }
    }
    this.printGrid(this.grid, num_hor_cells, num_ver_cells);
  }

  private wordColision(grid: string[][], wordGrid: WordGrid) {
    let flagOverlap = false,
      startX = wordGrid.start_x,
      startY = wordGrid.start_y,
      type = wordGrid.direction.type,
      current_char;

    for (let i = 0; i < wordGrid.wordObj.word.length; i++) {
      if (type == "right") {
        current_char = grid[startY][startX + i];
      } else if (type == "down") {
        current_char = grid[startY + i][startX];
      } else if (type == "right_down") {
        current_char = grid[startY + i][startX + i];
      } else if (type == "left_down") {
        current_char = grid[startY + i][startX - i];
      }
      // check if the grid in this position is empty
      // AND
      // check if can crossword, if the letter that is colliding with the word is present in the other word
      if (
        current_char != this.empty_char &&
        current_char != wordGrid.wordObj.word[i]
      ) {
        flagOverlap = true;
      }
    }
    return flagOverlap;
  }

  private placeWord(grid: string[][], wordGrid: WordGrid) {
    let type = wordGrid.direction.type;
    let startX = wordGrid.start_x;
    let startY = wordGrid.start_y;
    for (let i = 0; i < wordGrid.wordObj.word.length; i++) {
      if (type == "down") {
        grid[startY + i][startX] = wordGrid.wordObj.word[i];
      } else if (type == "right") {
        grid[startY][startX + i] = wordGrid.wordObj.word[i];
      } else if (type == "right_down") {
        grid[startY + i][startX + i] = wordGrid.wordObj.word[i];
      } else if (type == "left_down") {
        grid[startY + i][startX - i] = wordGrid.wordObj.word[i];
      }
    }
    return grid;
  }

  private wordInsideGrid(
    word_info: WordGrid,
    num_horizontal_cells: number,
    num_vertical_cells: number
  ) {
    // case DOWN, RIGHT, RIGHT-DOWN
    if (word_info.end_x >= num_horizontal_cells) return false;
    if (word_info.end_y >= num_vertical_cells) return false;

    // case LEFT-DOWN
    if (word_info.end_x < 0) return false;

    return true;
  }

  private wordDirection(direction: string): DirectionInfo {
    let down = 0,
      right = 0;

    if (direction == "down") {
      down = 1;
    } else if (direction == "right") {
      right = 1;
    } else if (direction == "right_down") {
      right = 1;
      down = 1;
    } else if (direction == "left_down") {
      right = -1;
      down = 1;
    }
    return {
      right: right,
      down: down,
      type: direction,
    };
  }

  private getRandomProb(length: number) {
    var num = Math.random();
    // 4 directions
    if (length == 4) {
      if (num < 0.4) return 0;
      //probability 0.40
      else if (num < 0.8) return 1;
      // probability 0.40
      else if (num < 0.9) return 2;
      //probability 0.10
      else return 3; //probability 0.10
    }
    // 3 directions
    else if (length == 3) {
      if (num < 0.45) return 0;
      //probability 0.45
      else if (num < 0.9) return 1;
      // probability 0.45
      else return 2; //probability 0.10
    }
    // 2 directions
    else if (length == 2) {
      if (num < 0.5) return 0;
      //probability 0.5
      else return 1; //probability 0.5
    } else {
      return 0;
    }
  }

  // private shuffleArray(array) {
  //   for (var i = array.length - 1; i > 0; i--) {
  //     var j = Math.floor(Math.random() * (i + 1));
  //     var temp = array[i];
  //     array[i] = array[j];
  //     array[j] = temp;
  //   }
  //   return array;
  // }

  private removeItemOnce(arr: any[], value: any) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  private getRandomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1)) + min;
  }

  private createGrid(width: number, height: number) {
    var grid = new Array(height);
    for (let i = 0; i < height; ++i) {
      grid[i] = new Array(width);
    }
    return grid;
  }

  private initGrid(
    grid: string[][],
    width: number,
    height: number,
    value: string
  ) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        grid[i][j] = value;
      }
    }
    return grid;
  }

  public printGrid(grid: string[][], width: number, height: number) {
    let str = "";
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        str += grid[i][j] + " ";
      }
      str += "\n";
    }
    console.log("printing word puzzle grid\n\n" + str);
  }

  private getGridFreePositions(
    grid: string[][],
    width: number,
    height: number
  ) {
    let obj_arr: ObjectPosition[] = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (grid[i][j] == this.empty_char) {
          obj_arr.push({ x: j, y: i });
        }
      }
    }
    return obj_arr;
  }
}
