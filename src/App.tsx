import './App.css';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

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
      sender: 'Darwin the Duck',
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
      sender: 'Darwin the Duck',
      content: "Quack! So, it's not just how fast something is moving, but also which way it's going?",
      isUser: false
    },
    {
      id: 4,
      sender: 'Sarah',
      content: "Exactly! Speed is just a number, but velocity includes the direction.",
      isUser: true
    },
    {
      id: 5,
      sender: 'Darwin the Duck',
      content: "Darvin is cool.",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  // State to store the active chat conversation instance
  // Using any type as a temporary solution - could be improved with proper typing
  const [chat, setChat] = useState<any>(null);

  // Effect hook to initialize the chat when component mounts
  useEffect(() => {
    // Async function to handle chat initialization
    const initializeChat = async () => {
      try {
        console.log('Starting chat initialization...');
        // Check if user is authenticated
        const user = await getCurrentUser();
        console.log('Current user:', user);
        
        // Create a new chat conversation using Amplify's client
        const { data: newChat } = await client.conversations.chat.create();
        console.log('Chat creation response:', newChat);
        
        // Only proceed if chat creation was successful
        if (newChat) {
          console.log('Chat created successfully, setting up stream...');
          // Store the chat instance in state for future use
          setChat(newChat);
          
          // Set up real-time subscription to receive AI responses
          // This creates a stream of events that we can listen to
          const subscription = newChat.onStreamEvent({
            // Callback for handling incoming messages/events
            next: (event) => {
              // Check if the event contains text content
              if (event.text) {
                // Update messages state with the new AI response
                // Using functional update to ensure we have the latest state
                setMessages(prev => [...prev, {
                  id: prev.length + 1,        // Generate a unique ID
                  sender: 'Darwin the Duck',            // AI assistant's name
                  content: event.text,        // The actual message content
                  isUser: false               // Flag to indicate this is an AI message
                }]);
              }
            },
            // Error handling for the stream
            error: (error) => {
              console.error('Stream error:', error);
            },
          });

          // Cleanup function to unsubscribe from the stream
          // This prevents memory leaks when component unmounts
          return () => subscription.unsubscribe();
        }
      } catch (error) {
        // Handle any errors during chat initialization
        console.error('Failed to create chat:', error);
      }
    };

    // Execute the initialization function
    initializeChat();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSendMessage = async () => {
    console.log('Send button clicked');
    console.log('Current chat state:', chat);
    console.log('Current input value:', inputValue);
    
    if (inputValue.trim() && chat) {
      console.log('Conditions met, proceeding with message send');
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'Sarah',
        content: inputValue,
        isUser: true
      };
      // Update the UI immediately with the user's message
      // Using functional update pattern to ensure we're working with the latest state
      // This creates a new array with all previous messages plus the new one
      setMessages(prev => [...prev, newMessage]);
      
      try {
        // Send the message to the AI through the Amplify chat service
        // This is an async operation that communicates with the backend
        const { data: message, errors } = await chat.sendMessage(inputValue);
        if (errors) {
          console.error('Message send errors:', errors);
        }
        // Note: The AI's response will be handled by the stream subscription
        // we set up in the useEffect hook
      } catch (error) {
        // Handle any errors that occur during message sending
        // This could be network errors, authentication issues, etc.
        console.error('Failed to send message:', error);
      }
      
      // Clear the input field after sending
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
