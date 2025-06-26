import React, { useRef, useEffect, useMemo } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import styles from './ChatInterface.module.scss';
import { Message as MessageType, AIEvaluationData } from '../types/chat';

interface ChatInterfaceProps {
  messages: MessageType[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  useNewStyle?: boolean;
  aiEvaluation?: AIEvaluationData;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  useNewStyle = false,
  aiEvaluation,
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
      onSendMessage();
    }
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
          onSendMessage={onSendMessage}
          onKeyPress={handleKeyPress}
          useNewStyle={useNewStyle}
        />
      </div>
    </div>
  );
};

export default ChatInterface; 