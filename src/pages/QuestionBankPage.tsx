import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subject, Chapter, ErrorType, MasteryLevel, WrongQuestion } from '../types';

const QuestionBankPage: React.FC = () => {
  const { questions, updateQuestion, deleteQuestion } = useApp();
  
  const [filters, setFilters] = useState({
    subject: '' as Subject | '',
    chapter: '' as Chapter | '',
    errorType: '' as ErrorType | '',
    masteryLevel: '' as MasteryLevel | '',
  });
  const [selectedQuestion, setSelectedQuestion] = useState<WrongQuestion | null>(null);

  const filteredQuestions = questions.filter(q => {
    if (filters.subject && q.subject !== filters.subject) return false;
    if (filters.chapter && q.chapter !== filters.chapter) return false;
    if (filters.errorType && q.errorType !== filters.errorType) return false;
    if (filters.masteryLevel && q.masteryLevel !== filters.masteryLevel) return false;
    return true;
  });

  const getMasteryColor = (level: MasteryLevel) => {
    switch (level) {
      case '未掌握': return 'bg-red-100 text-red-700';
      case '部分掌握': return 'bg-yellow-100 text-yellow-700';
      case '已掌握': return 'bg-green-100 text-green-700';
    }
  };

  const getSubjectColor = (subject: Subject) => {
    switch (subject) {
      case '高数': return 'bg-blue-100 text-blue-700';
      case '线代': return 'bg-purple-100 text-purple-700';
      case '概率论': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📚 错题库</h1>
        <p className="text-slate-600 mt-2">共 {filteredQuestions.length} 道错题</p>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">科目</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部</option>
              <option value="高数">高数</option>
              <option value="线代">线代</option>
              <option value="概率论">概率论</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">章节</label>
            <select
              value={filters.chapter}
              onChange={(e) => setFilters(f => ({ ...f, chapter: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部</option>
              <option value="极限">极限</option>
              <option value="导数">导数</option>
              <option value="积分">积分</option>
              <option value="行列式">行列式</option>
              <option value="矩阵">矩阵</option>
              <option value="随机变量">随机变量</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">错误类型</label>
            <select
              value={filters.errorType}
              onChange={(e) => setFilters(f => ({ ...f, errorType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部</option>
              <option value="概念混淆">概念混淆</option>
              <option value="计算失误">计算失误</option>
              <option value="思路断层">思路断层</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">掌握程度</label>
            <select
              value={filters.masteryLevel}
              onChange={(e) => setFilters(f => ({ ...f, masteryLevel: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部</option>
              <option value="未掌握">未掌握</option>
              <option value="部分掌握">部分掌握</option>
              <option value="已掌握">已掌握</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({ subject: '', chapter: '', errorType: '', masteryLevel: '' })}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* 错题列表 */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedQuestion(question)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(question.subject)}`}>
                    {question.subject}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    {question.chapter}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMasteryColor(question.masteryLevel)}`}>
                    {question.masteryLevel}
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    {question.errorType}
                  </span>
                </div>
                <p className="text-slate-900 font-medium line-clamp-2">{question.content}</p>
                <p className="text-slate-500 text-sm mt-2">{question.date}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const levels: MasteryLevel[] = ['未掌握', '部分掌握', '已掌握'];
                    const currentIndex = levels.indexOf(question.masteryLevel);
                    const nextLevel = levels[(currentIndex + 1) % levels.length];
                    updateQuestion(question.id, { masteryLevel: nextLevel });
                  }}
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                >
                  更新掌握
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('确定要删除这道错题吗？')) {
                      deleteQuestion(question.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 错题详情弹窗 */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedQuestion(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">错题详情</h2>
                <button onClick={() => setSelectedQuestion(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">题目</h3>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">{selectedQuestion.content}</p>
              </div>
              {selectedQuestion.imageUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">图片</h3>
                  <img src={selectedQuestion.imageUrl} alt="错题" className="max-w-full rounded-xl" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">我的错误答案</h3>
                <p className="text-red-700 bg-red-50 p-4 rounded-xl">{selectedQuestion.wrongAnswer}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">核心考点</h3>
                <p className="text-slate-900">{selectedQuestion.analysis.core考点}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">正确解析</h3>
                <p className="text-slate-900 bg-green-50 p-4 rounded-xl">{selectedQuestion.correctSolution}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">错因分析</h3>
                <div className="bg-amber-50 p-4 rounded-xl">
                  <p className="text-amber-900"><strong>根源：</strong>{selectedQuestion.errorAnalysis.rootCause}</p>
                  <p className="text-amber-900 mt-2"><strong>建议：</strong>{selectedQuestion.errorAnalysis.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
