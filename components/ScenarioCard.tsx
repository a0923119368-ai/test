
import React from 'react';
import { TrainingScenario } from '../types';

interface ScenarioCardProps {
  scenario: TrainingScenario;
  onSelect: (scenario: TrainingScenario) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(scenario)}
      className="bg-white border-2 border-black p-6 rounded-[24px] cursor-pointer neo-shadow hover:translate-y-[-4px] transition-transform"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-[#E9F59D] border border-black rounded-full text-xs font-bold uppercase">
          {scenario.mode}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{scenario.description}</p>
      <div className="mt-6 flex justify-end">
        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
          →
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
