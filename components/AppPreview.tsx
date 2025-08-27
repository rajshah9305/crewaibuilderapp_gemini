
import React, { useRef } from 'react';

const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" /></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

export const AppPreview: React.FC<{ code: string }> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Re-setting srcdoc is the standard way to reload an iframe's content
      iframeRef.current.srcdoc = iframeRef.current.srcdoc;
    }
  };

  const handleOpenInNewTab = () => {
    if (code) {
      try {
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // The URL is revoked automatically when the tab is closed by the browser
      } catch (error) {
        console.error("Failed to open preview in new tab:", error);
      }
    }
  };


  return (
    <div className="w-full h-full bg-light-panel dark:bg-dark-panel rounded-lg border border-light-border dark:border-dark-border overflow-hidden flex flex-col shadow-inner">
      <div className="flex-shrink-0 h-11 bg-slate-100 dark:bg-dark-bg flex items-center px-2 sm:px-3 border-b border-light-border dark:border-dark-border gap-1.5 sm:gap-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
        <div className="flex-1 text-center text-xs sm:text-sm font-mono text-light-text-secondary dark:text-dark-text-secondary bg-slate-200 dark:bg-dark-panel rounded-md px-2 sm:px-4 py-1.5 mx-1 sm:mx-2 truncate">
            app-preview.local
        </div>
        <div className="flex items-center space-x-1 text-light-text-secondary dark:text-dark-text-secondary">
          <button onClick={handleRefresh} title="Refresh Preview" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors" disabled={!code}>
            <RefreshIcon/>
          </button>
          <button onClick={handleOpenInNewTab} title="Open in new tab" className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors" disabled={!code}>
            <ExternalLinkIcon/>
          </button>
        </div>
      </div>
      
      <div className="flex-grow w-full h-full bg-white dark:bg-slate-200">
        {code ? (
          <iframe
              ref={iframeRef}
              srcDoc={code}
              title="App Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-modals allow-forms"
            />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg text-center p-4">
             <div className="p-4 bg-light-accent/10 dark:bg-dark-accent/10 rounded-full mb-4">
                <svg className="w-12 h-12 text-light-accent dark:text-dark-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Live App Preview</h3>
            <p className="max-w-sm text-light-text-secondary dark:text-dark-text-secondary">Your generated application will appear here once the AI agents complete their work.</p>
          </div>
        )}
      </div>
    </div>
  );
};