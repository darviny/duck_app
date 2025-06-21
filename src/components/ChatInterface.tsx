import React, { useRef, useEffect, useMemo } from 'react';
import Message from './Message';
import InputBox from './InputBox';

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
  messages: Message[];
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

  useEffect(() => {
    console.log('ChatInterface received messages:', messages);
  }, [messages]);

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
  const latestUserMessageId = useMemo(() => {
    const userMessages = messages.filter(msg => msg.isUser);
    return userMessages.length > 0 ? userMessages[userMessages.length - 1].id : null;
  }, [messages]);

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
            aiEvaluation={aiEvaluation}
            isLatestUserMessage={message.isUser && message.id === latestUserMessageId}
          />
        ))}
      </div>
      <InputBox
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        onKeyPress={handleKeyPress}
        useNewStyle={useNewStyle}
      />
    </div>
  );
};

export default ChatInterface; 