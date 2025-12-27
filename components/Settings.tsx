
import React, { useState } from 'react';
import { Icons } from '../constants';

interface SettingsProps {
  onClose: () => void;
  token: string;
  onSave: (token: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, token, onSave }) => {
  const [inputValue, setInputValue] = useState(token);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#F5F2EA] border-2 border-black rounded-[24px] w-full max-w-md p-8 neo-shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">API Settings</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center neo-shadow-sm neo-shadow-active bg-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">SiliconFlow API Token</label>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your bearer token..."
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#F0642F] font-mono text-sm"
            />
            <p className="text-xs mt-2 text-gray-600">
              Get your token from <a href="https://cloud.siliconflow.cn/account/ak" target="_blank" className="underline font-bold">SiliconFlow Cloud</a>.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-[#E9F59D] border-2 border-black rounded-full font-bold uppercase tracking-wider neo-shadow-sm neo-shadow-active"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
