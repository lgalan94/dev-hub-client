import React, { useState } from 'react';
import { mockJournalEntries } from '../../data/mockData';
import type { JournalEntry } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { PlusIcon, EditIcon, TrashIcon } from '../ui/icons';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Badge from '../ui/Badge';
// react-markdown is a placeholder for a real implementation
const ReactMarkdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const content = String(children);
    const html = content
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-slate-700 text-red-500 dark:text-red-400 rounded px-1 py-0.5 font-mono text-sm">$1</code>')
        .split('\n')
        .map(line => line.trim().startsWith('<li>') ? line : `<p>${line}</p>`)
        .join('')
        .replace(/<p><\/p>/g, '<br />');


    return <div className="prose dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};


const JournalForm: React.FC<{ entry: JournalEntry | null, onSave: (entry: JournalEntry) => void, onCancel: () => void }> = ({ entry, onSave, onCancel }) => {
    const [title, setTitle] = useState(entry?.title || '');
    const [tags, setTags] = useState(entry?.tags.join(', ') || '');
    const [content, setContent] = useState(entry?.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: entry?.id || `journal-${Date.now()}`,
            title,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            content,
            date: entry?.date || new Date().toISOString()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Entry Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Input placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
            <Textarea placeholder="Content (Markdown supported)..." value={content} onChange={e => setContent(e.target.value)} required rows={10} />
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Entry</Button>
            </div>
        </form>
    );
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const handleSave = (entry: JournalEntry) => {
    if (editingEntry) {
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
    } else {
      setEntries([entry, ...entries]);
    }
    setIsModalOpen(false);
    setEditingEntry(null);
  };
  
  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure?')) {
        setEntries(entries.filter(e => e.id !== id));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Developer Journal</h1>
            <p className="text-slate-600 dark:text-slate-400">Log your thoughts, progress, and discoveries.</p>
        </div>
        <Button onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <article key={entry.id} className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
            <header className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold">{entry.title}</h2>
                    <time className="text-xs text-slate-500 dark:text-slate-400">{new Date(entry.date).toLocaleString()}</time>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}><EditIcon className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}><TrashIcon className="w-4 h-4 text-red-500"/></Button>
                </div>
            </header>
            <div className="text-slate-700 dark:text-slate-300">
                <ReactMarkdown>{entry.content}</ReactMarkdown>
            </div>
            <footer className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
            </footer>
          </article>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
      >
        <JournalForm 
          entry={editingEntry}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingEntry(null); }}
        />
      </Modal>
    </div>
  );
};

export default Journal;