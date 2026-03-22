import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import InputPage from './pages/InputPage';
import QuestionBankPage from './pages/QuestionBankPage';
import TopicPage from './pages/TopicPage';
import StatsPage from './pages/StatsPage';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '错题录入', icon: '📝' },
    { path: '/bank', label: '错题库', icon: '📚' },
    { path: '/topics', label: '专项提升', icon: '🎯' },
    { path: '/stats', label: '数据统计', icon: '📊' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-primary-700 flex items-center gap-2">
            📐 考研数学
          </h1>
          <p className="text-sm text-slate-500 mt-1">AI智能错题本</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
            <p className="font-semibold text-sm">💡 学习提示</p>
            <p className="text-xs mt-1 opacity-90">每天坚持复盘错题，数学分数稳步提升！</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-primary-700">📐 考研数学</h1>
          <div className="w-10"></div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<InputPage />} />
            <Route path="/bank" element={<QuestionBankPage />} />
            <Route path="/topics" element={<TopicPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
