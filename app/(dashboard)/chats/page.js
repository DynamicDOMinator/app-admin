'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import { chatsApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';
import io from 'socket.io-client';

export default function ChatsPage() {
  const { lang } = useLanguage();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const res = await chatsApi.getChats();
      if (res && res.data) {
        setChats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch chats', err);
      toast.error(lang === 'ar' ? 'فشل في تحميل المحادثات' : 'Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  };

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Setup main socket connection for real-time list updates
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Admin socket connected');
    });

    socket.on('new_message', (msg) => {
      // Update list's last message
      setChats(prev => {
        return prev.map(chat => {
          if (chat._id === msg.chat) {
            return {
              ...chat,
              lastMessage: msg,
              lastMessageAt: msg.createdAt,
            };
          }
          return chat;
        });
      });

      // If this message belongs to the currently open chat, append it
      setMessages(prev => {
        if (selectedChat && msg.chat === selectedChat._id) {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        }
        return prev;
      });

      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChat]);

  // Handle selected chat change
  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await chatsApi.getMessages(selectedChat._id);
        if (res && res.data) {
          setMessages(res.data);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100);
        }
      } catch (err) {
        console.error('Failed to load messages', err);
        toast.error(lang === 'ar' ? 'فشل في تحميل الرسائل' : 'Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    // Join room
    if (socketRef.current) {
      socketRef.current.emit('join_chat', selectedChat._id);
    }

    return () => {
      if (socketRef.current && selectedChat) {
        socketRef.current.emit('leave_chat', selectedChat._id);
      }
    };
  }, [selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat || sending) return;

    const content = inputText;
    setInputText('');
    setSending(true);

    try {
      const res = await chatsApi.sendMessage(selectedChat._id, { content });
      if (res && res.data) {
        setMessages(prev => {
          if (prev.some(m => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      toast.error(lang === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getCustomerParticipant = (chat) => {
    return chat.participants?.find(p => p.role === 'customer') || chat.participants?.[0] || {};
  };

  const filteredChats = chats.filter(chat => {
    const customer = getCustomerParticipant(chat);
    const searchString = `${customer.name || ''} ${chat.order?.orderNumber || ''}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatChatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">
      {/* Chats List Pane */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white dark:bg-dark-100 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-dark-50/20">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-right">
            {lang === 'ar' ? 'المحادثات المباشرة' : 'Live Chats'}
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder={lang === 'ar' ? 'البحث عن عميل أو طلب...' : 'Search customer or order...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-white dark:bg-dark-200 border border-gray-200 dark:border-white/5 rounded-2xl py-2.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-right"
            />
            <Search size={16} className="absolute right-3.5 top-3 text-gray-400" />
          </div>
        </div>

        {/* Chats Roll */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingChats ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'جاري تحميل المحادثات...' : 'Loading chats...'}
              </p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <MessageSquare size={36} className="text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {lang === 'ar' ? 'لا توجد محادثات نشطة' : 'No active chats'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lang === 'ar' ? 'كل استفسارات العملاء والطلبات ستظهر هنا' : 'Customer inquiries & order chats will appear here'}
              </p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const customer = getCustomerParticipant(chat);
              const isSelected = selectedChat?._id === chat._id;
              const hasOrder = chat.type === 'order_chat' && chat.order;
              
              return (
                <button
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 text-right ${
                    isSelected 
                      ? 'bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30' 
                      : 'hover:bg-gray-50 dark:hover:bg-dark-50/50 border border-transparent'
                  }`}
                >
                  {/* User Avatar */}
                  <div className="w-11 h-11 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0">
                    {customer.name ? customer.name[0].toUpperCase() : 'U'}
                  </div>

                  {/* Room Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatChatDate(chat.lastMessageAt || chat.updatedAt)}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {customer.name || (lang === 'ar' ? 'عميل غير مسجل' : 'Anonymous User')}
                      </span>
                    </div>

                    {/* Order Tag */}
                    {hasOrder && (
                      <div className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded text-[10px] font-bold mb-1.5 self-end">
                        <Hash size={10} />
                        <span>{chat.order?.orderNumber}</span>
                      </div>
                    )}

                    {/* Last Message */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage?.content || (lang === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet')}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col bg-white dark:bg-dark-100 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        {selectedChat ? (
          <>
            {/* Conversation Header */}
            {(() => {
              const customer = getCustomerParticipant(selectedChat);
              return (
                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-dark-50/20 flex justify-between items-center flex-row-reverse">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-lg">
                      {customer.name ? customer.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {customer.name || (lang === 'ar' ? 'عميل المتجر' : 'Client')}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 flex-row-reverse mt-0.5">
                        <Phone size={10} />
                        <span>{customer.phone || '—'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Chat Metadata & Links */}
                  <div className="flex items-center gap-2">
                    {selectedChat.order && (
                      <Link
                        href={`/orders?id=${selectedChat.order._id || selectedChat.order}`}
                        className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-3 py-1.5 rounded-full font-bold hover:bg-teal-100 transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>{lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</span>
                      </Link>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-dark-200 px-3 py-1.5 rounded-full font-medium">
                      {selectedChat.type === 'order_chat' 
                        ? (lang === 'ar' ? 'شات طلب' : 'Order Support') 
                        : (lang === 'ar' ? 'دعم فني عام' : 'General Support')}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Messages Pane */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-dark-200/10">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderRole === 'super_admin' || msg.senderRole === 'admin' || msg.senderRole === 'call_center';
                  
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col max-w-[70%] ${isMe ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                    >
                      {/* Name of sender */}
                      <span className="text-[10px] text-gray-400 mb-1 px-1">
                        {isMe ? (lang === 'ar' ? 'أنت' : 'You') : (msg.sender?.name || (lang === 'ar' ? 'العميل' : 'Customer'))}
                      </span>
                      
                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl shadow-sm text-right text-sm leading-6 ${
                          isMe 
                            ? 'bg-primary-500 text-white rounded-tl-sm' 
                            : 'bg-white dark:bg-dark-50 text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-tr-sm'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[9px] text-gray-400 mt-1 px-1">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-dark-100 flex gap-3">
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-100 dark:disabled:bg-dark-200 text-white disabled:text-gray-400 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send size={18} className="rtl:rotate-180" />
              </button>
              
              <input
                type="text"
                placeholder={lang === 'ar' ? 'اكتب رسالة الرد هنا...' : 'Type your reply message...'}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-dark-200 border border-gray-200 dark:border-white/5 rounded-2xl px-5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-right"
              />
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/10">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-3xl flex items-center justify-center mb-4">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">
              {lang === 'ar' ? 'اختر محادثة لبدء الدردشة' : 'Select a Conversation to Start'}
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mt-1">
              {lang === 'ar' 
                ? 'اختر عميلاً من القائمة الجانبية للرد على استفساراته وتقديم الدعم الفني له في الوقت الفعلي.' 
                : 'Choose a customer from the sidebar list to reply to their inquiries and assist them in real-time.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
