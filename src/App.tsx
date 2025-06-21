import { useState, useRef } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

import Layout from './components/Layout/Layout';
import ChatInterface, { ChatInterfaceRef } from './components/ChatInterface';
import TopicSelector from './components/TopicSelector';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AIEvaluationResults {
  clarity: number;
  accuracy: number;
  engagement: number;
  suggestions: string[];
  evidence: string[];
  overall_comment: string;
}

function App() {
  
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);
  const [currentLearningTopic, setCurrentLearningTopic] = useState('Distance Formula');
  const [currentSubject, setCurrentSubject] = useState('Linear Algebra');
  const [shouldShowTopicSelector, setShouldShowTopicSelector] = useState(false);
  const [shouldUseNewChatStyle, setShouldUseNewChatStyle] = useState(false);
  const { user, signOut, authStatus } = useAuthenticator();
  const isUserLoggedIn = authStatus === 'authenticated';
  const [aiEvaluationResults, setAiEvaluationResults] = useState<AIEvaluationResults>({
    clarity: 0,
    accuracy: 0,
    engagement: 0,
    suggestions: [],
    evidence: [],
    overall_comment: ''
  });
  
// ============================================================================
// EVENT HANDLER FUNCTIONS
// ============================================================================
  
  const handleTopicChange = async (newTopic: string, newSubject: string) => {
    setCurrentLearningTopic(newTopic);
    setCurrentSubject(newSubject);
    setShouldShowTopicSelector(false);
    chatInterfaceRef.current?.resetChat();
  };

  const handleStartNewLearningSession = () => {
    setShouldShowTopicSelector(true);
  };

  const handleSignOutWithChatReset = () => {
    signOut();
    chatInterfaceRef.current?.resetChat();
  };

  const handleToggleChatStyle = () => {
    setShouldUseNewChatStyle(!shouldUseNewChatStyle);
  };

// ============================================================================
// RENDER SECTION
// ============================================================================
  
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden font-dm-sans bg-background">
      <Layout
        isAuthenticated={isUserLoggedIn}
        user={user}
        onSignOut={handleSignOutWithChatReset}
        onNewDuck={handleStartNewLearningSession}
        aiEvaluation={aiEvaluationResults}
        onEvaluate={() => {}}
        isEvaluating={false}
        useNewChatStyle={shouldUseNewChatStyle}
        onToggleChatStyle={handleToggleChatStyle}
        onToggleQuackMode={() => chatInterfaceRef.current?.toggleQuackMode()}
        quackMode={chatInterfaceRef.current?.isQuackModeEnabled ?? false}
      >
        <div className="w-full h-full flex flex-col">
          {shouldShowTopicSelector ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <TopicSelector 
                onTopicChange={(_prompt, topic, subject) => handleTopicChange(topic, subject)} 
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-center items-center p-6">
                <div className="space-y-1 text-center">
                  <h2 className="text-gray-600 font-medium text-sm tracking-wide">
                    Current Topic:
                  </h2>
                  <h3 className="text-gray-900 font-semibold text-xl">
                    {currentLearningTopic}
                  </h3>
                </div>
              </div>
              <ChatInterface
                ref={chatInterfaceRef}
                useNewStyle={shouldUseNewChatStyle}
                currentLearningTopic={currentLearningTopic}
                currentSubject={currentSubject}
                isUserLoggedIn={isUserLoggedIn}
                onEvaluationChange={setAiEvaluationResults}
              />
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;
