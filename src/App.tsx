import './App.css';
import { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { getCurrentUser, signIn, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import Layout from './components/Layout/Layout';
import ChatInterface from './components/ChatInterface';
import TopicSelector from './components/TopicSelector';

const client = generateClient<Schema>();
const { useAIGeneration } = createAIHooks(client);

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

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chat, setChat] = useState<any>(null);
  const [currentTopic, setCurrentTopic] = useState('Distance Formula in Linear Algebra');
  const [currentSubject, setCurrentSubject] = useState('Algebra');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluationData>({
    clarity: 0,
    accuracy: 0,
    engagement: 0,
    suggestions: [],
    evidence: [],
    overall_comment: ''
  });
  const initializedRef = useRef(false);
  const accumulatedTextRef = useRef('');

  const [{ data: aiData, isLoading: aiLoading }, analyzeTranscript] = useAIGeneration("analyzeTranscript");

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setIsAuthenticated(true);
        setUser({ ...currentUser, attributes });
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Update AI evaluation when data changes
  useEffect(() => {
    console.log('AI Data received:', aiData);
    console.log('AI Loading state:', aiLoading);
    
    if (aiData) {
      console.log('Processing AI evaluation data:', JSON.stringify(aiData, null, 2));
      setAiEvaluation({
        clarity: aiData.clarity ?? 0,
        accuracy: aiData.accuracy ?? 0,
        engagement: aiData.engagement ?? 0,
        suggestions: (aiData.suggestions ?? []).filter((s): s is string => s !== null),
        evidence: (aiData.evidence ?? []).filter((e): e is string => e !== null),
        overall_comment: aiData.overall_comment ?? ''
      });
      console.log('AI Evaluation state updated:', {
        clarity: aiData.clarity ?? 0,
        accuracy: aiData.accuracy ?? 0,
        engagement: aiData.engagement ?? 0
      });
    }
  }, [aiData, aiLoading]);

  // Initialize chat when authenticated
  useEffect(() => {
    if (!isAuthenticated || initializedRef.current) return;
    
    const initializeChat = async () => {
      try {
        console.log('Starting chat initialization...');
        const { data: newChat } = await client.conversations.chat.create();
        
        if (newChat) {
          console.log('Chat created successfully');
          setChat(newChat);
          
          const subscription = newChat.onStreamEvent({
            next: (event) => {
              if (event.text) {
                accumulatedTextRef.current += event.text;
              }
              
              if ('stopReason' in event) {
                const completeMessage = accumulatedTextRef.current;
                console.log('Stream complete, final message:', completeMessage);
                
                setMessages(prev => [...prev, {
                  id: prev.length + 1,
                  sender: 'Darwin the Duck',
                  content: completeMessage,
                  isUser: false
                }]);
                
                accumulatedTextRef.current = '';
              }
            },
            error: (error) => {
              console.error('Stream error:', error);
            },
          });

          // Send initial topic message
          const { errors } = await newChat.sendMessage(`I am trying to learn about ${currentTopic} in ${currentSubject}. I know nothing about it.`);
          if (errors) {
            console.error('Topic message errors:', errors);
          }
          
          initializedRef.current = true;
          return () => subscription.unsubscribe();
        }
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    };

    initializeChat();
  }, [isAuthenticated, currentTopic, currentSubject]);

  const handleTopicChange = async (topic: string, subject: string) => {
    setCurrentTopic(topic);
    setCurrentSubject(subject);
    setShowTopicSelector(false);
    
    // Clear existing messages and restart chat
    setMessages([]);
    initializedRef.current = false;
    setChat(null);
    
    // Re-initialize will happen in useEffect
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chat || isLoading) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'You',
      content: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      const { errors } = await chat.sendMessage(inputValue);
      if (errors) {
        console.error('Message send errors:', errors);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
    
    setInputValue('');
  };

  const handleSignIn = async () => {
    try {
      await signIn({ username: 'test@example.com', password: 'password123' });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
      setChat(null);
      setMessages([]);
      initializedRef.current = false;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNewDuck = () => {
    setShowTopicSelector(true);
  };

  const handleEvaluate = async () => {
    if (messages.length === 0) {
      console.log('No messages to evaluate');
      return;
    }
    
    console.log('Starting AI evaluation...');
    console.log('Current messages:', messages);
    
    const transcript = JSON.stringify({
      session_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      topic: currentTopic,
      subject: currentSubject,
      transcript: messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        isUser: msg.isUser
      }))
    });

    console.log('Transcript being analyzed:', transcript);
    
    try {
      const result = await analyzeTranscript({ transcript });
      console.log('Analyze transcript result:', result);
    } catch (error) {
      console.error('Error calling analyzeTranscript:', error);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', backgroundColor: 'var(--background)' }}>
      <Layout
        isAuthenticated={isAuthenticated}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onNewDuck={handleNewDuck}
        aiEvaluation={aiEvaluation}
        onEvaluate={handleEvaluate}
        isEvaluating={aiLoading}
      >
        <div className="w-full h-full flex flex-col">
          {!isAuthenticated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Darwin the Duck</h2>
                <p className="mb-6 text-gray-600">Please sign in to start learning</p>
                <button
                  onClick={handleSignIn}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : showTopicSelector ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <TopicSelector onTopicChange={(_prompt, topic, subject) => handleTopicChange(topic, subject)} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-center items-center p-6">
                <div className="space-y-1 text-center">
                  <h2 className="text-gray-600 font-medium" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    Current Topic:
                  </h2>
                  <h3 className="text-gray-900 font-semibold" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3rem', letterSpacing: 'normal' }}>
                    {currentTopic}
                  </h3>
                </div>
              </div>
              <ChatInterface
                messages={messages}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;
