
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from './icons/SparklesIcon';

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
    <div className="flex flex-col items-center justify-center text-center p-4 h-full animate-fade-in">
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-light-panel dark:bg-dark-panel/80 backdrop-blur-md p-12 rounded-2xl border border-light-border dark:border-dark-border shadow-2xl"
       >
        <h2 className="text-5xl font-extrabold text-light-text-primary dark:text-dark-text-primary mb-4">Create a New Project</h2>
        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-10 max-w-2xl mx-auto">
          Describe the application you want the AI agents to build. Be as specific as you can!
        </p>
        <div className="relative w-full mb-6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A simple to-do list application with the ability to add and remove tasks..."
            className="w-full h-40 p-4 font-mono text-base bg-light-bg dark:bg-dark-bg/50 border-2 border-light-border dark:border-dark-border rounded-lg resize-none focus:ring-2 focus:ring-dark-accent-primary focus:border-dark-accent-primary dark:focus:bg-dark-panel focus:outline-none transition-all duration-300"
            disabled={isLoading}
          />
        </div>
        <motion.button
          onClick={() => onGenerate(description)}
          disabled={isLoading || !description.trim()}
          whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-full bg-dark-accent-primary hover:bg-dark-accent-primary-hover text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center shadow-lg shadow-orange-500/20 disabled:shadow-none"
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
            <>
              <SparklesIcon className="w-6 h-6 mr-3" />
              Weave My App
            </>
          )}
        </motion.button>
        <div className="mt-10 text-left">
            <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-3">Need inspiration? Try one of these:</h3>
            <div className="flex flex-wrap gap-3">
                {examples.map((ex, i) => (
                    <button 
                        key={i} 
                        onClick={() => !isLoading && setDescription(ex)} 
                        className="text-sm text-left py-2 px-4 bg-light-bg dark:bg-dark-bg/50 hover:bg-slate-200 dark:hover:bg-black/30 rounded-full text-light-text-secondary dark:text-dark-text-secondary transition-all duration-200 disabled:opacity-50 border border-light-border dark:border-dark-border hover:border-dark-accent-primary dark:hover:border-dark-accent-primary hover:text-light-text-primary dark:hover:text-dark-text-primary" 
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