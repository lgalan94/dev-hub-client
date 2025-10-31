
import type { User, Snippet, Project, LearningTopic, JournalEntry } from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Lito Galan',
  email: 'lito.galan@example.com',
  avatarUrl: 'https://picsum.photos/seed/user1/100/100',
};

export const mockSnippets: Snippet[] = [
  {
    id: 'snippet-1',
    title: 'React Custom Hook: useDebounce',
    description: 'A custom hook to debounce any fast-changing value.',
    code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;`,
    language: 'typescript',
    tags: ['react', 'hook', 'debounce', 'typescript'],
    createdAt: '2023-10-26T10:00:00Z',
  },
  {
    id: 'snippet-2',
    title: 'Python Flask Minimal App',
    description: 'A barebones "Hello, World!" application using the Flask framework in Python.',
    code: `from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)`,
    language: 'python',
    tags: ['python', 'flask', 'backend', 'api'],
    createdAt: '2023-10-25T14:30:00Z',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Personal Developer Hub',
    description: 'The very application you are using now. An all-in-one platform for developers.',
    techStack: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
    repoLink: 'https://github.com/example/dev-hub',
    liveLink: 'https://dev-hub.example.com',
    status: 'In Progress',
    progress: 75,
  },
  {
    id: 'project-2',
    title: 'E-commerce Backend API',
    description: 'A robust REST API for an e-commerce platform built with Node.js and Express.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    repoLink: 'https://github.com/example/ecommerce-api',
    status: 'Completed',
    progress: 100,
  },
  {
    id: 'project-3',
    title: 'Mobile Weather App',
    description: 'A simple and clean weather application for iOS and Android using React Native.',
    techStack: ['React Native', 'Expo', 'OpenWeatherMap API'],
    status: 'Planning',
    progress: 10,
  },
];

export const mockLearningTopics: LearningTopic[] = [
  {
    id: 'learn-1',
    topicName: 'Advanced TypeScript',
    category: 'Frontend',
    progress: 60,
    notes: '### Topics to cover:\n- Generics\n- Conditional Types\n- Mapped Types\n- Decorators',
  },
  {
    id: 'learn-2',
    topicName: 'GraphQL Fundamentals',
    category: 'Backend',
    progress: 85,
    notes: 'Finished the main course. Need to build a project with Apollo Server and Client.',
  },
  {
    id: 'learn-3',
    topicName: 'Docker & Containerization',
    category: 'DevOps',
    progress: 30,
    notes: 'Just started learning about Dockerfiles and docker-compose. It seems powerful!',
  },
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    title: 'Solved a tricky CSS bug',
    content: 'Today I spent a few hours debugging a layout issue with flexbox. It turned out to be a `min-width: 0` problem on a flex child. It\'s a good reminder to always check the browser dev tools carefully.',
    date: '2023-10-26T18:00:00Z',
    tags: ['css', 'debugging', 'frontend'],
  },
  {
    id: 'journal-2',
    title: 'Learned about database indexing',
    content: 'Dived into how database indexing works in MongoDB. It can dramatically improve query performance. I need to apply this to my e-commerce API project.',
    date: '2023-10-25T20:15:00Z',
    tags: ['database', 'mongodb', 'performance'],
  },
];
