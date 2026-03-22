import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { analyzeQuestion } from '../services/aiService';
import { Source, Difficulty } from '../types';

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const { addQuestion } = useApp();
  
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [wrongAnswer, setWrongAnswer] = useState('');
  const [source, setSource] = useState<Source>('真题');
  const [difficulty, setDifficulty] = useState<Difficulty>('中等');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('请输入题目内容');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const aiAnalysis = analyzeQuestion(content, wrongAnswer);
      const questionData = {
        content,
        imageUrl: imageUrl || undefined,
        wrongAnswer,
        source,
        difficulty,
        date,
        ...aiAnalysis,
      } as any;
      
      addQuestion(questionData);
      setIsAnalyzing(false);
      alert('录入成功！');
      navigate('/bank');
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📝 录入错题</h1>
        <p className="text-slate-600 mt-2">快速录入错题，AI自动分析</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 题目内容 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span>📋</span> 题目内容
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                题目文本
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请粘贴或输入题目内容..."
                className="w-full h-40 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                错题图片（可选，OCR识别）
              </label>
              {imageUrl ? (
                <div className="relative">
                  <img src={imageUrl} alt="错题" className="max-h-64 rounded-xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-slate-500">点击上传图片</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                我的错误思路/作答过程
              </label>
              <textarea
                value={wrongAnswer}
                onChange={(e) => setWrongAnswer(e.target.value)}
                placeholder="写下你当时的错误思路或答案..."
                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* 基础信息 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span>🏷️</span> 基础信息
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">题目来源</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as Source)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="真题">真题</option>
                <option value="习题册">习题册</option>
                <option value="模拟卷">模拟卷</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">难度</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">错题日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/bank')}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AI分析中...
              </>
            ) : (
              '一键存档'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPage;
