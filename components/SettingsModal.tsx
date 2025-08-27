
import React from 'react';
import type { Settings } from '../types';

interface SettingsModalProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, setSettings, onClose }) => {
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, temperature: parseFloat(e.target.value) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-light-panel dark:bg-dark-panel rounded-xl shadow-2xl p-8 w-full max-w-md border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">API Key</label>
            <div className="flex items-center space-x-2 bg-light-bg dark:bg-dark-bg p-3 rounded-md border border-light-border dark:border-dark-border">
              <span className="text-green-400">●</span>
              <span className="font-mono text-sm">Securely Configured</span>
            </div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-md">
              For security, the Google Gemini API key is managed via an environment variable. It cannot be viewed or edited here.
            </p>
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">AI Model</label>
            <select
                id="model"
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full bg-light-bg dark:bg-dark-bg p-3 rounded-md border border-light-border dark:border-dark-border focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
            >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            </select>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">Only compatible models are shown.</p>
          </div>

          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Temperature: <span className="font-bold text-light-accent dark:text-dark-accent">{settings.temperature.toFixed(2)}</span>
            </label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={handleTemperatureChange}
              className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-light-accent dark:accent-dark-accent"
            />
             <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">Controls randomness. Lower is more deterministic, higher is more creative.</p>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-light-accent dark:bg-dark-accent hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
