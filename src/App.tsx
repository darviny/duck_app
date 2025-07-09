// React and core dependencies
import { useState, useEffect, useRef } from 'react';

// AWS Amplify imports
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';

// Component imports
import NavBar from './components/NavBar/NavBar';
import ToolBar from './components/ToolBar/ToolBar';
import Chat, { initializeChat } from './components/Chat';
import TopicSelector from './components/TopicSelector';
import HelpModal from './components/HelpModal';
import { WebGLComponent } from './components/web-gl-component/web-gl-component';
import Rubric from './components/Rubric/Rubric';

// Context and hooks
import { AIEvaluationProvider } from './contexts/AIEvaluationContext';
import { useAIEvaluation } from './hooks/useAIEvaluation';

// Types and enums
import { ChatMessage } from './types/chat';

// Styles
import './App.css';
import styles from './App.module.scss';

// Global reference to AnimationController
declare global {
  interface Window {
    duckAnimationController?: any;
  }
}



function App() {
  // Chat and messaging state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSession, setChatSession] = useState<any>(null);
  const [quackMode, setQuackMode] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  
  // Learning topic and subject state
  const [currentTopic, setCurrentTopic] = useState('Distance Formula in Linear Algebra');
  const [currentSubject, setCurrentSubject] = useState('Algebra');
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // UI state
  const [showTopicSelectorModal, setShowTopicSelectorModal] = useState(false);
  const [useNewChatStyle, setUseNewChatStyle] = useState(false);
  
  // Refs for managing side effects and cross-component communication
  const isChatInitializedRef = useRef(false);
  const aiResponseBufferRef = useRef('');
  const evalFlagRef = useRef(false);
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



  // Authentication functions
  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(true);
      setCurrentUser(currentUser);
    } catch (error) {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
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
      setIsLoggedIn(false);
      setCurrentUser(null);
      setChatSession(null);
      setChatMessages([]);
      isChatInitializedRef.current = false;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // ----------------------
  // Handlers
  // ----------------------

  const handleTopicChange = async (topic: string, subject: string) => {
    setCurrentTopic(topic);
    setCurrentSubject(subject);
    setShowTopicSelectorModal(false);
    setChatMessages([]);
    isChatInitializedRef.current = false;
    setChatSession(null);
    evalFlagRef.current = false; // Reset evaluation flag
    resetEvaluation();
    // Re-initialize will happen in useEffect
  };

  const handleNewDuck = () => {
    setShowTopicSelectorModal(true);
  };

  const handleToggleChatStyle = () => {
    setUseNewChatStyle(!useNewChatStyle);
  };

  const handleToggleQuackMode = () => {
    const newQuackMode = !quackMode;
    setQuackMode(newQuackMode);
  };

  const handleEvaluate = async () => {
    if (chatMessages.length === 0) {
      console.log('No messages to evaluate');
      return;
    }
    console.log('Starting AI evaluation...');
    console.log('Current messages:', chatMessages);
    await evaluateMessages(chatMessages, currentTopic, currentSubject);
  };

  const handleHelp = () => setShowHelp(true);
  const handleCloseHelp = () => setShowHelp(false);


  // ----------------------
  // Hooks
  // ----------------------


  // Check authentication status
  useEffect(() => {
    checkAuth();
  }, []);

  // Initialize chat when authenticated
  useEffect(() => {
    if (!isLoggedIn || isChatInitializedRef.current) return;
    
    let cleanup: (() => void) | undefined;
    
    initializeChat(
      currentTopic,
      currentSubject,
      quackMode,
      setChatMessages,
      setChatSession,
      isChatInitializedRef,
      aiResponseBufferRef,
      evalFlagRef,
      quackModeRef,
      evaluateMessagesRef
    ).then((cleanupFn) => {
      cleanup = cleanupFn;
    });
    
    // Cleanup function: Unsubscribe from chat stream to prevent memory leaks
    // This runs when:
    // 1. Component unmounts (user navigates away)
    // 2. Dependencies change (topic, subject, etc.) - old stream is cleaned up before new one starts
    return () => {
      if (cleanup) {
        cleanup(); // Unsubscribes from chatStream and closes WebSocket connection
      }
    };
  }, [isLoggedIn, currentTopic, currentSubject, quackMode]);

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
            isAuthenticated={isLoggedIn}
            user={currentUser}
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
          {!isLoggedIn ? (
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
          ) : showTopicSelectorModal ? (
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
                <Chat
                  messages={chatMessages}
                  inputValue={chatInput}
                  onInputChange={setChatInput}
                  useNewStyle={useNewChatStyle}
                  aiEvaluation={aiEvaluation}
                  chatSession={chatSession}
                  setChatMessages={setChatMessages}
                  // Removed unused setIsWaitingForEval
                  setLastMessageTime={setLastMessageTime}
                  lastMessageTime={lastMessageTime}
                  evalFlagRef={evalFlagRef}
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
