import React from 'react';
import type { User, Page } from '../../types';
import { mockSnippets, mockProjects, mockLearningTopics, mockJournalEntries } from '../../data/mockData';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { CodeIcon, FolderKanbanIcon, GraduationCapIcon, BookTextIcon } from '../ui/icons';

interface DashboardProps {
  user: User | null;
  setActivePage: (page: Page) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; onClick: () => void }> = ({ title, value, icon: Icon, onClick }) => (
    <Card className="hover:border-indigo-500 dark:hover:border-indigo-600 transition-colors cursor-pointer" onClick={onClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ user, setActivePage }) => {
  const latestJournal = mockJournalEntries[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-slate-600 dark:text-slate-400">Here's a snapshot of your developer world.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Snippets" value={mockSnippets.length} icon={CodeIcon} onClick={() => setActivePage('Snippets')} />
        <StatCard title="Projects" value={mockProjects.length} icon={FolderKanbanIcon} onClick={() => setActivePage('Projects')} />
        <StatCard title="Learning Topics" value={mockLearningTopics.length} icon={GraduationCapIcon} onClick={() => setActivePage('Learning')} />
        <StatCard title="Journal Entries" value={mockJournalEntries.length} icon={BookTextIcon} onClick={() => setActivePage('Journal')} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>An overview of your current project statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockProjects.slice(0, 3).map(project => (
                <li key={project.id}>
                  <p className="font-semibold">{project.title}</p>
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{project.status}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Journal Entry</CardTitle>
          </CardHeader>
          <CardContent>
            {latestJournal ? (
              <div className="space-y-2">
                <h3 className="font-semibold">{latestJournal.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4">{latestJournal.content}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 pt-2">{new Date(latestJournal.date).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">No journal entries yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;