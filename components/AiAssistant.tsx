import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getAiAssistance } from '../services/geminiService';
import { SendIcon, UserIcon, AiIcon, LoadingIcon } from './icons';

interface AiAssistantProps {
  context: object;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ context, isOpen, setIsOpen, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getAiAssistance(input, context);
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'عذرًا، حدث خطأ أثناء محاولة الحصول على رد. الرجاء المحاولة مرة أخرى.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSend();
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110 print:hidden"
        aria-label="افتح مساعد الذكاء الاصطناعي"
      >
        <AiIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-20 print:hidden">
      <div className="flex justify-between items-center p-4 bg-slate-100 rounded-t-xl border-b border-slate-200">
        <h3 className="font-bold text-slate-800">مساعد المصنع الذكي</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800">&times;</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && <div className="bg-indigo-100 p-2 rounded-full"><AiIcon className="w-5 h-5 text-indigo-600"/></div>}
                    <div className={`${msg.sender === 'user' ? 'bg-white' : 'bg-indigo-50'} p-3 rounded-lg max-w-xs shadow-sm`}>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && <div className="bg-slate-200 p-2 rounded-full"><UserIcon className="w-5 h-5 text-slate-600"/></div>}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full"><AiIcon className="w-5 h-5 text-indigo-600"/></div>
                    <div className="bg-indigo-50 p-3 rounded-lg max-w-xs flex items-center space-x-2 rtl:space-x-reverse">
                        <LoadingIcon className="w-4 h-4 text-indigo-600 animate-spin"/>
                        <p className="text-sm text-slate-500">أفكر...</p>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اسأل عن أي شيء..."
            className="w-full py-2 pl-10 pr-4 bg-slate-100 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white disabled:bg-slate-400 hover:bg-indigo-700 transition"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;