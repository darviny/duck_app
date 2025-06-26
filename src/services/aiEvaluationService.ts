import { AIEvaluationData, Message, TranscriptData } from '../types/chat';
import { transformAIEvaluationData, createTranscript, validateAIEvaluationData } from '../utils/aiEvaluation';

export interface AIEvaluationServiceConfig {
  onEvaluationComplete?: (evaluation: AIEvaluationData) => void;
  onEvaluationError?: (error: Error) => void;
  onEvaluationStart?: () => void;
}

export class AIEvaluationService {
  private config: AIEvaluationServiceConfig;
  private currentEvaluation: AIEvaluationData;

  constructor(config: AIEvaluationServiceConfig = {}) {
    this.config = config;
    this.currentEvaluation = {
      clarity: 0,
      accuracy: 0,
      engagement: 0,
      suggestions: [],
      evidence: [],
      overall_comment: ''
    };
  }

  /**
   * Process raw AI data and update current evaluation
   */
  processAIResponse(aiData: any): AIEvaluationData {
    const transformedData = transformAIEvaluationData(aiData);
    
    if (validateAIEvaluationData(transformedData)) {
      this.currentEvaluation = transformedData;
      this.config.onEvaluationComplete?.(transformedData);
      return transformedData;
    } else {
      const error = new Error('Invalid AI evaluation data received');
      this.config.onEvaluationError?.(error);
      throw error;
    }
  }

  /**
   * Create transcript for evaluation
   */
  createTranscriptForEvaluation(
    messages: Message[], 
    topic: string, 
    subject: string
  ): TranscriptData {
    return createTranscript(messages, topic, subject);
  }

  /**
   * Validate if messages can be evaluated
   */
  canEvaluate(messages: Message[]): boolean {
    return messages.length > 0 && messages.some(msg => msg.isUser);
  }

  /**
   * Get current evaluation state
   */
  getCurrentEvaluation(): AIEvaluationData {
    return { ...this.currentEvaluation };
  }

  /**
   * Reset evaluation to initial state
   */
  resetEvaluation(): void {
    this.currentEvaluation = {
      clarity: 0,
      accuracy: 0,
      engagement: 0,
      suggestions: [],
      evidence: [],
      overall_comment: ''
    };
  }

  /**
   * Check if there's an active evaluation
   */
  hasActiveEvaluation(): boolean {
    return this.currentEvaluation.clarity > 0 || 
           this.currentEvaluation.accuracy > 0 || 
           this.currentEvaluation.engagement > 0;
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<AIEvaluationServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
} 