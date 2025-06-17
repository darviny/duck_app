import React, { useState } from 'react';

interface PromptTesterProps {
  onPromptChange: (prompt: string) => void;
}

const PromptTester: React.FC<PromptTesterProps> = ({ onPromptChange }) => {
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem('testPrompt') || 'You are Darwin the Duck, a friendly and knowledgeable teaching assistant. You help students understand complex concepts by breaking them down into simple, digestible explanations. You use analogies, examples, and interactive dialogue to make learning engaging and fun.';
  });

  const handleSave = () => {
    localStorage.setItem('testPrompt', prompt);
    onPromptChange(prompt);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-bold mb-2">Test Prompt</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-24 p-2 text-sm border rounded mb-2"
        placeholder="Enter test prompt..."
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
      >
        Test Prompt
      </button>
    </div>
  );
};

export default PromptTester; 