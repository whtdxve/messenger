'use server'

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SERVER_URL = process.env.SERVER_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

// Создает запрос и отправляет его на бек
async function request(method: string, flag: string, body?: Record<string, any>) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token")?.value;
    const response = await fetch(`${SERVER_URL}${flag}`, {
        method: method,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    const data = response.json();
    return data;
}

// Дает данные авторизированного пользователя
export async function authUser() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token")?.value;

    if (authToken && SECRET_KEY) {
        const verified = await jwtVerify(authToken, SECRET_KEY);
        const sub = verified.payload.sub;
        const response = await request('GET', `/users/${sub}`);
        return response;
    } else {
        return "Нет токена или секрета";
    }
}

// Дает данные опонента
export async function getOpponentData(userId: number) {
    const response = await request('GET', `/users/get-opponent-data/${userId}`);
    return response;
}

// Дает чаты пользователя
export async function getUserChats() {
    const response = await request('GET', '/users/get-user-chats');
    return response;
}

// Дает информацию чата
export async function getChatData(chatId: number) {
    const response = await request('GET', `/chats/get-chat-data/${chatId}`);
    return response;
}

// Отправляет сообщение
export async function sendMessage(chatId: number, message: string) {
    const user = await authUser();
    const body = {
        userId: user?.id,
        chatId: chatId,
        content: message,
    };
    const response = await request('POST', '/messages', body);
    return response;
}