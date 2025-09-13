'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Plus,
  Bot,
  User,
  Loader2,
  Trash2
} from 'lucide-react';
import { getAIAssistantService } from '@/lib/services/ai-assistant-service';
import { AIChat } from '@/types/ai-assistant';

interface ChatPanelProps {
  onRefresh: () => void;
}

export function ChatPanel({ onRefresh }: ChatPanelProps) {
  const [chats, setChats] = useState<AIChat[]>([]);
  const [activeChat, setActiveChat] = useState<AIChat | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiService = getAIAssistantService();

  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      const chatsData = await aiService.getChats();
      setChats(chatsData);
      if (chatsData.length > 0 && !activeChat) {
        setActiveChat(chatsData[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      setLoading(false);
    }
  }, [aiService, activeChat]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateNewChat = async () => {
    try {
      const newChat = await aiService.createChat({
        topic: 'Conversa geral'
      });
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat);
      onRefresh();
    } catch (error) {
      console.error('Erro ao criar novo chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || sendingMessage) return;

    try {
      setSendingMessage(true);
      await aiService.sendMessage(activeChat.id, message.trim());
      
      // Update the active chat with new messages
      const updatedChat = await aiService.getChatById(activeChat.id);
      if (updatedChat) {
        setActiveChat(updatedChat);
        setChats(prev => prev.map(chat => 
          chat.id === activeChat.id ? updatedChat : chat
        ));
      }
      
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4 h-[600px]">
      {/* Chat List */}
      <div className="md:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Conversas</h3>
          <Button size="sm" onClick={handleCreateNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {chats.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma conversa</p>
                <Button size="sm" className="mt-2" onClick={handleCreateNewChat}>
                  Iniciar Chat
                </Button>
              </CardContent>
            </Card>
          ) : (
            chats.map((chat) => (
              <Card
                key={chat.id}
                className={`cursor-pointer transition-colors ${
                  activeChat?.id === chat.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {chat.context.topic}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {chat.messages.length}
                      </Badge>
                    </div>
                    
                    {chat.messages.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.messages[chat.messages.length - 1].content}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {chat.updatedAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="md:col-span-3">
        {!activeChat ? (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Selecione uma conversa ou inicie um novo chat</p>
                <Button className="mt-4" onClick={handleCreateNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Assistente IA
                  </CardTitle>
                  <CardDescription>{activeChat.context.topic}</CardDescription>
                </div>
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Inicie uma conversa com o assistente IA</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Faça perguntas sobre seus produtos, preços, otimizações e muito mais
                  </p>
                </div>
              ) : (
                activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {sendingMessage && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={sendingMessage}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendingMessage}
                  size="sm"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
