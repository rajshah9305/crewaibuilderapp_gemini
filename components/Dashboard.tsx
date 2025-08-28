
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { ProjectSetup } from './ProjectSetup';
import { CoderIcon } from './icons/CoderIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CodeIcon } from './icons/CodeIcon';

const ProjectActions: React.FC<{
  onDelete: () => void;
  onClose: () => void;
  onRename: () => void;
}> = ({ onDelete, onClose, onRename }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute top-10 right-4 w-40 bg-light-panel dark:bg-dark-panel/80 backdrop-blur-sm rounded-md shadow-2xl border border-light-border dark:border-dark-border z-10 p-1"
    >
       <button 
        onClick={onRename}
        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-slate-100 dark:hover:bg-black/20 rounded-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
        Rename
      </button>
      <button 
        disabled
        title="Coming soon"
        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary rounded-sm transition-colors cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        Duplicate
      </button>
      <div className="h-px bg-light-border dark:bg-dark-border my-1 mx-1"></div>
      <button 
        onClick={onDelete}
        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-light-error dark:text-dark-error hover:bg-red-500/10 rounded-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        Delete
      </button>
    </motion.div>
  );
};


const ProjectCard: React.FC<{ project: Project; onSelect: (id: string) => void; onDelete: (id: string) => void; onRename: (id: string, newName: string) => void; }> = ({ project, onSelect, onDelete, onRename }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(project.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const isGenerating = project.status === 'GENERATING';

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const handleRename = () => {
        if (newName.trim() && newName.trim() !== project.name) {
            onRename(project.id, newName.trim());
        } else {
             setNewName(project.name);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            setNewName(project.name);
            setIsEditing(false);
        }
    };

    const getStatusChip = (status: Project['status']) => {
        switch(status) {
            case 'GENERATING': return <div className="px-2 py-0.5 text-xs font-medium text-amber-200 bg-amber-500/10 rounded-full border border-amber-500/20">Generating</div>;
            case 'COMPLETED': return <div className="px-2 py-0.5 text-xs font-medium text-green-200 bg-green-500/10 rounded-full border border-green-500/20">Completed</div>;
            case 'ERROR': return <div className="px-2 py-0.5 text-xs font-medium text-red-200 bg-red-500/10 rounded-full border border-red-500/20">Error</div>;
            default: return null;
        }
    }
    
    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(prev => !prev);
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`group relative bg-light-panel dark:bg-dark-panel p-4 rounded-lg border-2 transition-all duration-300 ${isGenerating ? 'border-dark-accent-primary animate-border-pulse' : 'border-light-border dark:border-dark-border hover:border-dark-accent-primary'}`}
            style={{ boxShadow: isGenerating ? '0 0 20px rgba(249, 115, 22, 0.2)' : 'none' }}
        >
            <div 
                className="h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-dark-accent-primary/10 rounded-md transition-colors">
                        <CoderIcon className="w-6 h-6 text-dark-accent-primary"/>
                    </div>
                    {getStatusChip(project.status)}
                </div>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md py-0 px-1 mb-1 font-semibold text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-dark-accent-primary focus:outline-none"
                    />
                ) : (
                    <h3 onClick={() => onSelect(project.id)} className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-1 truncate group-hover:text-dark-accent-primary transition-colors cursor-pointer">{project.name}</h3>
                )}
              </div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-4">
                  Created: {project.createdAt.toLocaleDateString()}
              </p>
            </div>
             <button 
                onClick={handleMenuClick} 
                aria-label="More options"
                className="absolute top-3 right-3 p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-slate-200 dark:hover:bg-black/20"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
             </button>
             <AnimatePresence>
              {isMenuOpen && <ProjectActions onClose={() => setIsMenuOpen(false)} onDelete={() => onDelete(project.id)} onRename={() => { setIsEditing(true); setIsMenuOpen(false); }} />}
             </AnimatePresence>
        </motion.div>
    );
}

interface DashboardProps {
  projects: Project[];
  activeView: 'dashboard' | 'my-apps';
  onNewProject: (description: string) => void;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, activeView, onNewProject, onSelectProject, onDeleteProject, onRenameProject }) => {
  const [isCreating, setIsCreating] = useState(false);
  const isLoading = projects.some(p => p.status === 'GENERATING');

  const showProjectSetup = isCreating || (activeView === 'dashboard' && projects.length === 0 && !isLoading);

  if (showProjectSetup) {
      return <ProjectSetup onGenerate={(desc) => {
          onNewProject(desc);
          setIsCreating(false);
      }} isLoading={isLoading} />
  }
  
  if (activeView === 'my-apps' && projects.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center text-center p-4 h-full animate-fade-in">
            <div className="max-w-3xl w-full bg-light-panel dark:bg-dark-panel/80 backdrop-blur-md p-8 rounded-xl border border-light-border dark:border-dark-border shadow-xl">
                 <div className="p-4 bg-dark-accent-primary/10 rounded-full mb-4 inline-block">
                    <CodeIcon className="w-12 h-12 text-dark-accent-primary"/>
                </div>
                <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">No Completed Apps Yet</h2>
                <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                    Apps you successfully generate will appear here.
                </p>
            </div>
        </div>
      );
  }


  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {activeView === 'dashboard' ? 'My Projects' : 'My Apps'}
            </h2>
            {activeView === 'dashboard' && (
              <motion.button 
                  onClick={() => setIsCreating(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-dark-accent-primary hover:bg-dark-accent-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20"
              >
                  <PlusIcon className="w-5 h-5" />
                  New Project
              </motion.button>
            )}
        </div>
        
        {projects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
                {projects.map(p => (
                    <ProjectCard key={p.id} project={p} onSelect={onSelectProject} onDelete={onDeleteProject} onRename={onRenameProject} />
                ))}
            </motion.div>
        ) : (
           <div/> // Should not be reached due to the other checks
        )}
    </div>
  );
};