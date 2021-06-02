export interface ObjectSize {
  width: number;
  height: number;
}

export interface QuestionObj {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  right_answer: number;
  justification: string;
}

export interface ObjectPosition {
  x: number;
  y: number;
}

export interface UserAnswers {
  userIndex: number;
  rightIndex: number;
}

export interface UserRightWrongAnswers {
  right: number;
  wrong: number;
}
