import React, { useState, useEffect } from 'react';

interface PromptConfigProps {
  onPromptChange: (prompt: string) => void;
}

const PromptConfig: React.FC<PromptConfigProps> = ({ onPromptChange }) => {
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem('systemPrompt') || 'You are Darwin the Duck, a friendly and knowledgeable teaching assistant. You help students understand complex concepts by breaking them down into simple, digestible explanations. You use analogies, examples, and interactive dialogue to make learning engaging and fun.';
  });

  useEffect(() => {
    // Load saved prompt on component mount
    const savedPrompt = localStorage.getItem('systemPrompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('systemPrompt', prompt);
    // Notify parent component
    onPromptChange(prompt);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">System Prompt</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 p-2 border rounded mb-4"
        placeholder="Enter system prompt..."
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update Prompt
      </button>
    </div>
  );
};

export default PromptConfig; 