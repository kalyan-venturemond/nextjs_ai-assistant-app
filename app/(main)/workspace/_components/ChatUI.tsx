'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { Send } from 'lucide-react';

import { AssistantContext } from '@/context/AssistantContext';
import { AuthContext } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ChatEmptyUI from '@/app/(main)/workspace/_components/ChatEmptyUI';
import ChatMessage from '@/app/(main)/workspace/_components/ChatMessage';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function ChatUI() {
  const { assistant } = useContext(AssistantContext);
  const { user, setUser } = useContext(AuthContext);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isChatDisabled = isLoading || (user?.credits ?? 0) <= 0;

  const onSuggestionClick = (suggestion: string) => {
    if (!suggestion.trim()) return;
    onSendMessage(suggestion);
  };

  const onSendMessage = async (suggestionMessage?: string) => {
    if (!assistant) return;

    const finalMessage = suggestionMessage || message;
    if (!finalMessage.trim()) return;

    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: finalMessage },
    ]);

    // Only clear the input field if we're sending from the input
    if (!suggestionMessage) setMessage('');

    // Mock API call
    setTimeout(() => {
        const mockResponse: Message = {
            role: 'assistant',
            content: `This is a mock response to "${finalMessage}". The backend is disabled for this demo.`
        };
        
        setIsLoading(false);
        setMessages((prevMessages) => [...prevMessages, mockResponse]);
        updateUserCredits(mockResponse.content);
    }, 1500);
  };

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    setMessages([]);
  }, [assistant?.id]);

  const updateUserCredits = async (contentMessage: string = '') => {
    if (!user) return;

    const tokenCount = contentMessage
      ? contentMessage.trim().split(/\s+/).length
      : 0;

    const credits = (user?.credits || 0) - tokenCount;

    // Update local state only
    setUser({
      ...user,
      credits,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {!messages?.length ? (
        <ChatEmptyUI onSuggestionClick={onSuggestionClick} />
      ) : (
        <div
          ref={scrollRef}
          className="p-6 flex flex-col flex-1 max-h-[calc(100vh-76px-64px)] overflow-y-auto scrollbar-hide"
        >
          {messages.map(({ role, content }, index) => (
            <ChatMessage
              key={index}
              role={role}
              content={content}
              assistantImage={
                role === 'assistant' ? assistant?.image : undefined
              }
            />
          ))}
          {isLoading && (
            <ChatMessage
              role="assistant"
              content="Loading..."
              assistantImage={assistant?.image}
              isLoading={true}
            />
          )}
        </div>
      )}

      <div className="flex justify-between p-5 gap-2">
        <Input
          value={message}
          disabled={isChatDisabled}
          placeholder="Type your message here..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <Button
          disabled={isChatDisabled || !message.trim()}
          onClick={() => onSendMessage()}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatUI;
