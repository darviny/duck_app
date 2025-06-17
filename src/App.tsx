import './App.css';
import { useState, useEffect, useRef } from 'react';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chat, setChat] = useState<any>(null);
  const initializedRef = useRef(false);
  
  // Use a ref to store accumulated text chunks from the AI response
  // This avoids state update issues and ensures we capture all chunks
  const accumulatedTextRef = useRef('');

  // Effect hook to initialize the chat when component mounts
  useEffect(() => {
    // Async function to handle chat initialization
    const initializeChat = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        console.log('Starting chat initialization...');
        // Check if user is authenticated
        const user = await getCurrentUser();
        console.log('Current user:', user);
        
        // Create a new chat conversation using Amplify's client
        const { data: newChat } = await client.conversations.chat.create();
        console.log('Chat created:', newChat);
        
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
              // Handle incoming text chunks from the AI
              if (event.text) {
                // Append each text chunk to our accumulated text
                accumulatedTextRef.current += event.text;
              }
              
              // Check if this is the final event in the stream
              if ('stopReason' in event) {
                // Capture the complete message before resetting the ref
                const completeMessage = accumulatedTextRef.current;
                console.log('Stream complete, final message:', completeMessage);
                
                // Add the complete message to the chat history
                setMessages(prev => {
                  const newMessages = [...prev, {
                    id: prev.length + 1,
                    sender: 'Darwin the Duck',
                    content: completeMessage,
                    isUser: false
                  }];
                  console.log('Updated messages state:', newMessages);
                  return newMessages;
                });
                
                // Reset the accumulated text for the next message
                accumulatedTextRef.current = '';
              }
            },
            // Error handling for the stream
            error: (error) => {
              console.error('Stream error:', error);
            },
          });

          // Cleanup function to unsubscribe from the stream
          // This prevents memory leaks when component unmounts
          return () => {
            subscription.unsubscribe();
            initializedRef.current = false;
          };
        }
      } catch (error) {
        // Handle any errors during chat initialization
        console.error('Failed to create chat:', error);
        initializedRef.current = false;
      }
    };

    // Execute the initialization function
    initializeChat();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSendMessage = async () => {
    if (inputValue.trim() && chat) {
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
        const { errors } = await chat.sendMessage(inputValue);
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
          <Sidebar messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default App;
