import React, { useState } from 'react';
import { generateDarwinPrompt, generateDarwinPromptFromPreset, TOPIC_SUBJECTS } from '../utils/promptGenerator';

interface TopicSelectorProps {
  onTopicChange: (prompt: string, topic: string, subject: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onTopicChange }) => {
  const [customTopic, setCustomTopic] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof TOPIC_SUBJECTS>('algebra');

  const handlePresetChange = (preset: keyof typeof TOPIC_SUBJECTS) => {
    setSelectedPreset(preset);
    const { topic, subject } = TOPIC_SUBJECTS[preset];
    const prompt = generateDarwinPromptFromPreset(preset);
    onTopicChange(prompt, topic, subject);
  };

  const handleCustomSubmit = () => {
    if (customTopic && customSubject) {
      const prompt = generateDarwinPrompt(customTopic, customSubject);
      onTopicChange(prompt, customTopic, customSubject);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Select Topic for Darwin the Duck</h3>
      
      {/* Preset Topics */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Preset Topics</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(TOPIC_SUBJECTS).map(([key, { topic, subject }]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key as keyof typeof TOPIC_SUBJECTS)}
              className={`p-3 text-left rounded-md border transition-colors ${
                selectedPreset === key
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-sm">{topic}</div>
              <div className="text-xs text-gray-500">{subject}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Topic */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Topic</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Shakespeare, World War II"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g., Biology, Literature, History"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCustomSubmit}
            disabled={!customTopic || !customSubject}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Set Custom Topic
          </button>
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-xs font-medium text-gray-600 mb-1">Current Topic:</div>
        <div className="text-sm">
          {customTopic && customSubject 
            ? `${customTopic} in ${customSubject}`
            : `${TOPIC_SUBJECTS[selectedPreset].topic} in ${TOPIC_SUBJECTS[selectedPreset].subject}`
          }
        </div>
      </div>
    </div>
  );
};

export default TopicSelector; 