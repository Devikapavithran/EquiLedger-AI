import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Stakeholder, FundingRound, Company, User as UserType } from '../types';

interface AIAssistantProps {
  user: UserType | null;
  company: Company | null;
  stakeholders: Stakeholder[];
  fundingRounds: FundingRound[];
  totalIssuedShares: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  company, 
  stakeholders, 
  fundingRounds,
  totalIssuedShares
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your EquiLedger AI assistant. I have access to your company's cap table, stakeholders, and funding data. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('who owns') || q.includes('largest share')) {
      const sorted = [...stakeholders].sort((a, b) => b.sharesOwned - a.sharesOwned);
      const top = sorted[0];
      const percent = (top.sharesOwned / totalIssuedShares) * 100;
      return `${top.name} owns the largest share with ${top.sharesOwned.toLocaleString()} shares, which is ${percent.toFixed(2)}% of the company.`;
    }
    
    if (q.includes('founder ownership')) {
      const founderShares = stakeholders
        .filter(s => s.role === 'Founder')
        .reduce((sum, s) => sum + s.sharesOwned, 0);
      const percent = (founderShares / totalIssuedShares) * 100;
      return `Founders currently own ${percent.toFixed(2)}% of the company (${founderShares.toLocaleString()} shares).`;
    }

    if (q.includes('dilution') || q.includes('last round')) {
      if (fundingRounds.length === 0) return "No funding rounds have been recorded yet, so there has been no dilution from external investment.";
      const last = fundingRounds[fundingRounds.length - 1];
      const dilution = (last.investmentAmount / last.postMoneyValuation) * 100;
      return `After the ${last.roundName}, the company was diluted by ${dilution.toFixed(1)}%. The post-money valuation was $${(last.postMoneyValuation / 1000000).toFixed(1)}M.`;
    }

    if (q.includes('total shares') || q.includes('issued')) {
      return `There are currently ${totalIssuedShares.toLocaleString()} issued shares out of ${company?.authorizedShares.toLocaleString()} authorized shares.`;
    }

    if (q.includes('valuation')) {
      if (fundingRounds.length === 0) return "The company has no recorded valuation from funding rounds yet.";
      const last = fundingRounds[fundingRounds.length - 1];
      return `The latest valuation is $${(last.postMoneyValuation / 1000000).toFixed(1)}M (Post-money), established during the ${last.roundName}.`;
    }

    return "I can help with questions about ownership, dilution, valuations, and stakeholder breakdown. Try asking 'Who owns the largest share?' or 'What is founder ownership?'";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="text-primary" />
          AI Assistant
        </h2>
        <p className="text-slate-500">Intelligent insights based on your real-time cap table data.</p>
      </div>

      <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-background border border-border'
                }`}>
                  {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-primary" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-background text-slate-900 rounded-tl-none border border-border shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="bg-background border border-border p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your cap table..."
              className="w-full pl-4 pr-12 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg hover:bg-[#DB2777] disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Who owns the most?', 'What is founder ownership?', 'Explain dilution'].map((hint) => (
              <button 
                key={hint}
                onClick={() => setInput(hint)}
                className="text-xs font-medium text-slate-600 bg-white border border-border px-3 py-1.5 rounded-full hover:bg-pink-50 hover:text-primary transition-colors whitespace-nowrap"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
