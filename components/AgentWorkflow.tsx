
import React, { useEffect, useRef, useState } from 'react';
// FIX: Import AppState as a value for runtime access, and AgentLog as a type.
import { AppState, type AgentLog } from '../types';
import { ResearcherIcon } from './icons/AgentIcon';
import { CoderIcon } from './icons/CoderIcon';
import { ReviewerIcon } from './icons/ReviewerIcon';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { motion } from 'framer-motion';

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark-error" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const SystemIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark-accent-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.86 6.17H4.99c-1.66 0-2.34 2.01-1.08 3.07L6.66 11.5l-1.5 2.88c-.65 1.26.6 2.5 1.84 1.73L10 14.54l2.99 1.57c1.25.66 2.5-.47 1.85-1.73l-1.5-2.88 2.75-2.25c1.26-1.06.58-3.07-1.08-3.07h-2.87l-.65-3.01z" clipRule="evenodd" /></svg>
);

const AgentInfoMap = {
  RESEARCHER: { icon: <ResearcherIcon className="w-6 h-6" />, label: 'Researcher', color: 'text-blue-400' },
  CODER: { icon: <CoderIcon className="w-6 h-6" />, label: 'Coder', color: 'text-purple-400' },
  REVIEWER: { icon: <ReviewerIcon className="w-6 h-6" />, label: 'Reviewer', color: 'text-green-400' },
  SYSTEM: { icon: <SystemIcon />, label: 'System', color: 'text-dark-accent-primary' },
};

const CodeBlock: React.FC<{ log: AgentLog }> = ({ log }) => {
    const [copied, setCopied] = useState(false);
    const codeContentRef = useRef('');

    const isCodeBlock = log.message.trim().startsWith('```') && log.message.trim().endsWith('```');
    let codeContent = '';
    let language = 'text';

    if (isCodeBlock) {
        const content = log.message.trim().slice(3, -3);
        const firstLineBreak = content.indexOf('\n');
        const firstLine = content.substring(0, firstLineBreak).trim();
        
        if (firstLine && !firstLine.includes(' ')) { // Heuristic for language identifier
            language = firstLine;
            codeContent = content.substring(firstLineBreak + 1);
        } else {
            language = 'javascript'; // Default language
            codeContent = content;
        }
        codeContentRef.current = codeContent;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(codeContentRef.current.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isCodeBlock) {
       return <p className="text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap text-sm font-mono leading-relaxed">{log.message}</p>
    }

    return (
        <div className="relative">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 z-10 bg-slate-800/50 hover:bg-slate-700 text-white dark:text-dark-text-secondary text-xs font-bold py-1 px-3 rounded-md transition-colors backdrop-blur-sm"
                aria-label="Copy code to clipboard"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <SyntaxHighlighter
                language={language}
                style={atomOneDark}
                customStyle={{
                    margin: 0,
                    backgroundColor: 'rgba(10, 10, 10, 0.5)',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    width: '100%',
                    overflowX: 'auto',
                    borderRadius: '0.5rem',
                }}
                codeTagProps={{
                    style: { fontFamily: "'JetBrains Mono', monospace" },
                }}
            >
                {codeContent.trim()}
            </SyntaxHighlighter>
        </div>
    );
};


export const AgentWorkflow: React.FC<{ logs: AgentLog[], status: AppState }> = ({ logs, status }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto pr-4 -mr-4">
      <div className="relative pl-8">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-light-border dark:bg-dark-border" aria-hidden="true">
            <div className="absolute top-0 w-full h-full bg-dark-accent-primary/50 animate-glow [animation-duration:4s]" />
        </div>
        <div className="space-y-8">
          {logs.map((log, index) => {
            const isError = log.type === 'ERROR';
            const agentInfo = AgentInfoMap[log.agent];
            const isLastLog = index === logs.length - 1;
            const isGenerating = status === AppState.GENERATING;
            
            const timestamp = log.timestamp 
                ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '';

            return (
              <motion.div 
                key={index} 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="absolute -left-[25px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-light-bg dark:bg-dark-bg">
                    <div className={`flex-shrink-0 p-1.5 rounded-full ring-4 ring-light-bg dark:ring-dark-bg ${isError ? 'bg-dark-error/20' : 'bg-light-panel dark:bg-dark-panel'}`}>
                        {isError ? <ErrorIcon /> : agentInfo.icon}
                    </div>
                </div>
                <div className="ml-8">
                    <div className="flex justify-between items-center mb-2">
                      <p className={`font-bold text-sm ${isError ? 'text-dark-error' : `${agentInfo.color}`}`}>{isError ? 'Error' : agentInfo.label}</p>
                      {timestamp && <span className="text-xs text-dark-text-secondary font-mono">{timestamp}</span>}
                    </div>
                    <div className={`p-4 rounded-lg border ${isError ? 'bg-dark-error/10 border-dark-error/20' : 'bg-dark-panel/50 border-light-border dark:border-dark-border'}`}>
                      <CodeBlock log={log} />
                      {isLastLog && isGenerating && !isError && (
                          <div className="flex items-center space-x-1.5 mt-3">
                              <div className="w-2 h-2 bg-dark-accent-primary rounded-full animate-pulse-fast" style={{ animationDelay: '0s' }}></div>
                              <div className="w-2 h-2 bg-dark-accent-primary rounded-full animate-pulse-fast" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-dark-accent-primary rounded-full animate-pulse-fast" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                      )}
                    </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
       <style>{`
        .dark .hljs { background-color: transparent !important; color: #e2e8f0 }
        .light .hljs { background-color: #ffffff !important; color: #000000 }
        .dark .hljs-comment, .dark .hljs-quote { color: #94a3b8; }
        .light .hljs-comment, .light .hljs-quote { color: #64748b; }
      `}</style>
    </div>
  );
};