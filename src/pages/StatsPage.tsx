import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Subject } from '../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];
const MASTERY_COLORS = { '未掌握': '#ef4444', '部分掌握': '#f59e0b', '已掌握': '#10b981' };

const StatsPage: React.FC = () => {
  const { statistics, questions } = useApp();

  const subjectData = Object.entries(statistics.subjectDistribution)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({ name, count }));

  const masteryData = Object.entries(statistics.masteryDistribution)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({ name, count }));

  const weakPointsData = statistics.weakPoints.map((wp) => ({
    name: wp.name,
    count: wp.count,
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📊 学情数据统计</h1>
        <p className="text-slate-600 mt-2">直观了解你的学习情况</p>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">总错题数</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{statistics.totalQuestions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">未掌握</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{statistics.masteryDistribution['未掌握']}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">部分掌握</p>
              <p className="text-3xl font-bold text-amber-500 mt-1">{statistics.masteryDistribution['部分掌握']}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">📖</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">已掌握</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{statistics.masteryDistribution['已掌握']}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>
      </div>

      {/* 复习进度 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">📈 复习进度</h2>
          <span className="text-2xl font-bold text-primary-600">{statistics.reviewProgress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${statistics.reviewProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* 科目分布饼图 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">📊 科目错题分布</h2>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-slate-500">暂无数据</div>
          )}
        </div>

        {/* 掌握程度分布 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">📊 掌握程度分布</h2>
          {masteryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {masteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MASTERY_COLORS[entry.name as keyof typeof MASTERY_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-slate-500">暂无数据</div>
          )}
        </div>
      </div>

      {/* 薄弱知识点排行榜 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">🏆 薄弱知识点排行榜</h2>
        {weakPointsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weakPointsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-slate-500">暂无数据</div>
        )}
      </div>

      {/* 章节统计 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">📚 各章节错题统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statistics.chapterDistribution)
            .filter(([_, count]) => count > 0)
            .map(([chapter, count]) => (
              <div key={chapter} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600">{chapter}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
