import { useState, useEffect, useCallback } from 'react';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource';
import { AIEvaluationData, Message } from '../types/chat';
import { transformAIEvaluationData, createTranscript, validateAIEvaluationData } from '../utils/aiEvaluation';

const client = generateClient<Schema>();
const { useAIGeneration } = createAIHooks(client);

interface UseAIEvaluationOptions {
  onEvaluationComplete?: (evaluation: AIEvaluationData) => void;
  onEvaluationError?: (error: Error) => void;
}

export const useAIEvaluation = (options: UseAIEvaluationOptions = {}) => {
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluationData>({
    clarity: 0,
    accuracy: 0,
    engagement: 0,
    suggestions: [],
    evidence: [],
    overall_comment: ''
  });

  const [{ data: aiData, isLoading: aiLoading }, analyzeTranscript] = useAIGeneration("analyzeTranscript");

  // Process AI data when it changes
  useEffect(() => {
    if (aiData) {
      const transformedData = transformAIEvaluationData(aiData);
      
      if (validateAIEvaluationData(transformedData)) {
        setAiEvaluation(transformedData);
        options.onEvaluationComplete?.(transformedData);
      } else {
        const error = new Error('Invalid AI evaluation data received');
        options.onEvaluationError?.(error);
      }
    }
  }, [aiData, options]);

  // Evaluate messages with AI
  const evaluateMessages = useCallback(async (
    messages: Message[], 
    topic: string, 
    subject: string
  ): Promise<void> => {
    if (messages.length === 0) {
      console.warn('No messages to evaluate');
      return;
    }

    try {
      const transcript = createTranscript(messages, topic, subject);
      await analyzeTranscript({ transcript: JSON.stringify(transcript) });
    } catch (error) {
      console.error('Error calling analyzeTranscript:', error);
      options.onEvaluationError?.(error as Error);
    }
  }, [analyzeTranscript, options]);

  // Reset AI evaluation to initial state
  const resetEvaluation = useCallback(() => {
    setAiEvaluation({
      clarity: 0,
      accuracy: 0,
      engagement: 0,
      suggestions: [],
      evidence: [],
      overall_comment: ''
    });
  }, []);

  return {
    aiEvaluation,
    setAiEvaluation,
    evaluateMessages,
    resetEvaluation,
    isEvaluating: aiLoading,
    hasEvaluation: aiEvaluation.clarity > 0 || aiEvaluation.accuracy > 0 || aiEvaluation.engagement > 0
  };
}; 