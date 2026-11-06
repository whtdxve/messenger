'use client'

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from 'react'
import { getCurrentUser } from './actions/auth';
import { authUser, getUserChats } from './api/api';
import Chat from '../components/chat';
import { ChatInitializer } from '@/types/types';

export default function BillboardPage() {
  // const cookieStore = await cookies();
  // const token = cookieStore.get('auth-token');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // if (!token) {
  //   redirect('/login');
  // }


  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [chatInitializer, setChatInitializer] = useState<ChatInitializer | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Функция для onFocus: просто показываем подсказки
  const handleInputFocus = () => {
    setIsVisible(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (suggestionsRef.current && suggestionsRef.current.contains(e.relatedTarget as Node)) {
      // Фокус перешёл на подсказку, НЕ скрываем список
      return; // <-- ВАЖНО: setIsVisible НЕ вызывается здесь
    }
    // Если фокус ушёл на другой элемент, скрываем список
    setIsVisible(false); // <-- setIsVisible вызывается ТОЛЬКО здесь
  };

  const handleSuggestionClick = (suggestionId: number) => {
    setChatInitializer({ type: 'userId', data: suggestionId });
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setSuggestions([]);
    setIsVisible(false);
  }

  useEffect(() => {
    const fetchUserChats = async () => {
      const chats = await getUserChats();
      setChats(chats);
    }
    fetchUserChats();
  }, []);

  const search = () => {
    const searchInput = searchInputRef.current;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const query = searchInput?.value.trim();

      if (!query) {
        setSuggestions([]);
        return
      }

      try {
        const response = await fetch(`http://localhost:3000/search?name=${encodeURIComponent(query)}`);
        const suggestions = await response.json();
        setSuggestions(suggestions)
      } catch {

      }
    }, 300);
  }

  return (
    <main className='flex gap-2 w-screen p-5'>
      <div className="flex-col rounded-xl bg-blue-100 p-2">
        <div className="relative">
          <input
            ref={searchInputRef}
            onInput={search}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            type="text"
            id="searchInput"
            placeholder="Введите имя пользователя..."
          />
          {isVisible && suggestions.length > 0 && (
            <div ref={suggestionsRef} id="suggestionsList" className={`absolute top-6 bg-blue-500 rounded-md`}>
              {suggestions.map((suggestion) => (
                <div
                  className='cursor-pointer select-none'
                  key={suggestion.id}
                  tabIndex={0}
                  onClick={() => {handleSuggestionClick(suggestion.id)}}
                  data-tag={suggestion.tag}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          {chats.map((chat) => (
            <div
              className="bg-blue-300 p-2 rounded-md cursor-pointer select-none"
              key={chat.id}
              data-id={chat.id}
              onClick={() => setChatInitializer({ type: 'chatId', data: chat.id })}
            >
              {chat.name}
            </div>
          ))}
        </div>
      </div>
      <div id="chat-container" className='flex-1'>
        {chatInitializer && <Chat chatInitializer={chatInitializer} />}
      </div>
    </main>
  );
}
