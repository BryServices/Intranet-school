import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, MoreVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

interface ChatScreenProps {
  onClose: () => void;
}

const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Salut tout le monde ! Quelqu\'un a les notes du cours d\'hier ?',
    senderId: 'u2',
    senderName: 'Sarah L.',
    timestamp: new Date(Date.now() - 3600000),
    isMe: false,
    avatarUrl: 'https://picsum.photos/seed/sarah/50'
  },
  {
    id: '2',
    text: 'Oui je viens de les poster sur le Drive de la classe.',
    senderId: 'u3',
    senderName: 'Thomas B.',
    timestamp: new Date(Date.now() - 1800000),
    isMe: false,
    avatarUrl: 'https://picsum.photos/seed/thomas/50'
  },
  {
    id: '3',
    text: 'Top, merci Thomas ! 🙏',
    senderId: 'u1',
    senderName: 'Moi',
    timestamp: new Date(Date.now() - 900000),
    isMe: true,
  }
];

const ChatScreen: React.FC<ChatScreenProps> = ({ onClose }) => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(DUMMY_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      senderId: user?.id || 'u1',
      senderName: 'Moi',
      timestamp: new Date(),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-bgLight dark:bg-bgDark flex flex-col"
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-surfaceDark/80 backdrop-blur-md px-4 py-3 border-b border-borderLight dark:border-borderDark flex items-center justify-between shadow-sm z-10 pt-safe-top">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <X size={24} className="text-textMainLight dark:text-textMainDark" />
            </button>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img 
                        src="https://picsum.photos/seed/class/100" 
                        className="w-10 h-10 rounded-full border border-borderLight dark:border-borderDark"
                        alt="Class Group"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-surfaceDark"></div>
                </div>
                <div>
                    <h3 className="font-bold text-textMainLight dark:text-textMainDark text-sm">Master 1 - Génie Logiciel</h3>
                    <p className="text-xs text-textSecLight dark:text-textSecDark">32 membres • 5 en ligne</p>
                </div>
            </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-textMainLight dark:text-textMainDark">
            <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start items-end gap-2'}`}
          >
            {!msg.isMe && (
                <img 
                    src={msg.avatarUrl} 
                    alt={msg.senderName} 
                    className="w-8 h-8 rounded-full mb-1"
                />
            )}
            <div className={`max-w-[75%] rounded-[20px] px-5 py-3 shadow-sm text-[15px] leading-relaxed relative ${
              msg.isMe 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white dark:bg-surfaceDark text-textMainLight dark:text-textMainDark rounded-bl-none'
            }`}>
                {!msg.isMe && <p className="text-[10px] font-bold text-primary mb-0.5">{msg.senderName}</p>}
                <p>{msg.text}</p>
                <span className={`text-[10px] absolute bottom-1 right-3 ${msg.isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.timestamp.getHours()}:{msg.timestamp.getMinutes().toString().padStart(2, '0')}
                </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-surfaceDark border-t border-borderLight dark:border-borderDark pb-safe-bottom">
        <form onSubmit={handleSend} className="flex items-end gap-2 max-w-md mx-auto">
            <button type="button" className="p-3 text-textSecLight dark:text-textSecDark hover:text-primary transition-colors">
                <Paperclip size={24} />
            </button>
            <div className="flex-1 bg-gray-100 dark:bg-black/20 rounded-[24px] px-4 py-3 flex items-center">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent outline-none text-textMainLight dark:text-textMainDark placeholder-gray-400 max-h-32"
                />
            </div>
            <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
                <Send size={20} className="ml-0.5" />
            </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatScreen;
