import { Subject, Chapter, QuestionType, ErrorType, WrongQuestion } from '../types';

const chapterMapping: Record<string, Chapter[]> = {
  '高数': ['极限', '导数', '积分', '其他'],
  '线代': ['行列式', '矩阵', '其他'],
  '概率论': ['随机变量', '概率分布', '其他'],
};

const keywords = {
  '极限': ['极限', 'lim', '趋近', '无穷小', '无穷大'],
  '导数': ['导数', '微分', 'f\'', 'dy/dx', '切线'],
  '积分': ['积分', '∫', '不定积分', '定积分', '原函数'],
  '行列式': ['行列式', '| |', 'det'],
  '矩阵': ['矩阵', '方阵', '逆矩阵', '秩', '特征值'],
  '随机变量': ['随机变量', '分布', '期望', '方差'],
  '概率分布': ['概率分布', '正态分布', '二项分布', '泊松分布'],
};

export const analyzeQuestion = (content: string, wrongAnswer: string): Partial<WrongQuestion> => {
  let subject: Subject = '高数';
  let chapter: Chapter = '其他';
  let questionType: QuestionType = '解答';
  let errorType: ErrorType = '其他';

  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('行列式') || lowerContent.includes('矩阵') || lowerContent.includes('特征值')) {
    subject = '线代';
  } else if (lowerContent.includes('概率') || lowerContent.includes('分布') || lowerContent.includes('期望')) {
    subject = '概率论';
  }

  for (const [chap, keys] of Object.entries(keywords)) {
    if (keys.some(key => lowerContent.includes(key.toLowerCase()))) {
      if (chapterMapping[subject]?.includes(chap as Chapter)) {
        chapter = chap as Chapter;
        break;
      }
    }
  }

  if (content.includes('选择') || content.includes('单选题') || content.includes('多选题')) {
    questionType = '选择';
  } else if (content.includes('填空')) {
    questionType = '填空';
  }

  if (wrongAnswer.length > 0 && wrongAnswer !== content) {
    if (wrongAnswer.includes('×') || wrongAnswer.includes('错') || wrongAnswer.includes('不对')) {
      errorType = '概念混淆';
    } else if (wrongAnswer.match(/\d/)) {
      errorType = '计算失误';
    } else {
      errorType = '思路断层';
    }
  }

  const tags = [subject, chapter, questionType];
  if (chapter !== '其他') tags.push(chapter);

  return {
    subject,
    chapter,
    questionType,
    errorType,
    tags,
    masteryLevel: '未掌握',
    reviewCount: 0,
    analysis: {
      core考点: `本题考查${subject}中${chapter}的相关知识点`,
      formulas: ['请根据题目补充相关公式'],
      solutionSteps: ['步骤1：分析题目条件', '步骤2：回忆相关知识点', '步骤3：制定解题策略', '步骤4：执行计算', '步骤5：检查验证'],
      techniques: ['认真审题，明确已知条件', '回忆相关公式定理', '注意解题步骤的规范性'],
      pitfalls: ['避免概念混淆', '注意计算准确性', '不要遗漏关键步骤'],
    },
    errorAnalysis: {
      rootCause: '需要结合具体错误进行分析',
      suggestion: '建议复习相关知识点，多做类似题目巩固',
    },
    correctSolution: '请补充正确解答过程',
  };
};
