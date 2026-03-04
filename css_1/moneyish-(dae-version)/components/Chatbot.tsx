
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { askBill } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'bill';
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! I'm Bill. Ask me anything about money!", sender: 'bill' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const response = await askBill(userMsg);
    setMessages(prev => [...prev, { text: response, sender: 'bill' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-teal-100">
          <div className="bg-teal-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-teal-400">B</div>
              <div>
                <h4 className="font-bold leading-none">Chat with Bill</h4>
                <span className="text-[10px] text-teal-300 uppercase tracking-widest">Financial Advisor</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-teal-700 p-1 rounded-full transition-colors"><X size={20}/></button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-beige space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.sender === 'user' 
                  ? 'bg-teal-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-teal-900 border border-teal-100 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-teal-100 rounded-bl-none shadow-sm">
                  <Loader2 className="animate-spin text-teal-600" size={16} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-teal-50 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me something..."
              className="flex-1 bg-teal-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button 
              onClick={handleSend}
              className="bg-teal-700 text-white p-2 rounded-full hover:bg-teal-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-teal-700 text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3 hover:bg-teal-800 transition-all transform hover:scale-105"
        >
          <MessageCircle size={24} />
          <span className="font-bold tracking-widest">Ask Bill</span>
        </button>
      )}
    </div>
  );
};
