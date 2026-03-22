import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WrongQuestion, StudyTopic, Statistics } from '../types';

interface AppContextType {
  questions: WrongQuestion[];
  topics: StudyTopic[];
  statistics: Statistics;
  addQuestion: (question: Omit<WrongQuestion>) => void;
  updateQuestion: (id: string, question: Partial<WrongQuestion>) => void;
  deleteQuestion: (id: string) => void;
  generateTopics: () => void;
  updateStatistics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleQuestions: WrongQuestion[] = [
  {
    id: '1',
    content: '求极限：lim(x→0) (sinx - x)/x³',
    wrongAnswer: '0',
    source: '真题',
    difficulty: '中等',
    date: '2026-03-20',
    subject: '高数',
    chapter: '极限',
    questionType: '解答',
    errorType: '计算失误',
    masteryLevel: '未掌握',
    tags: ['极限', '泰勒公式', '等价无穷小'],
    analysis: {
      core考点: '泰勒展开式的应用',
      formulas: ['sinx = x - x³/6 + o(x³)', 'lim(x→0) o(x³)/x³ = 0'],
      solutionSteps: [
        '写出sinx的泰勒展开式',
        '代入原式化简',
        '计算极限',
      ],
      techniques: ['遇到三角函数极限优先考虑泰勒展开', '注意高阶无穷小的处理'],
      pitfalls: ['不要直接使用等价无穷小替换sinx - x', '注意泰勒展开的阶数要足够'],
    },
    errorAnalysis: {
      rootCause: '忘记了sinx的泰勒展开式，错误地使用了等价无穷小替换',
      suggestion: '牢记常用函数的泰勒展开式，特别是sinx、cosx、e^x等',
    },
    correctSolution: 'lim(x→0) (sinx - x)/x³ = lim(x→0) (-x³/6)/x³ = -1/6',
    notes: '复习泰勒展开式',
    reviewCount: 1,
    lastReviewDate: '2026-03-20',
  },
  {
    id: '2',
    content: '计算行列式：|1 2 3; 4 5 6; 7 8 9|',
    wrongAnswer: '0',
    source: '习题册',
    difficulty: '简单',
    date: '2026-03-19',
    subject: '线代',
    chapter: '行列式',
    questionType: '填空',
    errorType: '概念混淆',
    masteryLevel: '部分掌握',
    tags: ['行列式计算', '行变换'],
    analysis: {
      core考点: '行列式的行变换性质',
      formulas: ['行列式两行成比例则值为0'],
      solutionSteps: [
        '观察行列式的行之间的关系',
        '发现第二行减第一行等于第三行减第二行',
        '得出行列式值为0',
      ],
      techniques: ['先观察行列式的特殊结构再计算', '利用行变换简化计算'],
      pitfalls: ['不要盲目展开计算', '注意行变换的性质'],
    },
    errorAnalysis: {
      rootCause: '没有观察出行列式的行成比例关系，盲目计算',
      suggestion: '计算行列式前先观察是否有特殊结构',
    },
    correctSolution: '0',
    notes: '注意观察行列式结构',
    reviewCount: 2,
    lastReviewDate: '2026-03-21',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<WrongQuestion[]>(() => {
    const saved = localStorage.getItem('mathNotebook_questions');
    return saved ? JSON.parse(saved) : sampleQuestions;
  });

  const [topics, setTopics] = useState<StudyTopic[]>(() => {
    const saved = localStorage.getItem('mathNotebook_topics');
    return saved ? JSON.parse(saved) : [];
  });

  const [statistics, setStatistics] = useState<Statistics>({
    totalQuestions: 0,
    subjectDistribution: { '高数': 0, '线代': 0, '概率论': 0 },
    chapterDistribution: { '极限': 0, '导数': 0, '积分': 0, '行列式': 0, '矩阵': 0, '随机变量': 0, '概率分布': 0, '其他': 0 },
    masteryDistribution: { '未掌握': 0, '部分掌握': 0, '已掌握': 0 },
    weakPoints: [],
    reviewProgress: 0,
  });

  useEffect(() => {
    localStorage.setItem('mathNotebook_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('mathNotebook_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    updateStatistics();
  }, [questions]);

  const addQuestion = (question: Omit<WrongQuestion, 'id'>) => {
    const newQuestion: WrongQuestion = {
      ...question,
      id: Date.now().toString(),
    };
    setQuestions([newQuestion, ...questions]);
  };

  const updateQuestion = (id: string, updates: Partial<WrongQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const generateTopics = () => {
    const newTopics: StudyTopic[] = [];
    
    const chapterGroups: Record<string, WrongQuestion[]> = {};
    questions.forEach(q => {
      const key = `${q.subject}-${q.chapter}-${q.errorType}`;
      if (!chapterGroups[key]) chapterGroups[key] = [];
      chapterGroups[key].push(q);
    });

    Object.entries(chapterGroups).forEach(([key, groupQuestions]) => {
      if (groupQuestions.length >= 2) {
        newTopics.push({
          id: key,
          name: `${groupQuestions[0].chapter} - ${groupQuestions[0].errorType}专项`,
          subject: groupQuestions[0].subject,
          chapter: groupQuestions[0].chapter,
          errorType: groupQuestions[0].errorType,
          questions: groupQuestions.map(q => q.id),
          confusedConcepts: [],
          solutionTemplate: ['分析题目条件', '回忆相关知识点', '制定解题策略', '执行计算', '检查验证'],
          practiceQuestions: [
            { question: '练习题目1', answer: '答案1', explanation: '解析1' },
            { question: '练习题目2', answer: '答案2', explanation: '解析2' },
            { question: '练习题目3', answer: '答案3', explanation: '解析3' },
          ],
        });
      }
    });

    setTopics(newTopics);
  };

  const updateStatistics = () => {
    const stats: Statistics = {
      totalQuestions: questions.length,
      subjectDistribution: { '高数': 0, '线代': 0, '概率论': 0 },
      chapterDistribution: { '极限': 0, '导数': 0, '积分': 0, '行列式': 0, '矩阵': 0, '随机变量': 0, '概率分布': 0, '其他': 0 },
      masteryDistribution: { '未掌握': 0, '部分掌握': 0, '已掌握': 0 },
      weakPoints: [],
      reviewProgress: 0,
    };

    const chapterCounts: Record<string, number> = {};

    questions.forEach(q => {
      stats.subjectDistribution[q.subject]++;
      if (stats.chapterDistribution[q.chapter] !== undefined) {
        stats.chapterDistribution[q.chapter]++;
      }
      stats.masteryDistribution[q.masteryLevel]++;
      
      const key = `${q.subject}-${q.chapter}`;
      chapterCounts[key] = (chapterCounts[key] || 0) + 1;
    });

    stats.weakPoints = Object.entries(chapterCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalMastered = stats.masteryDistribution['已掌握'] + stats.masteryDistribution['部分掌握'] * 0.5;
    stats.reviewProgress = questions.length > 0 ? Math.round((totalMastered / questions.length) * 100) : 0;

    setStatistics(stats);
  };

  return (
    <AppContext.Provider value={{
      questions,
      topics,
      statistics,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      generateTopics,
      updateStatistics,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
