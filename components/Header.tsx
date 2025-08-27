
import React from 'react';
import type { AppState } from '../types';
import { motion } from 'framer-motion';

const StatusIndicator: React.FC<{ status: AppState }> = ({ status }) => {
    switch(status) {
        case 'GENERATING': 
            return (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-500 dark:text-amber-400">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </div>
            );
        case 'COMPLETED': 
            return (
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>Completed</span>
              </div>
            );
        case 'ERROR': 
            return (
              <div className="flex items-center gap-1.5 text-xs font-medium text-light-error dark:text-dark-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>Error</span>
              </div>
            );
        default: return null;
    }
}


interface HeaderProps {
    projectName?: string;
    projectStatus?: AppState;
    onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ projectName, projectStatus, onBack }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-light-border dark:border-dark-border flex-shrink-0 bg-light-bg/80 dark:bg-dark-panel/50 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        {projectName && (
           <motion.button 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             onClick={onBack} 
             title="Back to Projects" 
             className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors flex items-center gap-1"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             <span className="hidden sm:inline">Projects</span>
           </motion.button>
        )}
        {!projectName && (
          <div>
              <h1 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary transition-colors">Dashboard</h1>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary transition-colors">
                  Your personal AI-powered application factory
              </p>
          </div>
        )}
      </div>
       {projectName && (
          <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
            className="text-right flex items-center gap-4"
          >
            <div>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Current Project</p>
              <h1 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary truncate max-w-[150px] sm:max-w-xs">{projectName}</h1>
            </div>
             {projectStatus && <StatusIndicator status={projectStatus} />}
          </motion.div>
        )}
    </header>
  );
};