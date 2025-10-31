import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/pages/Dashboard';
import Snippets from './components/pages/Snippets';
import Projects from './components/pages/Projects';
import Learning from './components/pages/Learning';
import Journal from './components/pages/Journal';
import Login from './components/pages/Login';
import { Toaster, toast } from 'react-hot-toast';
import type { Page, User, Theme } from './types';
import { mockUser } from './data/mockData';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setUser(mockUser);
    setActivePage('Dashboard');
    toast.success('Successfully logged in!');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out.');
  }, []);
  
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard user={user} setActivePage={setActivePage} />;
      case 'Snippets':
        return <Snippets theme={theme} />;
      case 'Projects':
        return <Projects />;
      case 'Learning':
        return <Learning />;
      case 'Journal':
        return <Journal />;
      default:
        return <Dashboard user={user} setActivePage={setActivePage} />;
    }
  };

  const toastOptions = {
    style: {
        background: theme === 'dark' ? '#334155' : '#f1f5f9',
        color: theme === 'dark' ? '#fff' : '#1e293b',
    },
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" toastOptions={toastOptions} />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={toastOptions} />
      <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </>
  );
};

export default App;