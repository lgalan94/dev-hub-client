import React, { useState } from 'react';
import { mockLearningTopics } from '../../data/mockData';
import type { LearningTopic } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { PlusIcon, EditIcon, TrashIcon } from '../ui/icons';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
// react-markdown is a placeholder for a real implementation
const ReactMarkdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // A very basic markdown-to-HTML converter for demonstration
    const content = String(children);
    
    // This simple regex parser is for demo purposes.
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


const LearningForm: React.FC<{ topic: LearningTopic | null, onSave: (topic: LearningTopic) => void, onCancel: () => void }> = ({ topic, onSave, onCancel }) => {
    const [topicName, setTopicName] = useState(topic?.topicName || '');
    const [category, setCategory] = useState(topic?.category || '');
    const [progress, setProgress] = useState(topic?.progress || 0);
    const [notes, setNotes] = useState(topic?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: topic?.id || `learn-${Date.now()}`,
            topicName, category, progress, notes
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Topic Name" value={topicName} onChange={e => setTopicName(e.target.value)} required />
            <Input placeholder="Category (e.g., Frontend)" value={category} onChange={e => setCategory(e.target.value)} />
            <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Progress: {progress}%</label>
                <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            </div>
            <Textarea placeholder="Notes (Markdown supported)" value={notes} onChange={e => setNotes(e.target.value)} rows={6} />
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Topic</Button>
            </div>
        </form>
    );
};


const Learning: React.FC = () => {
    const [topics, setTopics] = useState<LearningTopic[]>(mockLearningTopics);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<LearningTopic | null>(null);

    const handleSave = (topic: LearningTopic) => {
        if (editingTopic) {
            setTopics(topics.map(t => t.id === topic.id ? topic : t));
        } else {
            setTopics([topic, ...topics]);
        }
        setIsModalOpen(false);
        setEditingTopic(null);
    };
    
    const handleEdit = (topic: LearningTopic) => {
        setEditingTopic(topic);
        setIsModalOpen(true);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure?')) {
            setTopics(topics.filter(t => t.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Learning Tracker</h1>
                    <p className="text-slate-600 dark:text-slate-400">Track your learning journey and progress.</p>
                </div>
                <Button onClick={() => { setEditingTopic(null); setIsModalOpen(true); }}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Topic
                </Button>
            </div>

            <div className="space-y-4">
                {topics.map(topic => (
                    <Card key={topic.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{topic.topicName}</CardTitle>
                                    <CardDescription>{topic.category}</CardDescription>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}><EditIcon className="w-4 h-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)}><TrashIcon className="w-4 h-4 text-red-500"/></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                               <div className="w-full flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    <span>Progress</span>
                                    <span>{topic.progress}%</span>
                               </div>
                               <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                 <div className="bg-green-600 h-2 rounded-full" style={{ width: `${topic.progress}%` }}></div>
                               </div>
                            </div>
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Notes</h4>
                                <ReactMarkdown>{topic.notes}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTopic ? 'Edit Learning Topic' : 'Add New Topic'}
            >
                <LearningForm 
                    topic={editingTopic}
                    onSave={handleSave}
                    onCancel={() => { setIsModalOpen(false); setEditingTopic(null); }}
                />
            </Modal>
        </div>
    );
};

export default Learning;