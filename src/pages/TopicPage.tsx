import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StudyTopic } from '../types';

const TopicPage: React.FC = () => {
  const { topics, generateTopics, questions } = useApp();
  
  useEffect(() => {
    generateTopics();
  }, []);

  const getTopicQuestions = (topic: StudyTopic) => {
    return questions.filter(q => topic.questions.includes(q.id));
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case '高数': return 'bg-blue-100 text-blue-700';
      case '线代': return 'bg-purple-100 text-purple-700';
      case '概率论': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🎯 专项提升</h1>
        <p className="text-slate-600 mt-2">针对薄弱知识点集中突破</p>
      </div>

      {topics.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">还没有薄弱专题</h2>
          <p className="text-slate-600">继续录入错题，系统会自动为你生成薄弱专题！</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {topics.map((topic) => {
            const topicQuestions = getTopicQuestions(topic);
            return (
              <div key={topic.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-white">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{topic.name}</h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(topic.subject)}`}>
                          {topic.subject}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          {topic.chapter}
                        </span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {topic.errorType}
                        </span>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {topicQuestions.length} 道错题
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 同类错题 */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span>📝</span> 同类错题聚合
                      </h3>
                      <div className="space-y-3">
                        {topicQuestions.map((q) => (
                          <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-slate-900 text-sm line-clamp-2">{q.content}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs text-slate-500">{q.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 解题思路模板 */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span>💡</span> 解题思路模板
                      </h3>
                      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-200">
                        <ol className="space-y-3">
                          {topic.solutionTemplate.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-slate-800">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* 同类题型推送 */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <span>📚</span> 强化练习题
                    </h3>
                    <div className="space-y-4">
                      {topic.practiceQuestions.map((pq, index) => (
                        <div key={index} className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-slate-900 font-medium">{pq.question}</p>
                              <details className="mt-3">
                                <summary className="text-primary-600 cursor-pointer font-medium text-sm">查看答案和解析</summary>
                                <div className="mt-2 pt-3 border-t border-green-200">
                                  <p className="text-green-800"><strong>答案：</strong>{pq.answer}</p>
                                  <p className="text-slate-700 mt-2"><strong>解析：</strong>{pq.explanation}</p>
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopicPage;
