export interface ObjectSize {
  width: number;
  height: number;
}

export interface ObjectPosition {
  x: number;
  y: number;
}

export interface Directions {
  down: boolean;
  right: boolean;
  right_down: boolean;
  left_down: boolean;
}

export interface Word {
  word: string;
  word_input: string;
}

export interface DirectionInfo {
  right: number;
  down: number;
  type: string;
}

export interface WordGrid {
  wordObj: Word;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  direction: DirectionInfo;
}

export interface WordsInfo {
  input: string[];
  placed: WordGrid[];
  not_placed: Word[];
}

export interface SelectInfo {
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  selected_coors: ObjectPosition[];
}
