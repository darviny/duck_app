import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { getCurrentUser, signIn, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import NavBar from './components/NavBar/NavBar';
import ToolBar from './components/ToolBar/ToolBar';
import ChatInterface from './components/ChatInterface';
import TopicSelector from './components/TopicSelector';
import { DuckStates } from './components/web-gl-component/ThreeJSModules/enums';
import { AIEvaluationProvider } from './contexts/AIEvaluationContext';
import styles from './App.module.scss';
import HelpModal from './components/HelpModal';
import { WebGLComponent } from './components/web-gl-component/web-gl-component';
import Rubric from './components/Rubric/Rubric';

// Global reference to AnimationController
declare global {
  interface Window {
    duckAnimationController?: any;
  }
}

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
  const [useNewChatStyle, setUseNewChatStyle] = useState(false);
  const [quackMode, setQuackMode] = useState(false);
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
  const shouldEvaluateRef = useRef(false);
  const quackModeRef = useRef(quackMode);
  const webglRef = useRef(null);

  const [{ data: aiData, isLoading: aiLoading }, analyzeTranscript] = useAIGeneration("analyzeTranscript");

  // State for Help modal
  const [showHelp, setShowHelp] = useState(false);

  // Update the ref whenever quackMode changes
  useEffect(() => {
    quackModeRef.current = quackMode;
  }, [quackMode]);

  // Function to parse action from Darwin's message
  const parseDuckAction = (message: string): { action: DuckStates; cleanMessage: string } => {
    // Look for action in curly brackets at the beginning of the message
    const actionMatch = message.match(/^\s*\{([^}]+)\}\s*(.*)/);
    
    if (actionMatch) {
      const actionText = actionMatch[1].trim().toLowerCase();
      const cleanMessage = actionMatch[2].trim();
      
      // Map action text to DuckStates
      switch (actionText) {
        case 'idle':
          return { action: DuckStates.IDLE, cleanMessage };
        case 'lay':
        case 'laying':
          return { action: DuckStates.LAY, cleanMessage };
        case 'eat':
        case 'eating':
          return { action: DuckStates.EAT, cleanMessage };
        default:
          // Default to IDLE if action is not recognized
          return { action: DuckStates.IDLE, cleanMessage };
      }
    }
    
    // No action found, return IDLE and original message
    return { action: DuckStates.IDLE, cleanMessage: message };
  };

  const handleEvaluateWithMessages = useCallback(async (messagesToEvaluate: Message[]) => {
    if (messagesToEvaluate.length === 0) {
      console.log('No messages to evaluate');
      return;
    }
    
    console.log('Starting AI evaluation with provided messages...');
    console.log('Messages to evaluate:', messagesToEvaluate);
    
    const transcript = JSON.stringify({
      session_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      topic: currentTopic,
      subject: currentSubject,
      transcript: messagesToEvaluate.map(msg => ({
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
  }, [currentTopic, currentSubject, analyzeTranscript]);

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
              console.log('Stream event received:', event);
              if (event.text) {
                accumulatedTextRef.current += event.text;
                console.log('Accumulated text so far:', accumulatedTextRef.current);
              }
              
              if ('stopReason' in event) {
                const completeMessage = accumulatedTextRef.current;
                console.log('Stream complete, final message:', completeMessage);
                console.log('Stop reason:', event.stopReason);
                console.log('Message length:', completeMessage.length);
                console.log('Message trimmed length:', completeMessage.trim().length);
                
                // Only add the message if it's not empty
                if (completeMessage.trim()) {
                  setMessages(prev => {
                    // Parse duck action from Darwin's message
                    const { action, cleanMessage } = parseDuckAction(completeMessage);
                    
                    console.log(`🦆 Processing Darwin message:`);
                    console.log(`   Original message: "${completeMessage}"`);
                    console.log(`   Clean message: "${cleanMessage}"`);
                    console.log(`   Quack mode state: ${quackModeRef.current}`);
                    
                    // Directly set AnimationController state (same as GUI)
                    if (window.duckAnimationController) {
                        window.duckAnimationController.nextAction = action;
                    }
                    
                    const updatedMessages = [...prev, {
                      id: prev.length + 1,
                      sender: 'Darwin the Duck',
                      content: quackModeRef.current ? `${cleanMessage} Quack!` : cleanMessage, // Append "Quack!" if quack mode is enabled
                      isUser: false
                    }];
                    
                    // Log if quack mode modified the message
                    if (quackModeRef.current) {
                      console.log(`🦆 Quack mode active - Message modified with "Quack!"`);
                      console.log(`   Original: "${cleanMessage}"`);
                      console.log(`   Modified: "${cleanMessage} Quack!"`);
                    } else {
                      console.log(`🦆 Quack mode inactive - Message not modified`);
                    }
                    
                    // Only evaluate if this was triggered by a user message
                    if (shouldEvaluateRef.current) {
                      setTimeout(async () => {
                        console.log('Auto-evaluating after AI response...');
                        handleEvaluateWithMessages(updatedMessages);
                      }, 1000);
                      shouldEvaluateRef.current = false; // Reset the flag
                    }
                    
                    return updatedMessages;
                  });
                } else {
                  console.log('Empty AI response received, not adding to chat');
                }
                
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
          
          console.log('Initial topic message sent, waiting for response...');
          
          initializedRef.current = true;
          return () => subscription.unsubscribe();
        }
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    };

    initializeChat();
  }, [isAuthenticated, currentTopic, currentSubject, handleEvaluateWithMessages, quackMode]);

  const handleTopicChange = async (topic: string, subject: string) => {
    setCurrentTopic(topic);
    setCurrentSubject(subject);
    setShowTopicSelector(false);
    
    // Clear existing messages and restart chat
    setMessages([]);
    initializedRef.current = false;
    setChat(null);
    shouldEvaluateRef.current = false; // Reset evaluation flag
    
    // Reset AI evaluation to original state
    setAiEvaluation({
      clarity: 0,
      accuracy: 0,
      engagement: 0,
      suggestions: [],
      evidence: [],
      overall_comment: ''
    });
    
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
    
    // Set flag to evaluate after AI response
    shouldEvaluateRef.current = true;
    
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

  const handleToggleChatStyle = () => {
    setUseNewChatStyle(!useNewChatStyle);
  };

  const handleToggleQuackMode = () => {
    const newQuackMode = !quackMode;
    console.log(`🦆 Quack mode ${newQuackMode ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   Previous state: ${quackMode}`);
    console.log(`   New state: ${newQuackMode}`);
    setQuackMode(newQuackMode);
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

  // ToolBar handlers
  const handleHelp = () => setShowHelp(true);
  const handleCloseHelp = () => setShowHelp(false);

  return (
    <AIEvaluationProvider 
      aiEvaluation={aiEvaluation} 
      setAiEvaluation={setAiEvaluation}
      onEvaluate={handleEvaluate}
      isEvaluating={aiLoading}
    >
      <div className={styles.appContainer} style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: 'var(--background)' }}>
        <div className={styles.navBarContainer}>
          <NavBar
            isAuthenticated={isAuthenticated}
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onNewDuck={handleNewDuck}
            onCourses={() => console.log('Courses clicked')}
            onStudyPlan={() => console.log('Study Plan clicked')}
            onSettings={() => console.log('Settings clicked')}
          />
        </div>
        
        <div className={styles.toolBarContainer}>
          <ToolBar
            onHelp={handleHelp}
            onPlay={() => console.log('Play clicked')}
            onPause={() => console.log('Pause clicked')}
            onStop={() => console.log('Stop clicked')}
            showPlaybackControls={false}
            useNewChatStyle={useNewChatStyle}
            onToggleChatStyle={handleToggleChatStyle}
            onToggleQuackMode={handleToggleQuackMode}
            quackMode={quackMode}
            webglRef={webglRef}
          />
        </div>
        
        <div className={styles.webGLContainer}>
          <WebGLComponent 
            ref={webglRef}
          />
        </div>
        
        <div className={styles.rubricContainer}>
          <Rubric />
        </div>
        
        <div className={styles.mainContent} style={{
          backgroundColor: useNewChatStyle ? '#f6f6e9' : '#e0e0e0',
          border: useNewChatStyle ? '1px solid #000' : '1px solid #ccc'
        }}>
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
            <div className="flex-1 flex flex-col w-full h-full">
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
                useNewStyle={useNewChatStyle}
                aiEvaluation={aiEvaluation}
              />
            </div>
          )}
        </div>
        
        <HelpModal open={showHelp} onClose={handleCloseHelp}>
          <h2>Help</h2>
          <p>Welcome to Darwin the Duck! This is an AI-powered learning assistant.</p>
          <p>Use the navigation bar on the left to start a new conversation or access different features.</p>
          <p>The toolbar at the top provides additional controls and settings.</p>
          <button onClick={handleCloseHelp} style={{ marginTop: '10px', padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Close
          </button>
        </HelpModal>
      </div>
    </AIEvaluationProvider>
  );
}

export default App;
