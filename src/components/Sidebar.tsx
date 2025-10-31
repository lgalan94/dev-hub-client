import React from 'react';
import type { Page, Theme } from '../types';
import { HomeIcon, CodeIcon, FolderKanbanIcon, GraduationCapIcon, BookTextIcon, LogOutIcon, SunIcon, MoonIcon } from './ui/icons';
import Button from './ui/Button';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const navItems = [
  { name: 'Dashboard', icon: HomeIcon },
  { name: 'Snippets', icon: CodeIcon },
  { name: 'Projects', icon: FolderKanbanIcon },
  { name: 'Learning', icon: GraduationCapIcon },
  { name: 'Journal', icon: BookTextIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, theme, toggleTheme }) => {
  const NavLink: React.FC<{ name: Page; icon: React.ElementType }> = ({ name, icon: Icon }) => {
    const isActive = activePage === name;
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActivePage(name);
        }}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Icon className="mr-3 h-5 w-5" />
        {name}
      </a>
    );
  };

  return (
    <aside className="flex flex-col w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 16v-2m0-8v-2m0 16v-2m-8 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">DevHub</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.name} name={item.name as Page} icon={item.icon} />
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <Button variant="ghost" className="w-full justify-start px-3" onClick={toggleTheme}>
            {theme === 'light' ? <MoonIcon className="mr-3 h-5 w-5" /> : <SunIcon className="mr-3 h-5 w-5" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <LogOutIcon className="mr-3 h-5 w-5" />
          Logout
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;