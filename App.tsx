
import React, { useState, useEffect } from 'react';
import { TrainingScenario, AppSettings } from './types';
import { SCENARIOS, Icons } from './constants';
import ScenarioCard from './components/ScenarioCard';
import PracticeSession from './components/PracticeSession';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('speechcraft_settings');
    return saved ? JSON.parse(saved) : { siliconFlowToken: '' };
  });

  useEffect(() => {
    localStorage.setItem('speechcraft_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSaveToken = (token: string) => {
    setSettings({ siliconFlowToken: token });
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-black pb-20">
      {/* Navbar */}
      <nav className="border-b-2 border-black py-6 px-4 mb-12 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F0642F] border-2 border-black rounded-[12px] flex items-center justify-center neo-shadow-sm">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">SpeechCraft AI</h1>
          </div>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center neo-shadow-sm neo-shadow-active bg-[#E9F59D]"
          >
            <Icons.Settings />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4">
        {!selectedScenario ? (
          <>
            <section className="mb-12">
              <div className="bg-[#E9F59D] border-2 border-black p-10 rounded-[24px] neo-shadow relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-5xl font-black mb-4 leading-tight">LEVEL UP YOUR<br/>ELOCUTION.</h2>
                  <p className="text-lg font-medium opacity-80 mb-8">
                    Select a scenario, record your speech, and get instant, 
                    Gemini-powered feedback on your clarity, logic, and persuasion.
                  </p>
                  {!settings.siliconFlowToken && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0642F] text-white border-2 border-black rounded-full font-bold text-sm animate-bounce cursor-pointer" onClick={() => setShowSettings(true)}>
                      ⚠️ Setup API Token First
                    </div>
                  )}
                </div>
                {/* Decorative geometry */}
                <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-[#F0642F] rounded-full border-4 border-black opacity-20 translate-x-1/4 -translate-y-1/4"></div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">Practice Scenarios</h3>
                <div className="flex-1 h-[2px] bg-black"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SCENARIOS.map((scenario) => (
                  <ScenarioCard 
                    key={scenario.id} 
                    scenario={scenario} 
                    onSelect={setSelectedScenario} 
                  />
                ))}
              </div>
            </section>

            <section className="mt-20 flex flex-col items-center">
                <div className="w-16 h-1 bg-black mb-6"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-center opacity-60">
                    Neo-Brutalist Minimalism • Powered by Gemini & SiliconFlow
                </p>
            </section>
          </>
        ) : (
          <PracticeSession 
            scenario={selectedScenario} 
            token={settings.siliconFlowToken}
            onExit={() => setSelectedScenario(null)} 
          />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <Settings 
          onClose={() => setShowSettings(false)} 
          token={settings.siliconFlowToken}
          onSave={handleSaveToken}
        />
      )}
    </div>
  );
};

export default App;
