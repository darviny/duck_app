import React, { createContext, useContext, ReactNode } from 'react';
import { AIEvaluationData } from '../types/chat';

interface AIEvaluationContextType {
  aiEvaluation: AIEvaluationData;
  setAiEvaluation: (data: AIEvaluationData) => void;
  onEvaluate?: () => void;
  isEvaluating: boolean;
  hasEvaluation: boolean;
}

const AIEvaluationContext = createContext<AIEvaluationContextType | undefined>(undefined);

interface AIEvaluationProviderProps {
  children: ReactNode;
  aiEvaluation: AIEvaluationData;
  setAiEvaluation: (data: AIEvaluationData) => void;
  onEvaluate?: () => void;
  isEvaluating: boolean;
  hasEvaluation?: boolean;
}

export const AIEvaluationProvider: React.FC<AIEvaluationProviderProps> = ({ 
  children, 
  aiEvaluation, 
  setAiEvaluation,
  onEvaluate,
  isEvaluating,
  hasEvaluation = false
}) => {
  return (
    <AIEvaluationContext.Provider value={{ 
      aiEvaluation, 
      setAiEvaluation, 
      onEvaluate, 
      isEvaluating,
      hasEvaluation
    }}>
      {children}
    </AIEvaluationContext.Provider>
  );
};

export const useAIEvaluationContext = (): AIEvaluationContextType => {
  const context = useContext(AIEvaluationContext);
  if (context === undefined) {
    throw new Error('useAIEvaluationContext must be used within an AIEvaluationProvider');
  }
  return context;
}; 