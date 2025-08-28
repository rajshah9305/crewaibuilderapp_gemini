
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const CodePreview: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full bg-light-panel dark:bg-dark-bg/50 rounded-lg flex flex-col overflow-hidden border border-light-border dark:border-dark-border">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 bg-slate-800/50 hover:bg-slate-700 text-white dark:text-dark-text-secondary text-xs font-bold py-1 px-3 rounded-md transition-colors disabled:opacity-50 backdrop-blur-sm"
        disabled={!code}
        aria-label="Copy code to clipboard"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="h-full w-full overflow-auto">
        <SyntaxHighlighter
            language="html"
            style={atomOneDark}
            customStyle={{
                margin: 0,
                backgroundColor: 'transparent',
                height: '100%',
                padding: '1.25rem 1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5rem',
            }}
            codeTagProps={{
                style: {
                    fontFamily: "'JetBrains Mono', monospace",
                },
            }}
            showLineNumbers
        >
            {code || '// Code will be generated here...'}
        </SyntaxHighlighter>
      </div>
      <style>{`
        .dark .hljs { background-color: transparent !important; color: #e2e8f0; }
        .light .hljs { background-color: #ffffff !important; color: #000000; }
        .dark .hljs-comment, .dark .hljs-quote { color: #94a3b8; }
        .light .hljs-comment, .light .hljs-quote { color: #64748b; }
        .dark .hljs-tag, .dark .hljs-string { color: #818cf8; } /* Indigo-400 */
        .light .hljs-tag, .light .hljs-string { color: #6366f1; } /* Indigo-600 */

      `}</style>
    </div>
  );
};