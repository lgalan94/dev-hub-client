import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { mockSnippets } from '../../data/mockData';
import type { Snippet, Theme } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Card, CardContent } from '../ui/Card';
import { PlusIcon, EditIcon, TrashIcon, ChevronLeftIcon, CopyIcon } from '../ui/icons';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Badge from '../ui/Badge';
import CodeEditor from '../ui/CodeEditor';
import { Prism as SyntaxHighlighterComponent } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';


// A syntax highlighter component with a copy button
const SyntaxHighlighter: React.FC<{ code: string, language: string, theme: Theme }> = ({ code, language, theme }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success('Code copied to clipboard!');
        }, (err) => {
            toast.error('Failed to copy code.');
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="relative group">
            <SyntaxHighlighterComponent
                language={language}
                style={theme === 'dark' ? vscDarkPlus : prism}
                customStyle={{ 
                    margin: 0, 
                    borderRadius: '0.375rem',
                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', // slate-700 / slate-200
                }}
                 codeTagProps={{
                     style: { 
                         fontFamily: 'inherit',
                         fontSize: '0.875rem'
                    }
                }}
            >
                {code}
            </SyntaxHighlighterComponent>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
            >
                <span className="sr-only">Copy code</span>
                <CopyIcon className="w-4 h-4" />
            </Button>
        </div>
    );
};


const SnippetForm: React.FC<{ snippet: Snippet | null, onSave: (snippet: Snippet) => void, onCancel: () => void }> = ({ snippet, onSave, onCancel }) => {
    const [title, setTitle] = useState(snippet?.title || '');
    const [description, setDescription] = useState(snippet?.description || '');
    const [language, setLanguage] = useState(snippet?.language || 'typescript');
    const [tags, setTags] = useState(snippet?.tags.join(', ') || '');
    const [code, setCode] = useState(snippet?.code || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: snippet?.id || `snippet-${Date.now()}`,
            title,
            description,
            language,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            code,
            createdAt: snippet?.createdAt || new Date().toISOString()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="snippet-title" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
                <Input id="snippet-title" placeholder="Snippet Title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="snippet-description" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
                <Textarea id="snippet-description" placeholder="A brief description of the snippet" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
             <div>
                <label htmlFor="snippet-language" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Language</label>
                <Input id="snippet-language" placeholder="e.g., typescript, python" value={language} onChange={e => setLanguage(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="snippet-tags" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Tags</label>
                <Input id="snippet-tags" placeholder="Comma-separated, e.g., react, hook" value={tags} onChange={e => setTags(e.target.value)} />
            </div>
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Code</label>
                <CodeEditor language={language} value={code} onChange={setCode} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Snippet</Button>
            </div>
        </form>
    );
};

const Snippets: React.FC<{ theme: Theme }> = ({ theme }) => {
    const [snippets, setSnippets] = useState<Snippet[]>(mockSnippets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
    const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSave = (snippet: Snippet) => {
        if (editingSnippet) {
            setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
        } else {
            setSnippets([snippet, ...snippets]);
        }
        // If we were editing the currently viewed snippet, update the view
        if (selectedSnippetId === snippet.id) {
             setSelectedSnippetId(snippet.id);
        }
        setIsModalOpen(false);
        setEditingSnippet(null);
    };

    const handleAddNew = () => {
        setEditingSnippet(null);
        setIsModalOpen(true);
    };

    const handleEdit = (snippet: Snippet) => {
        setEditingSnippet(snippet);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            setSnippets(snippets.filter(s => s.id !== id));
            // If the deleted snippet was being viewed, go back to the list
            if (selectedSnippetId === id) {
                setSelectedSnippetId(null);
            }
        }
    };

    const filteredSnippets = useMemo(() => 
        snippets.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())),
        [snippets, searchTerm]
    );

    const selectedSnippet = useMemo(() => 
        snippets.find(s => s.id === selectedSnippetId),
        [snippets, selectedSnippetId]
    );

    // List View
    if (!selectedSnippet) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Code Snippet Vault</h1>
                        <p className="text-slate-600 dark:text-slate-400">Your personal collection of code snippets.</p>
                    </div>
                    <Button onClick={handleAddNew}>
                      <PlusIcon className="mr-2 h-4 w-4" /> Add Snippet
                    </Button>
                </div>

                <div className="relative">
                    <Input 
                        placeholder="Search snippets by title..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                     <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredSnippets.length > 0 ? filteredSnippets.map(snippet => (
                                <li key={snippet.id}
                                    className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedSnippetId(snippet.id)}
                                >
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{snippet.title}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{snippet.description}</p>
                                </li>
                            )) : (
                                <li className="p-6 text-center text-slate-500 dark:text-slate-400">No snippets found.</li>
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingSnippet(null); }} title={editingSnippet ? 'Edit Snippet' : 'New Snippet'}>
                    <SnippetForm snippet={editingSnippet} onSave={handleSave} onCancel={() => { setIsModalOpen(false); setEditingSnippet(null); }} />
                </Modal>
            </div>
        );
    }
    
    // Detail View
    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" onClick={() => setSelectedSnippetId(null)} className="mb-4">
                    <ChevronLeftIcon className="mr-2 h-4 w-4" /> Back to list
                </Button>
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{selectedSnippet.title}</h1>
                        <p className="text-slate-600 dark:text-slate-400">{selectedSnippet.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Created on {new Date(selectedSnippet.createdAt).toLocaleDateString()}</p>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(selectedSnippet)}>
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedSnippet.id)}>
                             <TrashIcon className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedSnippet.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Code</h3>
                <SyntaxHighlighter code={selectedSnippet.code} language={selectedSnippet.language} theme={theme} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingSnippet(null); }} title={'Edit Snippet'}>
                <SnippetForm snippet={editingSnippet} onSave={handleSave} onCancel={() => { setIsModalOpen(false); setEditingSnippet(null); }} />
            </Modal>
        </div>
    );
};

export default Snippets;