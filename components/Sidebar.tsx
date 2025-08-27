
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardIcon } from './icons/DashboardIcon';
import { CodeIcon } from './icons/CodeIcon';
import { ThemeToggle } from './ThemeToggle';
import { CogIcon } from './icons/CogIcon';

interface ProfilePopoverProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onOpenSettings: () => void;
  onClose: () => void;
  onSignOut: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({ theme, setTheme, onOpenSettings, onClose, onSignOut }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSignOut = () => {
    onClose();
    onSignOut();
  };

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-20 left-4 w-60 bg-light-panel dark:bg-dark-panel/80 backdrop-blur-md rounded-xl shadow-2xl border border-light-border dark:border-dark-border z-10 p-2"
    >
      <div className="p-2">
        <p className="font-bold text-light-text-primary dark:text-dark-text-primary">Jane Doe</p>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">jane.doe@example.com</p>
      </div>
      <div className="h-px bg-light-border dark:bg-dark-border my-1"></div>
      <div className="p-2 flex items-center justify-between">
        <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Theme</span>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <button 
        onClick={onOpenSettings}
        className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-sm text-light-text-primary dark:text-dark-text-primary"
      >
        <CogIcon className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
        Settings
      </button>
      <div className="h-px bg-light-border dark:bg-dark-border my-1"></div>
       <button onClick={handleSignOut} className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-sm text-light-text-primary dark:text-dark-text-primary">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Sign Out
      </button>
    </motion.div>
  );
};


interface SidebarProps {
  activeView: 'dashboard' | 'my-apps';
  onNavigate: (view: 'dashboard' | 'my-apps') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, theme, setTheme, onOpenSettings, onSignOut }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <div className="w-20 bg-light-panel dark:bg-dark-bg p-4 flex flex-col items-center justify-between relative border-r border-light-border dark:border-dark-border">
      <div>
        <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-10 h-10 bg-light-accent dark:bg-dark-accent rounded-lg flex items-center justify-center mb-12 shadow-lg" 
            title="CrewAI App Weaver">
           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </motion.div>
        <nav className="flex flex-col items-center space-y-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`p-3 rounded-lg transition-colors duration-200 ${activeView === 'dashboard' ? 'bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent' : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-panel hover:text-light-text-primary dark:hover:text-white'}`}
            title="Dashboard"
          >
            <DashboardIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => onNavigate('my-apps')}
            className={`p-3 rounded-lg transition-colors duration-200 ${activeView === 'my-apps' ? 'bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent' : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-panel hover:text-light-text-primary dark:hover:text-white'}`}
            title="My Apps"
          >
            <CodeIcon className="w-6 h-6" />
          </button>
        </nav>
      </div>
      <div>
         <AnimatePresence>
          {isPopoverOpen && <ProfilePopover theme={theme} setTheme={setTheme} onOpenSettings={onOpenSettings} onClose={() => setIsPopoverOpen(false)} onSignOut={onSignOut} />}
        </AnimatePresence>
        <button onClick={() => setIsPopoverOpen(prev => !prev)} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-light-panel dark:ring-offset-dark-bg ring-slate-300 dark:ring-slate-700 hover:ring-light-accent dark:hover:ring-dark-accent transition-all">
          <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar" />
        </button>
      </div>
    </div>
  );
};
