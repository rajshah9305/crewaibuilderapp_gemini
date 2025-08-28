
import React from 'react';
import { motion } from 'framer-motion';
import { AiAvatar } from './AiAvatar';

interface WelcomeScreenProps {
  onFinish: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      className="flex flex-col items-center justify-center h-screen bg-light-bg dark:bg-dark-bg text-center p-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
      >
        <AiAvatar />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl font-extrabold text-light-text-primary dark:text-dark-text-primary mt-8"
      >
        Welcome to CrewAI App Weaver
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
        className="text-lg sm:text-xl text-light-text-secondary dark:text-dark-text-secondary mt-4 max-w-2xl"
      >
        Your personal AI-powered application factory. Let's build something amazing together.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
        className="mt-12"
      >
        <motion.button
          onClick={onFinish}
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="bg-dark-accent-primary hover:bg-dark-accent-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg shadow-orange-500/30"
        >
          Begin
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
