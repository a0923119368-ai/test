
export enum TrainingMode {
  STORYTELLING = 'Storytelling',
  LOGICAL_REASONING = 'Logical Reasoning',
  PERSUASION = 'Persuasion',
  DAILY_CHAT = 'Daily Social',
  INTERVIEW = 'Interview Prep'
}

export interface TrainingScenario {
  id: string;
  mode: TrainingMode;
  title: string;
  description: string;
  prompt: string;
}

export interface TranscriptionResponse {
  text: string;
}

export interface FeedbackData {
  score: number;
  clarity: string;
  logic: string;
  suggestions: string[];
  improvedVersion: string;
}

export interface AppSettings {
  siliconFlowToken: string;
}
