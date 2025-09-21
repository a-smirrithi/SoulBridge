import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { ChatMessage } from '../../types';

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m Aasha, your AI companion. I\'m here to listen and support you. How are you feeling today?',
      sender: 'aasha',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getAashaResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxious') || message.includes('anxiety')) {
      return 'I understand that anxiety can feel overwhelming. Try taking slow, deep breaths - in for 4 counts, hold for 4, out for 4. Remember, this feeling will pass. Would you like to talk about what\'s making you feel anxious?';
    }
    
    if (message.includes('stressed') || message.includes('stress')) {
      return 'Stress is something many students experience. Have you tried breaking down what\'s causing stress into smaller, manageable parts? Sometimes writing things down can help. What specific situation is causing you stress?';
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return 'I\'m sorry you\'re feeling this way. Your feelings are valid, and it\'s okay to feel sad sometimes. Have you been able to talk to someone you trust about this? Sometimes sharing can lighten the load.';
    }
    
    if (message.includes('sleep') || message.includes('tired')) {
      return 'Sleep is so important for mental health. Try establishing a bedtime routine - put away screens an hour before bed, try some gentle stretches or meditation. What time do you usually go to sleep?';
    }
    
    if (message.includes('exam') || message.includes('test') || message.includes('study')) {
      return 'Exam preparation can be stressful! Try the Pomodoro technique - study for 25 minutes, then take a 5-minute break. Also, make sure you\'re getting enough sleep and eating well. What subject are you studying for?';
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re very welcome! I\'m always here when you need someone to talk to. Taking care of your mental health shows great self-awareness and strength.';
    }
    
    const defaultResponses = [
      'I\'m here to listen. Can you tell me more about how you\'re feeling?',
      'That sounds important. How has this been affecting you?',
      'Thank you for sharing that with me. What would help you feel better right now?',
      'It takes courage to reach out. I\'m here to listen and support you. What would be most helpful for you right now?',
      'Your feelings matter, and I want to understand better. Can you describe what this experience is like for you?',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAashaResponse(inputMessage);
      const aashaMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response,
        sender: 'aasha',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aashaMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-base-100 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 p-4 bg-primary text-primary-content rounded-t-lg">
        <img 
          src="/frontend/assets/Copilot_20250914_163714.png" 
          alt="Aasha" 
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">Aasha</h3>
          <p className="text-sm opacity-80">AI Mental Health Companion</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.message}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-base-200 p-3 rounded-lg max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-base-content opacity-60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-base-content opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-base-content opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-base-300">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message to Aasha..."
            className="textarea textarea-bordered flex-1 resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="btn btn-primary"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;