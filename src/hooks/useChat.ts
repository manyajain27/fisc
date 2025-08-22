import { useState, useCallback } from 'react';
import { generateChatResponse, getQuickResponse, type ChatMessage } from '@/lib/groq';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hi! I'm FiscAI, your personal tax optimization assistant. I can help you with:\n\n• Tax regime comparison (Old vs New)\n• Investment tax planning\n• Deductions & exemptions\n• Tax-loss harvesting\n• Holding period optimization\n\nWhat would you like to know about your taxes today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Check for quick responses first
      const quickResponse = getQuickResponse(userMessage);
      
      let responseContent: string;
      
      if (quickResponse) {
        responseContent = quickResponse;
      } else {
        // Convert messages to ChatMessage format for Groq
        const conversationHistory: ChatMessage[] = messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

        responseContent = await generateChatResponse(userMessage, conversationHistory);
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or feel free to ask a different question.",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: "👋 Hi! I'm FiscAI, your personal tax optimization assistant. I can help you with:\n\n• Tax regime comparison (Old vs New)\n• Investment tax planning\n• Deductions & exemptions\n• Tax-loss harvesting\n• Holding period optimization\n\nWhat would you like to know about your taxes today?",
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};