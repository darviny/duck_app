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
}

interface SidebarProps {
  messages: Message[];
}

const Sidebar: React.FC<SidebarProps> = ({ messages }) => {
  const [rubricItems, setRubricItems] = useState<RubricItem[]>([
    {
      title: 'Clarity',
      description: 'Clear and concise explanation of the concept.',
      score: 0
    },
    {
      title: 'Accuracy',
      description: 'Accurate use of terminology and definitions.',
      score: 0
    },
    {
      title: 'Engagement',
      description: 'Engaging and interactive explanation.',
      score: 0
    }
  ]);

  const [{ data, isLoading }, analyzeTranscript] = useAIGeneration("analyzeTranscript");

  const handleEvaluate = async () => {
    if (messages.length === 0) return;
    
    const transcript = JSON.stringify({
      session_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
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
      console.log('Complete AI Response:', data);
      setRubricItems([
        {
          title: 'Clarity',
          description: 'Clear and concise explanation of the concept.',
          score: data.clarity ?? 0
        },
        {
          title: 'Accuracy',
          description: 'Accurate use of terminology and definitions.',
          score: data.accuracy ?? 0
        },
        {
          title: 'Engagement',
          description: 'Engaging and interactive explanation.',
          score: data.engagement ?? 0
        }
      ]);

      if (data.suggestions && data.suggestions.length > 0) {
        console.log('Suggestions for improvement:', data.suggestions);
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
        <div key={index} className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
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