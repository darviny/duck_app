import React, { createContext, useContext, ReactNode } from 'react';

interface AIEvaluationData {
  clarity: number;
  accuracy: number;
  engagement: number;
  suggestions: string[];
  evidence: string[];
  overall_comment: string;
}

interface AIEvaluationContextType {
  aiEvaluation: AIEvaluationData;
  setAiEvaluation: (data: AIEvaluationData) => void;
  onEvaluate?: () => void;
  isEvaluating: boolean;
}

const AIEvaluationContext = createContext<AIEvaluationContextType | undefined>(undefined);

interface AIEvaluationProviderProps {
  children: ReactNode;
  aiEvaluation: AIEvaluationData;
  setAiEvaluation: (data: AIEvaluationData) => void;
  onEvaluate?: () => void;
  isEvaluating: boolean;
}

export const AIEvaluationProvider: React.FC<AIEvaluationProviderProps> = ({ 
  children, 
  aiEvaluation, 
  setAiEvaluation,
  onEvaluate,
  isEvaluating
}) => {
  return (
    <AIEvaluationContext.Provider value={{ aiEvaluation, setAiEvaluation, onEvaluate, isEvaluating }}>
      {children}
    </AIEvaluationContext.Provider>
  );
};

export const useAIEvaluation = (): AIEvaluationContextType => {
  const context = useContext(AIEvaluationContext);
  if (context === undefined) {
    throw new Error('useAIEvaluation must be used within an AIEvaluationProvider');
  }
  return context;
}; 