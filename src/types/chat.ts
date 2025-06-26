export interface Message {
  id: string;
  sender: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIEvaluationData {
  clarity: number; // 0-100
  accuracy: number; // 0-100
  engagement: number; // 0-100
  suggestions: string[];
  evidence: string[];
  overall_comment: string;
}

export interface TranscriptData {
  session_id: string;
  timestamp: string;
  topic: string;
  subject: string;
  transcript: Array<{
    id: string;
    sender: string;
    content: string;
    isUser: boolean;
  }>;
} 