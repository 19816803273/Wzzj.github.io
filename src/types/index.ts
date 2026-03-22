export type Subject = '高数' | '线代' | '概率论';
export type Chapter = '极限' | '导数' | '积分' | '行列式' | '矩阵' | '随机变量' | '概率分布' | '其他';
export type QuestionType = '选择' | '填空' | '解答';
export type ErrorType = '概念混淆' | '计算失误' | '思路断层' | '其他';
export type MasteryLevel = '未掌握' | '部分掌握' | '已掌握';
export type Source = '真题' | '习题册' | '模拟卷' | '其他';
export type Difficulty = '简单' | '中等' | '困难';

export interface WrongQuestion {
  id: string;
  content: string;
  imageUrl?: string;
  wrongAnswer: string;
  source: Source;
  difficulty: Difficulty;
  date: string;
  subject: Subject;
  chapter: Chapter;
  questionType: QuestionType;
  errorType: ErrorType;
  masteryLevel: MasteryLevel;
  tags: string[];
  analysis: {
    core考点: string;
    formulas: string[];
    solutionSteps: string[];
    techniques: string[];
    pitfalls: string[];
  };
  errorAnalysis: {
    rootCause: string;
    suggestion: string;
  };
  correctSolution: string;
  notes?: string;
  reviewCount: number;
  lastReviewDate?: string;
}

export interface StudyTopic {
  id: string;
  name: string;
  subject: Subject;
  chapter: Chapter;
  errorType: ErrorType;
  questions: string[];
  confusedConcepts: {
    concept1: string;
    concept2: string;
    difference: string;
  }[];
  solutionTemplate: string[];
  practiceQuestions: {
    question: string;
    answer: string;
    explanation: string;
  }[];
}

export interface Statistics {
  totalQuestions: number;
  subjectDistribution: Record<Subject, number>;
  chapterDistribution: Record<Chapter, number>;
  masteryDistribution: Record<MasteryLevel, number>;
  weakPoints: { name: string; count: number }[];
  reviewProgress: number;
}
