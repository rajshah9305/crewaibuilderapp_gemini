
import React from 'react';
import { motion } from 'framer-motion';

export const AiAvatar: React.FC = () => {
  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64">
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-dark-accent-primary rounded-full blur-2xl"
      />
      <motion.img
        src="https://storage.googleapis.com/aall-demos/crewai/avatar.png"
        alt="AI Avatar"
        className="relative w-full h-full object-cover rounded-full border-4 border-white/10 dark:border-white/20 shadow-2xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // A nice ease-out cubic bezier
          delay: 0.2,
        }}
      />
    </div>
  );
};
