'use client'

import { useState } from "react";
import Link from 'next/link';
import { setAuthToken } from '../actions/auth';
import { redirect } from "next/navigation";


export default function loginPage() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.message ?? 'Something went wrong');
            return;
        }

        const data = await response.json();
        console.log(data);
        if (data.access_token) {
            await setAuthToken(data.access_token);
            redirect('/');
        }
    };

    const handleContainerClick = () => {
        handleSubmit(new Event('submit') as unknown as React.FormEvent);
    };

    return (
        <main>
            <h1>Авторизация</h1>
            <form className='flex flex-col w-fit color bg-blue-200 p-4 rounded-xl gap-2 items-center' onSubmit={handleSubmit}>
                <input className='bg-white rounded-md px-3 py-0.5' name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input className='bg-white rounded-md px-3 py-0.5' name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                {error && <p>{error}</p>}
                <div id="container">
                    <div onClick={handleContainerClick} className='button-inner-text'>Войти</div>
                    <div id="trailing-circle"></div>
                </div>
                <Link href="/registration">Зарегистрироваться</Link>
            </form>
        </main>
    );
}