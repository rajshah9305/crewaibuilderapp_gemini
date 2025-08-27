
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AgentWorkflow } from './components/AgentWorkflow';
import { CodePreview } from './components/CodePreview';
import { AppPreview } from './components/AppPreview';
import { SettingsModal } from './components/SettingsModal';
import { AppState, AgentLog, Settings, Project } from './types';
import { generateApp } from './services/geminiService';

type Theme = 'light' | 'dark';
type View = 'dashboard' | 'my-apps';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    model: 'gemini-2.5-flash',
    temperature: 0.7,
  });
  const [theme, setTheme] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState<'workflow' | 'code'>('workflow');
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
  };

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name: newName } : p
    ));
  };
  
  const handleNavigate = (view: View) => {
    setActiveView(view);
    setActiveProjectId(null);
  };
  
  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out? This will clear all your current projects.')) {
        setProjects([]);
        setActiveProjectId(null);
        setActiveView('dashboard');
    }
  };

  const handleGenerate = useCallback(async (description: string) => {
    if (!description.trim()) {
      alert('Please enter a project description.');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: 'New Project...',
      description,
      agentLogs: [{ agent: 'SYSTEM', message: 'Project initialized. Starting agent workflow...', timestamp: new Date() }],
      generatedCode: '',
      status: AppState.GENERATING,
      createdAt: new Date(),
    };
    
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setActiveTab('workflow');

    try {
      const stream = await generateApp(description, settings);
      let codeBuffer = '';
      let isCodeBlock = false;

      for await (const chunk of stream) {
        setProjects(prev => prev.map(p => {
            if (p.id !== newProject.id) return p;

            let updatedLogs = [...p.agentLogs];
            let updatedCode = p.generatedCode;
            let updatedName = p.name;

            if (chunk.startsWith('NAME:')) {
                updatedName = chunk.replace('NAME:', '').trim();
                return { ...p, name: updatedName }; // Update name and skip log
            }

            if (chunk.includes('[FINAL_CODE_START]')) {
              isCodeBlock = true;
              const parts = chunk.split('[FINAL_CODE_START]');
              updatedLogs = [...updatedLogs, { agent: 'SYSTEM', message: 'Final code generation started.', timestamp: new Date() }];
              codeBuffer += parts[1] || '';
            } else if (chunk.includes('[FINAL_CODE_END]')) {
              isCodeBlock = false;
              const parts = chunk.split('[FINAL_CODE_END]');
              codeBuffer += parts[0] || '';
              updatedCode = codeBuffer;
            } else if (isCodeBlock) {
              codeBuffer += chunk;
              updatedCode = codeBuffer;
            } else {
                const agentMatch = chunk.match(/^(RESEARCHER|CODER|REVIEWER|SYSTEM):/);
                if (agentMatch) {
                    const agent = agentMatch[1] as AgentLog['agent'];
                    const message = chunk.replace(/^(RESEARCHER|CODER|REVIEWER|SYSTEM):\s*/, '');
                    updatedLogs = [...updatedLogs, { agent, message, timestamp: new Date() }];
                } else {
                    const lastLog = updatedLogs[updatedLogs.length - 1];
                    if (lastLog && !isCodeBlock) {
                        updatedLogs[updatedLogs.length - 1] = {...lastLog, message: lastLog.message + chunk };
                    } else if (!isCodeBlock) {
                        updatedLogs = [{ agent: 'SYSTEM', message: chunk, timestamp: new Date() }];
                    }
                }
            }
            return { ...p, agentLogs: updatedLogs, generatedCode: updatedCode, name: updatedName };
        }));
      }

      setProjects(prev => prev.map(p => p.id === newProject.id ? { ...p, status: AppState.COMPLETED } : p));
      setActiveTab('code');

    } catch (error) {
      const errorMessage = `An error occurred: ${error instanceof Error ? error.message : String(error)}`;
      setProjects(prev => prev.map(p => p.id === newProject.id ? { 
          ...p, 
          status: AppState.ERROR,
          agentLogs: [...p.agentLogs, { agent: 'SYSTEM', message: errorMessage, type: 'ERROR', timestamp: new Date() }] 
      } : p));
    }
  }, [settings]);

  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const displayedProjects = activeView === 'my-apps'
    ? projects.filter(p => p.status === AppState.COMPLETED)
    : projects;

  const renderWorkspace = (project: Project) => {
    const tabs = ['workflow', 'code'];
    return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col xl:flex-row gap-6 h-full"
    >
      <div className="bg-light-panel dark:bg-dark-panel rounded-xl shadow-lg border border-light-border dark:border-dark-border flex flex-col xl:w-1/2 h-full">
         <div className="p-3 border-b border-light-border dark:border-dark-border flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">Development</h2>
            <div className="flex space-x-1 bg-slate-200/50 dark:bg-dark-bg rounded-lg p-1">
               {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'workflow' | 'code')}
                        className={`relative px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeTab !== tab ? 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-white/50 dark:hover:bg-white/5' : ''}`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute inset-0 bg-light-accent dark:bg-dark-accent rounded-md z-0 shadow"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className={`relative z-10 capitalize transition-colors ${activeTab === tab ? 'text-white' : ''}`}>
                          {tab}
                        </span>
                    </button>
                ))}
            </div>
          </div>
        <div className="flex-grow overflow-hidden p-4">
           {activeTab === 'workflow' && <AgentWorkflow logs={project.agentLogs} status={project.status} />}
           {activeTab === 'code' && <CodePreview code={project.generatedCode} />}
        </div>
      </div>
      <div className="bg-light-panel dark:bg-dark-panel rounded-xl shadow-lg border border-light-border dark:border-dark-border flex flex-col xl:w-1/2 h-full">
         <div className="flex-grow p-1 sm:p-2 md:p-4">
            <AppPreview code={project.generatedCode} />
         </div>
      </div>
    </motion.div>
    );
  };
  
  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary font-sans transition-colors duration-300">
      <Sidebar 
        activeView={activeView}
        onNavigate={handleNavigate} 
        theme={theme}
        setTheme={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSignOut={handleSignOut}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            projectName={activeProject?.name}
            projectStatus={activeProject?.status}
            onBack={() => setActiveProjectId(null)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeProject ? renderWorkspace(activeProject) : (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    <Dashboard
                        projects={displayedProjects}
                        activeView={activeView}
                        onNewProject={handleGenerate}
                        onSelectProject={setActiveProjectId}
                        onDeleteProject={handleDeleteProject}
                        onRenameProject={handleRenameProject}
                    />
                </motion.div>
            )}
           </AnimatePresence>
        </main>
      </div>
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
