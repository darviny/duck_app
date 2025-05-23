import React, { useRef, useEffect } from 'react';
import Message from './Message';
import InputBox from './InputBox';

interface Message {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
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

  return (
    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
      <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Turn 1/5</h3>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-4">
          <p className="text-[#0d141c] text-sm font-medium leading-normal">Explain the concept of 'velocity'</p>
        </div>
      </div>
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[200px]"
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            sender={message.sender}
            content={message.content}
            isUser={message.isUser}
          />
        ))}
      </div>
      <InputBox
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatInterface; 