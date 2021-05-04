export interface ObjectSize {
  width: number;
  height: number;
}

export interface AnswerObj {
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

export interface QuestionObj {
  question: string;
  answers: AnswerObj[];
  rightAnswer: number;
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
