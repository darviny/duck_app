import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

interface Message {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Ducky',
      content: "Quack! I'm ready to learn about 'velocity'. Can you explain it to me in simple terms?",
      isUser: false
    },
    {
      id: 2,
      sender: 'Sarah',
      content: "Velocity is the speed of something in a given direction. For example, a car traveling north at 60 mph has a velocity of 60 mph north.",
      isUser: true
    },
    {
      id: 3,
      sender: 'Ducky',
      content: "Quack! So, it's not just how fast something is moving, but also which way it's going?",
      isUser: false
    },
    {
      id: 4,
      sender: 'Sarah',
      content: "Exactly! Speed is just a number, but velocity includes the direction.",
      isUser: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'Sarah',
        content: inputValue,
        isUser: true
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="gap-6 px-12 flex flex-1 justify-center py-8">
          <ChatInterface
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
          />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
