
export type Page = 'Dashboard' | 'Snippets' | 'Projects' | 'Learning' | 'Journal' | 'Ideas' | 'Tools';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  status: ProjectStatus;
  progress: number;
}

export interface LearningTopic {
  id: string;
  topicName: string;
  category: string;
  progress: number; // 0-100
  notes: string; // Markdown
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string; // Markdown
  date: string;
  tags: string[];
}