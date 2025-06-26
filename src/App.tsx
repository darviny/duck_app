import './App.css';
import { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
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
import { useAIEvaluation } from './hooks/useAIEvaluation';
import { Message } from './types/chat';

// Global reference to AnimationController
declare global {
  interface Window {
    duckAnimationController?: any;
  }
}

const client = generateClient<Schema>();

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
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const initializedRef = useRef(false);
  const accumulatedTextRef = useRef('');
  const shouldEvaluateRef = useRef(false);
  const quackModeRef = useRef(quackMode);
  const webglRef = useRef(null);

  // Use the decoupled AI evaluation hook
  const {
    aiEvaluation,
    setAiEvaluation,
    evaluateMessages,
    resetEvaluation,
    isEvaluating: aiLoading,
    hasEvaluation
  } = useAIEvaluation({
    onEvaluationComplete: (evaluation) => {
      console.log('AI Evaluation completed:', evaluation);
    },
    onEvaluationError: (error) => {
      console.error('AI Evaluation error:', error);
    }
  });

  const evaluateMessagesRef = useRef(evaluateMessages);

  // State for Help modal
  const [showHelp, setShowHelp] = useState(false);

  // Update refs when values change
  useEffect(() => {
    quackModeRef.current = quackMode;
  }, [quackMode]);

  useEffect(() => {
    evaluateMessagesRef.current = evaluateMessages;
  }, [evaluateMessages]);

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

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setIsAuthenticated(true);
        setUser(currentUser);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Initialize chat when authenticated
  useEffect(() => {
    if (!isAuthenticated || initializedRef.current) return;
    
    let subscription: any = null;
    
    const initializeChat = async () => {
      try {
        console.log('Starting chat initialization...');
        const { data: newChat } = await client.conversations.chat.create();
        
        if (newChat) {
          console.log('Chat created successfully');
          setChat(newChat);
          
          subscription = newChat.onStreamEvent({
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
                      id: Date.now().toString(),
                      sender: 'Darwin the Duck',
                      content: quackModeRef.current ? `${cleanMessage} Quack!` : cleanMessage,
                      isUser: false,
                      timestamp: new Date()
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
                        await evaluateMessagesRef.current(updatedMessages, currentTopic, currentSubject);
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
              
              // Handle throttling errors specifically
              if (error.errors && error.errors.some((e: any) => e.errorType === 'ThrottlingException')) {
                console.log('Rate limit exceeded - please wait before sending more messages');
                setIsLoading(false);
                return;
              }
              
              // Handle other errors
              setIsLoading(false);
            },
          });

          // Send initial topic message
          const { errors } = await newChat.sendMessage(`I am trying to learn about ${currentTopic} in ${currentSubject}. I know nothing about it.`);
          if (errors) {
            console.error('Topic message errors:', errors);
          }
          
          console.log('Initial topic message sent, waiting for response...');
          
          initializedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    };

    initializeChat();
    
    // Cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isAuthenticated, currentTopic, currentSubject, quackMode]);

  const handleTopicChange = async (topic: string, subject: string) => {
    setCurrentTopic(topic);
    setCurrentSubject(subject);
    setShowTopicSelector(false);
    
    // Clear existing messages and restart chat
    setMessages([]);
    initializedRef.current = false;
    setChat(null);
    shouldEvaluateRef.current = false; // Reset evaluation flag
    
    // Reset AI evaluation
    resetEvaluation();
    
    // Re-initialize will happen in useEffect
  };

  const handleSendMessage = async () => {
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    const minInterval = 2000; // 2 seconds minimum between messages
    
    if (!inputValue.trim() || !chat || isLoading || timeSinceLastMessage < minInterval) {
      if (timeSinceLastMessage < minInterval) {
        console.log('Message throttled - please wait before sending another message');
      }
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setLastMessageTime(now);
    
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
    
    await evaluateMessages(messages, currentTopic, currentSubject);
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
      hasEvaluation={hasEvaluation}
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
            <div className="flex-1 flex flex-col w-full h-full min-h-0">
              <div className="flex justify-center items-center p-6 flex-shrink-0">
                <div className="space-y-1 text-center">
                  <h2 className="text-gray-600 font-medium" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    Current Topic:
                  </h2>
                  <h3 className="text-gray-900 font-semibold" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3rem', letterSpacing: 'normal' }}>
                    {currentTopic}
                  </h3>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ChatInterface
                  messages={messages}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSendMessage={handleSendMessage}
                  useNewStyle={useNewChatStyle}
                  aiEvaluation={aiEvaluation}
                />
              </div>
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
