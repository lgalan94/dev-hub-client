import React, { useState } from 'react';
import { mockProjects } from '../../data/mockData';
import type { Project, ProjectStatus } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/Card';
import { PlusIcon, EditIcon, TrashIcon, ExternalLinkIcon } from '../ui/icons';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

// In a real project, you would install react-beautiful-dnd and its types:
// npm install react-beautiful-dnd
// npm install @types/react-beautiful-dnd -D
// For this environment, a simple mock is provided to allow the code to run.
const DragDropContext = ({ children, onDragEnd }: any) => <div onDragEnd={onDragEnd}>{children}</div>;
const Droppable = ({ children, droppableId }: any) => children({ innerRef: () => {}, droppableProps: { 'data-rbd-droppable-id': droppableId }, placeholder: null }, {});
const Draggable = ({ children, draggableId, index }: any) => children({ innerRef: () => {}, draggableProps: { 'data-rbd-draggable-id': draggableId, 'data-rbd-draggable-index': index }, dragHandleProps: null }, {});
type DropResult = any;


const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch(status) {
        case 'Completed': return 'success';
        case 'In Progress': return 'default';
        case 'Planning': return 'secondary';
        default: return 'outline';
    }
}

const ProjectForm: React.FC<{ project: Project | null, onSave: (project: Project) => void, onCancel: () => void }> = ({ project, onSave, onCancel }) => {
    const [title, setTitle] = useState(project?.title || '');
    const [description, setDescription] = useState(project?.description || '');
    const [techStack, setTechStack] = useState(project?.techStack.join(', ') || '');
    const [repoLink, setRepoLink] = useState(project?.repoLink || '');
    const [liveLink, setLiveLink] = useState(project?.liveLink || '');
    const [status, setStatus] = useState<ProjectStatus>(project?.status || 'Planning');
    const [progress, setProgress] = useState(project?.progress || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: project?.id || `project-${Date.now()}`,
            title, description, status, progress,
            techStack: techStack.split(',').map(t => t.trim()).filter(Boolean),
            repoLink, liveLink,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <Input placeholder="Tech Stack (comma-separated)" value={techStack} onChange={e => setTechStack(e.target.value)} />
            <Input placeholder="Repo Link" value={repoLink} onChange={e => setRepoLink(e.target.value)} />
            <Input placeholder="Live Link" value={liveLink} onChange={e => setLiveLink(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
                <select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
                <Input type="number" placeholder="Progress %" value={progress} onChange={e => setProgress(Number(e.target.value))} min="0" max="100" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Project</Button>
            </div>
        </form>
    );
};


const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'kanban'>('card');
  
  const handleSave = (project: Project) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      setProjects([project, ...projects]);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };
  
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure?')) {
        setProjects(projects.filter(p => p.id !== id));
    }
  };
  
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    const updatedProjects = [...projects];
    const movedProject = updatedProjects.find(p => p.id === draggableId);
    if (movedProject) {
        movedProject.status = destination.droppableId as ProjectStatus;
        // This is a simplified logic. For a more robust solution, you'd reorder the array.
        setProjects(updatedProjects);
    }
  };
  
  const KanbanProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Card className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
        <CardHeader className="p-4">
            <CardTitle className="text-base">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <CardDescription className="text-xs line-clamp-2 mb-3">{project.description}</CardDescription>
            <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map(tech => <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>)}
            </div>
        </CardContent>
    </Card>
  );

  const renderCardView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <Badge variant={getStatusBadgeVariant(project.status)} className="mt-2">{project.status}</Badge>
                  </div>
                   <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}><EditIcon className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}><TrashIcon className="w-4 h-4 text-red-500"/></Button>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{project.description}</CardDescription>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
               <div className="w-full flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
               </div>
               <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
               </div>
               <div className="flex items-center gap-4 mt-4">
                {project.repoLink && <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"><ExternalLinkIcon className="w-4 h-4 mr-1"/> Repo</a>}
                {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"><ExternalLinkIcon className="w-4 h-4 mr-1"/> Live</a>}
               </div>
            </CardFooter>
          </Card>
        ))}
      </div>
  );

  const renderKanbanView = () => {
    const projectsByStatus = {
        'Planning': projects.filter(p => p.status === 'Planning'),
        'In Progress': projects.filter(p => p.status === 'In Progress'),
        'Completed': projects.filter(p => p.status === 'Completed'),
    };
    const columnOrder: ProjectStatus[] = ['Planning', 'In Progress', 'Completed'];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {columnOrder.map(status => (
                    <div key={status} className="bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                         <h3 className="font-bold text-lg p-4 border-b-2 border-slate-200 dark:border-slate-700">{status} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{projectsByStatus[status].length}</span></h3>
                        <Droppable droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`p-4 rounded-b-lg transition-colors min-h-[200px] ${snapshot.isDraggingOver ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
                                >
                                    {projectsByStatus[status].map((project, index) => (
                                        <Draggable key={project.id} draggableId={project.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`mb-4 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500' : ''}`}
                                                >
                                                    <KanbanProjectCard project={project} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
            <h1 className="text-3xl font-bold">Project Tracker</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your personal and professional projects.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-md">
                <Button variant={viewMode === 'card' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('card')}>Card</Button>
                <Button variant={viewMode === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')}>Kanban</Button>
            </div>
            <Button onClick={() => { setEditingProject(null); setIsModalOpen(true); }}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Project
            </Button>
        </div>
      </div>

      {viewMode === 'card' ? renderCardView() : renderKanbanView()}
      
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <ProjectForm 
          project={editingProject}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingProject(null); }}
        />
      </Modal>
    </div>
  );
};

export default Projects;
