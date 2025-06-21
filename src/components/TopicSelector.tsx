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
    <div 
      className="p-6 rounded-[15px] shadow-sm"
      style={{
        backgroundColor: '#f6f6e9',
        fontFamily: 'DM Sans, sans-serif',
        maxWidth: '600px',
        width: '100%'
      }}
    >
      <h3 
        className="text-xl font-semibold mb-6 text-center"
        style={{ 
          fontFamily: 'DM Sans, sans-serif',
          color: '#000000',
          fontSize: '1.3rem',
          letterSpacing: 'normal'
        }}
      >
        Select Topic for Darwin the Duck
      </h3>
      
      {/* Preset Topics */}
      <div className="mb-8">
        <h4 
          className="text-sm font-medium mb-4"
          style={{ 
            fontFamily: 'DM Sans, sans-serif',
            color: '#000000',
            fontSize: '0.9rem',
            letterSpacing: '0.05em'
          }}
        >
          Preset Topics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(TOPIC_SUBJECTS).map(([key, { topic, subject }]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key as keyof typeof TOPIC_SUBJECTS)}
              className="p-4 text-left rounded-[8px] border transition-all duration-200"
              style={{
                backgroundColor: selectedPreset === key ? '#272727' : '#ffffff',
                border: '1px solid #000000',
                color: selectedPreset === key ? '#ffffff' : '#000000',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedPreset !== key) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPreset !== key) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div 
                className="font-medium text-sm mb-1"
                style={{ 
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '600'
                }}
              >
                {topic}
              </div>
              <div 
                className="text-xs"
                style={{ 
                  fontFamily: 'DM Sans, sans-serif',
                  color: selectedPreset === key ? '#cccccc' : '#666666'
                }}
              >
                {subject}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Topic */}
      <div className="border-t pt-6" style={{ borderColor: '#000000' }}>
        <h4 
          className="text-sm font-medium mb-4"
          style={{ 
            fontFamily: 'DM Sans, sans-serif',
            color: '#000000',
            fontSize: '0.9rem',
            letterSpacing: '0.05em'
          }}
        >
          Custom Topic
        </h4>
        <div className="space-y-4">
          <div>
            <label 
              className="block text-xs font-medium mb-2"
              style={{ 
                fontFamily: 'DM Sans, sans-serif',
                color: '#000000',
                fontSize: '0.8rem',
                letterSpacing: '0.05em'
              }}
            >
              Topic
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Shakespeare, World War II"
              className="w-full px-4 py-3 border rounded-[8px] text-sm focus:outline-none transition-colors"
              style={{
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#272727';
                e.target.style.backgroundColor = '#f8f8f8';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#000000';
                e.target.style.backgroundColor = '#ffffff';
              }}
            />
          </div>
          <div>
            <label 
              className="block text-xs font-medium mb-2"
              style={{ 
                fontFamily: 'DM Sans, sans-serif',
                color: '#000000',
                fontSize: '0.8rem',
                letterSpacing: '0.05em'
              }}
            >
              Subject
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g., Biology, Literature, History"
              className="w-full px-4 py-3 border rounded-[8px] text-sm focus:outline-none transition-colors"
              style={{
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#272727';
                e.target.style.backgroundColor = '#f8f8f8';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#000000';
                e.target.style.backgroundColor = '#ffffff';
              }}
            />
          </div>
          <button
            onClick={handleCustomSubmit}
            disabled={!customTopic || !customSubject}
            className="w-full py-3 px-4 rounded-[8px] text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: (!customTopic || !customSubject) ? '#666666' : '#272727',
              color: '#ffffff',
              border: '1px solid #000000',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: (!customTopic || !customSubject) ? 'not-allowed' : 'pointer',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (customTopic && customSubject) {
                e.currentTarget.style.backgroundColor = '#404040';
                e.currentTarget.style.transform = 'scale(1.01)';
              }
            }}
            onMouseLeave={(e) => {
              if (customTopic && customSubject) {
                e.currentTarget.style.backgroundColor = '#272727';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            Set Custom Topic
          </button>
        </div>
      </div>

      {/* Current Selection Display */}
      <div 
        className="mt-6 p-4 rounded-[8px]"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #000000'
        }}
      >
        <div 
          className="text-xs font-medium mb-2"
          style={{ 
            fontFamily: 'DM Sans, sans-serif',
            color: '#000000',
            fontSize: '0.8rem',
            letterSpacing: '0.05em'
          }}
        >
          Current Topic:
        </div>
        <div 
          className="text-sm"
          style={{ 
            fontFamily: 'DM Sans, sans-serif',
            color: '#000000',
            fontSize: '0.9rem'
          }}
        >
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