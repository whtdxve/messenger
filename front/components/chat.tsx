'use client'

import { useEffect, useState, useRef } from "react";
import { authUser, getChatData, getOpponentData, sendMessage } from "@/app/api/api";
import { io, Socket } from 'socket.io-client';
import { ChatInitializer, ChatData, Message, OpponentData } from "@/types/types";

export default function Chat({ chatInitializer }: { chatInitializer: ChatInitializer }) {
    const [chatData, setChatData] = useState<ChatData | null>(null);
    const [userData, setUserData] = useState<OpponentData | null>(null);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [chatId, setChatId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Устанавливает стейт chatId или userId в зависимости от того, что передается в компонент
    useEffect(() => {
        if (chatInitializer.type == 'chatId') {
            setUserId(null);
            setChatId(chatInitializer.data);
        }
        if (chatInitializer.type == 'userId') {
            setChatId(null);
            setChatData(null);
            setUserId(chatInitializer.data);
        }
    }, [chatInitializer]);

    // Получает информацию чата
    useEffect(() => {
        const fetchChatInfo = async () => {
            const data = await getChatData(chatInitializer.data);
            setChatData(data.chat);
            setUserData(data.opponent);
        };
        fetchChatInfo();
    }, [chatId]);

    // Получает информацию опонента
    useEffect(() => {
        const fetchOpponentData = async () => {
            const data = await getOpponentData(chatInitializer.data);
            setUserData(data);
        };
        fetchOpponentData();
    }, [userId]);

    // Усправляет состоянием сокета
    useEffect(() => {
        const newSocket = io('http://localhost:3000');

        newSocket.on('connect', () => {
            console.log('WebSocket connected');
            // Присоединяемся к комнате чата
            newSocket.emit('joinChat', { chatId: chatInitializer.data.toString() });
        });

        newSocket.on('newMessage', (receivedMessage: Message) => {
            setChatData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, receivedMessage]
                };
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [chatId]);

    // Прокручивает чат в низ
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData?.messages]);

    // Отправляет сообщение
    async function fetchSendMessage() {
        if (!message.trim()) return;
        const user = await authUser();
        if (socket && chatId) {
            socket.emit('sendMessage', {
                content: message,
                chatId: chatId,
                userId: user.id
            });
        }
        setMessage("");
    }

    // Отправляет первое сообщение
    async function fetchFirstSendMessage() {
        if (!message.trim()) return;
        const user = await authUser();
        
        setMessage("");
    }

    return (
        <div className='flex flex-col flex-1'>
            {chatData && chatData.messages ? (
                <div className='flex flex-col bg-blue-100 rounded-xl flex-1 p-2 gap-2'>
                    <div>{userData ? `${userData.name}` : 'Загрузка...'}</div>

                    <div className='flex flex-col gap-2'>
                        <div className='bg-white rounded-xl h-40 overflow-y-auto p-2'>
                            {chatData.messages.map((message) => (
                                <div key={message.id} data-tag={message.id}>{message.content}</div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className='flex gap-2'>
                            <input
                                id="message-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className='bg-white rounded-md flex-1 p-1'
                                placeholder='Сообщение'
                                onKeyDown={(e) => e.key === 'Enter' && fetchSendMessage()}
                            />
                            <div onClick={fetchSendMessage} className='cursor-pointer'>✉️</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col bg-blue-100 rounded-xl flex-1 p-2 gap-2'>
                    <div>{userData ? `${userData.name}` : 'Загрузка...'}</div>

                    <div className='flex flex-col gap-2'>
                        <div className='bg-white rounded-xl h-40 overflow-y-auto p-2'>
                            <div>Напишите что-нибудь</div>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                id="message-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className='bg-white rounded-md flex-1 p-1'
                                placeholder='Сообщение'
                                onKeyDown={(e) => e.key === 'Enter' && fetchFirstSendMessage()}
                            />
                            <div onClick={fetchFirstSendMessage} className='cursor-pointer'>✉️</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
