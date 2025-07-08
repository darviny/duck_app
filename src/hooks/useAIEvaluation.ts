import { useState, useEffect, useCallback, useRef } from 'react';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource';
import { AIEvaluationData, Message } from '../types/chat';
import { AIEvaluationService } from '../services/aiEvaluationService';

const client = generateClient<Schema>();
const { useAIGeneration } = createAIHooks(client);

interface UseAIEvaluationOptions {
  onEvaluationComplete?: (evaluation: AIEvaluationData) => void;
  onEvaluationError?: (error: Error) => void;
  onEvaluationStart?: () => void;
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
  
  // Create service instance with ref to avoid recreation on every render
  const serviceRef = useRef<AIEvaluationService>();
  if (!serviceRef.current) {
    serviceRef.current = new AIEvaluationService(options);
  }

  // Update service config when options change
  useEffect(() => {
    if (serviceRef.current) {
      serviceRef.current.updateConfig(options);
    }
  }, [options]);

  // Process AI data when it changes
  useEffect(() => {
    if (aiData && serviceRef.current) {
      try {
        const processedEvaluation = serviceRef.current.processAIResponse(aiData);
        setAiEvaluation(processedEvaluation);
      } catch (error) {
        console.error('Error processing AI response:', error);
      }
    }
  }, [aiData]);

  // Evaluate messages with AI
  const evaluateMessages = useCallback(async (
    messages: Message[], 
    topic: string, 
    subject: string
  ): Promise<void> => {
    if (!serviceRef.current) {
      console.error('AIEvaluationService not initialized');
      return;
    }

    if (!serviceRef.current.canEvaluate(messages)) {
      console.warn('No valid messages to evaluate');
      return;
    }

    try {
      const transcript = serviceRef.current.createTranscriptForEvaluation(messages, topic, subject);
      options.onEvaluationStart?.();
      await analyzeTranscript({ transcript: JSON.stringify(transcript) });
    } catch (error) {
      console.error('Error calling analyzeTranscript:', error);
      options.onEvaluationError?.(error as Error);
    }
  }, [analyzeTranscript, options]);

  // Reset AI evaluation to initial state
  const resetEvaluation = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.resetEvaluation();
      setAiEvaluation(serviceRef.current.getCurrentEvaluation());
    }
  }, []);

  return {
    aiEvaluation,
    setAiEvaluation,
    evaluateMessages,
    resetEvaluation,
    isEvaluating: aiLoading,
    hasEvaluation: serviceRef.current?.hasActiveEvaluation() ?? false
  };
}; 