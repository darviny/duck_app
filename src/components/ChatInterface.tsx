import React, { useRef, useEffect, useMemo, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { parseAndControlDuckAnimation } from './DuckModel';
import Message from './Message';
import InputBox from './InputBox';

// AWS setup
const amplifyClient = generateClient<Schema>();
const { useAIGeneration } = createAIHooks(amplifyClient);

interface Message {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
}

interface AIEvaluationData {
  clarity: number;
  accuracy: number;
  engagement: number;
  suggestions: string[];
  evidence: string[];
  overall_comment: string;
}

interface ChatInterfaceProps {
  useNewStyle?: boolean;
  currentLearningTopic: string;
  currentSubject: string;
  isUserLoggedIn: boolean;
  onQuackModeChange?: (enabled: boolean) => void;
  onEvaluationChange?: (evaluation: AIEvaluationData) => void;
}

export interface ChatInterfaceRef {
  toggleQuackMode: () => void;
  isQuackModeEnabled: boolean;
  resetChat: () => void;
  getEvaluationResults: () => AIEvaluationData;
}

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({
  useNewStyle = false,
  currentLearningTopic,
  currentSubject,
  isUserLoggedIn,
  onQuackModeChange,
  onEvaluationChange,
}, ref) => {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatSession, setChatSession] = useState<any>(null);
  const [isWaitingForAIResponse, setIsWaitingForAIResponse] = useState(false);
  const [aiEvaluationResults, setAiEvaluationResults] = useState<AIEvaluationData>({
    clarity: 0,
    accuracy: 0,
    engagement: 0,
    suggestions: [],
    evidence: [],
    overall_comment: ''
  });

  // Quack mode state
  const [isQuackModeEnabled, setIsQuackModeEnabled] = useState(false);

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamingTextBufferRef = useRef('');
  const shouldEvaluateAfterResponseRef = useRef(false);
  const quackModeRef = useRef(false);
  const hasInitializedChatRef = useRef(false);

  // AI hooks
  const [{ data: aiAnalysisData, isLoading: isAnalyzing }, analyzeConversation] = useAIGeneration("analyzeTranscript");

  // Update quack mode ref
  useEffect(() => {
    quackModeRef.current = isQuackModeEnabled;
  }, [isQuackModeEnabled]);

  // Notify parent of quack mode changes
  useEffect(() => {
    onQuackModeChange?.(isQuackModeEnabled);
  }, [isQuackModeEnabled, onQuackModeChange]);

  // Notify parent of evaluation changes
  useEffect(() => {
    onEvaluationChange?.(aiEvaluationResults);
  }, [aiEvaluationResults, onEvaluationChange]);

  // Update evaluation results when AI analysis completes
  useEffect(() => {
    if (aiAnalysisData) {
      setAiEvaluationResults({
        clarity: aiAnalysisData.clarity ?? 0,
        accuracy: aiAnalysisData.accuracy ?? 0,
        engagement: aiAnalysisData.engagement ?? 0,
        suggestions: (aiAnalysisData.suggestions ?? []).filter((s): s is string => s !== null),
        evidence: (aiAnalysisData.evidence ?? []).filter((e): e is string => e !== null),
        overall_comment: aiAnalysisData.overall_comment ?? ''
      });
    }
  }, [aiAnalysisData]);

  // Initialize chat when user logs in
  useEffect(() => {
    if (isUserLoggedIn && !hasInitializedChatRef.current) {
      hasInitializedChatRef.current = true;
    } else if (!isUserLoggedIn) {
      hasInitializedChatRef.current = false;
      setChatSession(null);
      setMessages([]);
    }
  }, [isUserLoggedIn]);

  // Initialize chat session if not exists
  useEffect(() => {
    if (!chatSession && isUserLoggedIn) {
      initializeChatSession();
    }
  }, [chatSession, isUserLoggedIn]);

  const initializeChatSession = async () => {
    try {
      console.log('Initializing AI chat session...');
      const { data: newChatSession } = await amplifyClient.conversations.chat.create();
      
      if (newChatSession) {
        setChatSession(newChatSession);
        setupStreamingSubscription(newChatSession);
        sendInitialMessage(newChatSession);
      }
    } catch (error) {
      console.error('Failed to create AI chat session:', error);
    }
  };

  const setupStreamingSubscription = (session: any) => {
    const streamingSubscription = session.onStreamEvent({
      next: (streamEvent: any) => {
        if (streamEvent.text) {
          streamingTextBufferRef.current += streamEvent.text;
        }
        
        if ('stopReason' in streamEvent) {
          const completeAIMessage = streamingTextBufferRef.current;
          
          if (completeAIMessage.trim()) {
            setMessages(prevMessages => {
              const { animationAction, cleanMessageText } = parseAndControlDuckAnimation(completeAIMessage);
              
              const newAIMessage: Message = {
                id: prevMessages.length + 1,
                sender: 'Darwin the Duck',
                content: quackModeRef.current ? `${cleanMessageText} Quack!` : cleanMessageText,
                isUser: false
              };
              
              const updatedMessages = [...prevMessages, newAIMessage];
              
              // Auto-evaluate after AI response
              if (shouldEvaluateAfterResponseRef.current) {
                setTimeout(() => {
                  handleEvaluateWithMessages(updatedMessages);
                }, 1000);
                shouldEvaluateAfterResponseRef.current = false;
              }
              
              return updatedMessages;
            });
          }
          
          streamingTextBufferRef.current = '';
        }
      },
      error: (streamError: any) => {
        console.error('Stream error:', streamError);
      },
    });

    return streamingSubscription;
  };

  const sendInitialMessage = async (session: any) => {
    const { errors } = await session.sendMessage(
      `I am trying to learn about ${currentLearningTopic} in ${currentSubject}. I know nothing about it.`
    );
    
    if (errors) {
      console.error('Initial topic message errors:', errors);
    }
  };

  const handleEvaluateWithMessages = useCallback(async (messagesToEvaluate: Message[]) => {
    if (messagesToEvaluate.length === 0) return;
    
    const conversationData = JSON.stringify({
      session_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      topic: currentLearningTopic,
      subject: currentSubject,
      transcript: messagesToEvaluate.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        isUser: msg.isUser
      }))
    });

    try {
      await analyzeConversation({ transcript: conversationData });
    } catch (error) {
      console.error('Error during AI evaluation:', error);
    }
  }, [currentLearningTopic, currentSubject, analyzeConversation]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession || isWaitingForAIResponse) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'You',
      content: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsWaitingForAIResponse(true);
    shouldEvaluateAfterResponseRef.current = true;
    
    try {
      const { errors } = await chatSession.sendMessage(inputValue);
      if (errors) {
        console.error('Message send errors:', errors);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsWaitingForAIResponse(false);
    }
    
    setInputValue('');
  };

  const handleManualEvaluation = async () => {
    if (messages.length === 0) return;
    
    const conversationData = JSON.stringify({
      session_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      topic: currentLearningTopic,
      subject: currentSubject,
      transcript: messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        isUser: msg.isUser
      }))
    });

    try {
      await analyzeConversation({ transcript: conversationData });
    } catch (error) {
      console.error('Error during manual analysis:', error);
    }
  };

  const handleToggleQuackMode = () => {
    const newQuackMode = !isQuackModeEnabled;
    console.log(`🦆 Quack mode ${newQuackMode ? 'ENABLED' : 'DISABLED'}`);
    setIsQuackModeEnabled(newQuackMode);
  };

  const resetChat = () => {
    setMessages([]);
    setInputValue('');
    setChatSession(null);
    setIsWaitingForAIResponse(false);
    hasInitializedChatRef.current = false;
    setAiEvaluationResults({
      clarity: 0,
      accuracy: 0,
      engagement: 0,
      suggestions: [],
      evidence: [],
      overall_comment: ''
    });
  };

  const getEvaluationResults = () => aiEvaluationResults;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Find the latest user message ID
  const latestUserMessageId = useMemo(() => {
    const userMessages = messages.filter(msg => msg.isUser);
    return userMessages.length > 0 ? userMessages[userMessages.length - 1].id : null;
  }, [messages]);

  useImperativeHandle(ref, () => ({
    toggleQuackMode: handleToggleQuackMode,
    isQuackModeEnabled: isQuackModeEnabled,
    resetChat,
    getEvaluationResults
  }));

  return (
    <div className="layout-content-container flex flex-col flex-1 max-w-4xl mx-auto w-full">
      <div className="flex gap-3 p-3 flex-wrap pr-4">
      </div>
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto max-h-[calc(100vh-435px)] min-h-[200px]"
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            sender={message.sender}
            content={message.content}
            isUser={message.isUser}
            useNewStyle={useNewStyle}
            aiEvaluation={aiEvaluationResults}
            isLatestUserMessage={message.isUser && message.id === latestUserMessageId}
          />
        ))}
      </div>
      <InputBox
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        useNewStyle={useNewStyle}
      />
    </div>
  );
});

export default ChatInterface; 