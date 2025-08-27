export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface AgentLog {
  agent: 'RESEARCHER' | 'CODER' | 'REVIEWER' | 'SYSTEM';
  message: string;
  type?: 'INFO' | 'ERROR';
  timestamp: Date;
}

export interface Settings {
  model: string;
  temperature: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  agentLogs: AgentLog[];
  generatedCode: string;
  status: AppState;
  createdAt: Date;
}