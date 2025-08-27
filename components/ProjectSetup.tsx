
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectSetupProps {
  onGenerate: (description: string) => void;
  isLoading: boolean;
}

export const ProjectSetup: React.FC<ProjectSetupProps> = ({ onGenerate, isLoading }) => {
    const [description, setDescription] = useState('');
    const examples = [
        "A Pomodoro timer with start, stop, and reset buttons.",
        "A simple markdown note-taking app with a live preview.",
        "An app that fetches and displays a random user from an API.",
        "A weather app that shows the current temperature for a city."
    ];

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-light-panel dark:bg-dark-panel p-8 rounded-xl border border-light-border dark:border-dark-border shadow-2xl"
       >
        <h2 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">Create a New Project</h2>
        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8">
          Describe the application you want the AI agents to build. Be as specific as you can!
        </p>
        <div className="relative w-full mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A simple to-do list application with the ability to add and remove tasks..."
            className="w-full h-40 p-4 font-mono text-base bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg resize-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none transition-all"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={() => onGenerate(description)}
          disabled={isLoading || !description.trim()}
          className="w-full bg-light-accent dark:bg-dark-accent hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center shadow-lg disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Weave My App'
          )}
        </button>
        <div className="mt-8 text-left">
            <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-3">Need inspiration? Try one of these:</h3>
            <div className="flex flex-wrap gap-2">
                {examples.map((ex, i) => (
                    <button 
                        key={i} 
                        onClick={() => !isLoading && setDescription(ex)} 
                        className="text-sm text-left py-1 px-3 bg-light-bg dark:bg-dark-bg hover:bg-slate-200 dark:hover:bg-slate-800/80 rounded-full text-light-text-secondary dark:text-dark-text-secondary transition-colors disabled:opacity-50 border border-light-border dark:border-dark-border" 
                        disabled={isLoading}
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
};