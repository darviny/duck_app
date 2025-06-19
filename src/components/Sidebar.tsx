import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

interface Message {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
}

interface RubricItem {
  title: string;
  description: string;
  score: number;
  suggestions: string[];
  evidence: string[];
}

interface SidebarProps {
  messages: Message[];
  currentTopic?: string;
  currentSubject?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ messages, currentTopic = "Distance Formula", currentSubject = "Linear Algebra" }) => {
  const [rubricItems, setRubricItems] = useState<RubricItem[]>([
    {
      title: 'Clarity',
      description: '',
      score: 0,
      suggestions: [],
      evidence: []
    },
    {
      title: 'Accuracy',
      description: '',
      score: 0,
      suggestions: [],
      evidence: []
    },
    {
      title: 'Engagement',
      description: '',
      score: 0,
      suggestions: [],
      evidence: []
    }
  ]);

  const [{ data, isLoading }, analyzeTranscript] = useAIGeneration("analyzeTranscript");

  const handleEvaluate = async () => {
    if (messages.length === 0) return;
    
    const transcript = JSON.stringify({
      session_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      topic: currentTopic,
      subject: currentSubject,
      transcript: messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        isUser: msg.isUser
      }))
    });

    console.log('Transcript being analyzed:', transcript);
    analyzeTranscript({ transcript });
  };

  // Update rubric items when data changes
  React.useEffect(() => {
    if (data) {
      console.log('Complete AI Response:', JSON.stringify(data, null, 2));
      
      // Filter suggestions by metric
      const claritySuggestions = (data.suggestions || [])
        .filter((s): s is string => s !== null && s.toLowerCase().includes('clarity'));
      const accuracySuggestions = (data.suggestions || [])
        .filter((s): s is string => s !== null && s.toLowerCase().includes('accuracy'));
      const engagementSuggestions = (data.suggestions || [])
        .filter((s): s is string => s !== null && s.toLowerCase().includes('engagement'));

      // Filter evidence by metric
      const clarityEvidence = (data.evidence || [])
        .filter((e): e is string => e !== null && e.toLowerCase().includes('clarity'));
      const accuracyEvidence = (data.evidence || [])
        .filter((e): e is string => e !== null && e.toLowerCase().includes('accuracy'));
      const engagementEvidence = (data.evidence || [])
        .filter((e): e is string => e !== null && e.toLowerCase().includes('engagement'));

      setRubricItems([
        {
          title: 'Clarity',
          description: '',
          score: data.clarity ?? 0,
          suggestions: claritySuggestions,
          evidence: clarityEvidence
        },
        {
          title: 'Accuracy',
          description: '',
          score: data.accuracy ?? 0,
          suggestions: accuracySuggestions,
          evidence: accuracyEvidence
        },
        {
          title: 'Engagement',
          description: '',
          score: data.engagement ?? 0,
          suggestions: engagementSuggestions,
          evidence: engagementEvidence
        }
      ]);

      if (data.suggestions && data.suggestions.length > 0) {
        console.log('Suggestions for improvement:', JSON.stringify(data.suggestions, null, 2));
      }
      if (data.evidence && data.evidence.length > 0) {
        console.log('Evidence:', JSON.stringify(data.evidence, null, 2));
      }
      console.log('Scores:', {
        clarity: data.clarity,
        accuracy: data.accuracy,
        engagement: data.engagement
      });
    }
  }, [data]);

  return (
    <div className="layout-content-container flex flex-col w-[360px]">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between">
          <p className="text-[#0d141c] text-base font-medium leading-normal">Confidence</p>
          <p className="text-[#0d141c] text-sm font-normal leading-normal">60%</p>
        </div>
        <div className="rounded bg-[#cedbe8]">
          <div className="h-2 rounded bg-[#0c7ff2]" style={{ width: '60%' }}></div>
        </div>
      </div>
      <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Rubric</h3>
      {rubricItems.map((item, index) => (
        <div key={index} className="flex flex-col gap-2 bg-slate-50 px-4 min-h-[72px] py-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <p className="text-[#0d141c] text-base font-medium leading-normal line-clamp-1">{item.title}</p>
              <p className="text-[#49739c] text-sm font-normal leading-normal line-clamp-2">{item.description}</p>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-[88px] overflow-hidden rounded-sm bg-[#cedbe8]">
                  <div className="h-1 rounded-full bg-[#0c7ff2]" style={{ width: `${item.score}%` }}></div>
                </div>
                <p className="text-[#0d141c] text-sm font-medium leading-normal">{item.score}</p>
              </div>
            </div>
          </div>
          {item.suggestions.length > 0 && (
            <div className="mt-2 pl-2 border-l-2 border-[#0c7ff2]">
              {item.suggestions.map((suggestion, idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-[#49739c] text-sm font-normal leading-normal mb-1">
                    {suggestion}
                  </p>
                  {item.evidence[idx] && (
                    <div className="mt-1 ml-2 p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                      <p className="text-[#64748b] text-xs font-medium mb-1">Evidence:</p>
                      <p className="text-[#64748b] text-xs leading-relaxed">
                        {item.evidence[idx]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-end px-4 py-4">
        <button 
          className={`bg-[#0c7ff2] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0a6cd9] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleEvaluate}
          disabled={isLoading || messages.length === 0}
        >
          {isLoading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 