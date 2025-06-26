import { Message, AIEvaluationData, TranscriptData } from '../types/chat';

/**
 * Transforms raw AI data into structured AIEvaluationData
 */
export const transformAIEvaluationData = (aiData: any): AIEvaluationData => {
  if (!aiData) {
    return {
      clarity: 0,
      accuracy: 0,
      engagement: 0,
      suggestions: [],
      evidence: [],
      overall_comment: ''
    };
  }

  return {
    clarity: aiData.clarity ?? 0,
    accuracy: aiData.accuracy ?? 0,
    engagement: aiData.engagement ?? 0,
    suggestions: (aiData.suggestions ?? []).filter((s: any): s is string => s !== null),
    evidence: (aiData.evidence ?? []).filter((e: any): e is string => e !== null),
    overall_comment: aiData.overall_comment ?? ''
  };
};

/**
 * Creates a transcript object for AI evaluation
 */
export const createTranscript = (
  messages: Message[], 
  topic: string, 
  subject: string
): TranscriptData => {
  return {
    session_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    topic,
    subject,
    transcript: messages.map(msg => ({
      id: msg.id,
      sender: msg.sender,
      content: msg.content,
      isUser: msg.isUser
    }))
  };
};

/**
 * Validates AI evaluation data
 */
export const validateAIEvaluationData = (data: AIEvaluationData): boolean => {
  return (
    typeof data.clarity === 'number' && data.clarity >= 0 && data.clarity <= 100 &&
    typeof data.accuracy === 'number' && data.accuracy >= 0 && data.accuracy <= 100 &&
    typeof data.engagement === 'number' && data.engagement >= 0 && data.engagement <= 100 &&
    Array.isArray(data.suggestions) &&
    Array.isArray(data.evidence) &&
    typeof data.overall_comment === 'string'
  );
}; 