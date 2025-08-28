
import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-between w-14 h-8 rounded-full p-1 transition-colors bg-slate-200 dark:bg-black/20`}
      aria-label="Toggle theme"
    >
      <SunIcon className="w-5 h-5 text-yellow-500" />
      <MoonIcon className="w-5 h-5 text-slate-400" />
      <motion.div
        className="absolute w-6 h-6 bg-white dark:bg-slate-700 rounded-full shadow-md"
        initial={{ x: theme === 'dark' ? 14 : -14 }}
        animate={{ x: theme === 'dark' ? 14 : -14 }}
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
    </button>
  );
};