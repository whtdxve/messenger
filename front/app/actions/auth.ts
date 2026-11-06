'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function setAuthToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true, // Куки недоступны из JavaScript
        secure: process.env.NODE_ENV === 'production', // Только по HTTPS в проде
        sameSite: 'strict', // Защита от CSRF
        maxAge: 60 * 60 * 24, // 1 день
        path: '/', // Доступно на всём сайте
    });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
        return null;
    }

    try {
        const verified = await jwtVerify(token, SECRET_KEY);
        return verified.payload;
    } catch (error) {
        return null;
    }
}