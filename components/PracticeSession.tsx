
import React, { useState, useRef, useEffect } from 'react';
import { TrainingScenario, FeedbackData } from '../types';
import { Icons } from '../constants';
import { transcribeAudio } from '../services/siliconflow';
import { generateFeedback } from '../services/gemini';

interface PracticeSessionProps {
  scenario: TrainingScenario;
  token: string;
  onExit: () => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ scenario, token, onExit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processRecording(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setTimer(0);
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    }
  };

  const processRecording = async (blob: Blob) => {
    if (!token) {
      setError("SiliconFlow API Token is missing. Please check settings.");
      return;
    }

    setIsProcessing(true);
    try {
      const text = await transcribeAudio(blob, token);
      setTranscription(text);
      const feedbackData = await generateFeedback(text, scenario.prompt, scenario.title);
      setFeedback(feedbackData);
    } catch (err: any) {
      setError(err.message || "Failed to process speech. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onExit}
          className="px-6 py-2 border-2 border-black rounded-full bg-white neo-shadow-sm neo-shadow-active font-bold"
        >
          ← Back
        </button>
        <div className="px-6 py-2 border-2 border-black rounded-full bg-[#E9F59D] font-bold">
          {scenario.title}
        </div>
      </div>

      {!feedback ? (
        <div className="bg-white border-2 border-black rounded-[24px] p-8 neo-shadow text-center">
          <h2 className="text-3xl font-bold mb-4">Master This Scenario</h2>
          <p className="text-gray-600 mb-10 max-w-md mx-auto">{scenario.description}</p>
          
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-mono font-bold mb-8 ${isRecording ? 'text-[#F0642F]' : 'text-black'}`}>
              {formatTime(timer)}
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-24 h-24 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                isRecording ? 'bg-[#F0642F] animate-pulse' : 'bg-[#E9F59D] neo-shadow neo-shadow-active'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? <div className="w-8 h-8 bg-white border-2 border-black rounded-sm" /> : <Icons.Mic />}
            </button>
            
            <p className="mt-6 font-bold uppercase tracking-widest text-sm">
              {isProcessing ? 'AI is thinking...' : isRecording ? 'Recording... click to stop' : 'Click to start speaking'}
            </p>
          </div>

          {error && (
            <div className="mt-8 p-4 bg-[#F0642F]/10 border-2 border-[#F0642F] rounded-[20px] text-[#F0642F] font-bold">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border-2 border-black p-8 rounded-[24px] neo-shadow">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="w-3 h-3 bg-[#F0642F] rounded-full"></span>
                 Transcription
               </h3>
               <p className="italic text-gray-700 leading-relaxed">"{transcription}"</p>
            </div>
            
            <div className="bg-[#E9F59D] border-2 border-black p-8 rounded-[24px] neo-shadow flex flex-col items-center justify-center">
              <span className="text-sm font-bold uppercase mb-2">Speaking Score</span>
              <span className="text-6xl font-black">{feedback.score}</span>
              <span className="text-xs font-bold mt-2">OUT OF 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-black p-8 rounded-[24px] neo-shadow">
              <h4 className="font-black text-xl mb-4 uppercase">Analysis</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-bold text-[#F0642F]">Clarity</h5>
                  <p className="text-sm text-gray-700">{feedback.clarity}</p>
                </div>
                <div>
                  <h5 className="font-bold text-[#F0642F]">Logic & Flow</h5>
                  <p className="text-sm text-gray-700">{feedback.logic}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-black p-8 rounded-[24px] neo-shadow">
              <h4 className="font-black text-xl mb-4 uppercase">Suggestions</h4>
              <ul className="space-y-2">
                {feedback.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
                    <span className="mt-1"><Icons.Check /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-[24px] neo-shadow border-2 border-black">
            <h4 className="font-black text-xl mb-4 uppercase text-[#E9F59D]">The Pro Version</h4>
            <p className="leading-relaxed opacity-90">{feedback.improvedVersion}</p>
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={() => {
                setFeedback(null);
                setTranscription(null);
                setTimer(0);
              }}
              className="px-10 py-4 bg-[#E9F59D] border-2 border-black rounded-full font-bold uppercase neo-shadow neo-shadow-active flex items-center gap-2"
            >
              <Icons.Refresh /> Practice Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSession;
