import React, { useRef, useEffect, useMemo } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import styles from './Chat.module.scss';
import { ChatMessage as MessageType, AIEvaluationData } from '../types/chat';
import { DuckStates } from '../components/web-gl-component/ThreeJSModules/enums';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../amplify/data/resource';

// Initialize AWS Amplify data client with typed schema for backend operations
const client = generateClient<Schema>();

interface ChatProps {
  messages: MessageType[];
  inputValue: string;
  onInputChange: (value: string) => void;
  useNewStyle?: boolean;
  aiEvaluation?: AIEvaluationData;
  chatSession: any;
  setChatMessages: (messages: MessageType[] | ((prev: MessageType[]) => MessageType[])) => void;
  setLastMessageTime: (time: number) => void;
  lastMessageTime: number;
  evalFlagRef: React.MutableRefObject<boolean>;
}

// Function to parse emotion from Darwin's message
export const parseDuckEmotion = (message: string): { action: DuckStates; cleanMessage: string } => {
  // Look for action in curly brackets at the beginning of the message
  const emotionMatch = message.match(/^\s*\{([^}]+)\}\s*(.*)/);
  
  if (emotionMatch) {
    const emotionText = emotionMatch[1].trim().toLowerCase();
    const cleanMessage = emotionMatch[2].trim();
    
    // Map action text to DuckStates
    switch (emotionText) {
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

// Chat initialization function
export const initializeChat = async (
  currentTopic: string,
  currentSubject: string,
  _quackMode: boolean, // Unused parameter, prefixed with underscore
  setChatMessages: (messages: MessageType[] | ((prev: MessageType[]) => MessageType[])) => void,
  setChatSession: (session: any) => void,
  isChatInitializedRef: React.MutableRefObject<boolean>,
  aiResponseBufferRef: React.MutableRefObject<string>,
  evalFlagRef: React.MutableRefObject<boolean>,
  quackModeRef: React.MutableRefObject<boolean>,
  evaluateMessagesRef: React.MutableRefObject<any>
) => {
  let chatStream: any = null;
  
  try {
    console.log('Starting chat initialization...');
    const { data: newChat } = await client.conversations.chat.create();
    
    if (newChat) {
      console.log('Chat created successfully');
      setChatSession(newChat);
      
      chatStream = newChat.onStreamEvent({
        next: (event: any) => {
          console.log('Stream event received:', event);
          if (event.text) {
            aiResponseBufferRef.current += event.text;
            console.log('Accumulated text so far:', aiResponseBufferRef.current);
          }
          
          if ('stopReason' in event) {
            const completeMessage = aiResponseBufferRef.current;
            console.log('Stream complete, final message:', completeMessage);
            console.log('Stop reason:', event.stopReason);
            console.log('Message length:', completeMessage.length);
            console.log('Message trimmed length:', completeMessage.trim().length);
            
            // Only add the message if it's not empty
            if (completeMessage.trim()) {
              setChatMessages(prev => {
                // Parse duck action from Darwin's message
                const { action, cleanMessage } = parseDuckEmotion(completeMessage);
                
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
                if (evalFlagRef.current) {
                  setTimeout(async () => {
                    console.log('Auto-evaluating after AI response...');
                    await evaluateMessagesRef.current(updatedMessages, currentTopic, currentSubject);
                  }, 1000);
                  evalFlagRef.current = false; // Reset the flag
                }
                
                return updatedMessages;
              });
            } else {
              console.log('Empty AI response received, not adding to chat');
            }
            
            aiResponseBufferRef.current = '';
          }
        },
        error: (error: any) => {
          console.error('Stream error:', error);
          
          // Handle throttling errors specifically
          if (error.errors && error.errors.some((e: any) => e.errorType === 'ThrottlingException')) {
            console.log('Rate limit exceeded - please wait before sending more messages');
            return;
          }
          
          // Handle other errors
        },
      });

      // Send initial topic message
      const { errors } = await newChat.sendMessage(`I am trying to learn about ${currentTopic} in ${currentSubject}. I know nothing about it.`);
      if (errors) {
        console.error('Topic message errors:', errors);
      }
      
      console.log('Initial topic message sent, waiting for response...');
      
      isChatInitializedRef.current = true;
    }
  } catch (error) {
    console.error('Failed to create chat:', error);
  }
  
  // Return cleanup function
  return () => {
    if (chatStream) {
      chatStream.unsubscribe();
    }
  };
};

const Chat: React.FC<ChatProps> = ({
  messages,
  inputValue,
  onInputChange,
  useNewStyle = false,
  aiEvaluation,
  chatSession,
  setChatMessages,
  setLastMessageTime,
  lastMessageTime,
  evalFlagRef,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  // Handle sending messages
  const handleSendMessage = async () => {
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    const minInterval = 2000; // 2 seconds minimum between messages
    
    if (!inputValue.trim() || !chatSession || timeSinceLastMessage < minInterval) {
      if (timeSinceLastMessage < minInterval) {
        console.log('Message throttled - please wait before sending another message');
      }
      return;
    }
    
    const newMessage: MessageType = {
      id: Date.now().toString(),
      sender: 'You',
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setLastMessageTime(now);
    
    // Set flag to evaluate after AI response
    evalFlagRef.current = true;
    
    try {
      const { errors } = await chatSession.sendMessage(inputValue);
      if (errors) {
        console.error('Message send errors:', errors);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      // setIsWaitingForEval(false); // Removed as per edit hint
    }
    
    onInputChange('');
  };

  // Find the latest user message ID
  const latestUserMessageId = useMemo((): string | null => {
    // Use reverse loop for better performance - stops at first match
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        return messages[i].id;
      }
    }
    return null;
  }, [messages]);

  return (
    <div className="layout-content-container flex flex-col flex-1 max-w-4xl mx-auto w-full h-full min-h-0">
      <div 
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto min-h-0 ${styles.chatMessagesContainer}`}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              sender={message.sender}
              content={message.content}
              isUser={message.isUser}
              useNewStyle={useNewStyle}
              aiEvaluation={aiEvaluation}
              isLatestUserMessage={message.isUser && message.id === latestUserMessageId}
            />
          ))
        )}
      </div>
      <div className="flex-shrink-0">
        <InputBox
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          useNewStyle={useNewStyle}
        />
      </div>
    </div>
  );
};

export default Chat; 