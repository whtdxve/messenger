'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function RegistrationPage() {
    useEffect(() => {
        const container = document.getElementById('container');
        const circle = document.getElementById('trailing-circle');
        let mouseX = 0;
        let mouseY = 0;
        let circleX = 0;
        let circleY = 0;
        const speed = 0.09;

        // container.addEventListener('mouseenter', () => {
        //     const rect = container.getBoundingClientRect();
        //     circleX = mouseX - rect.left;
        //     circleY = mouseY - rect.top;
        //     circle.style.display = 'block';
        // });

        // container.addEventListener('mouseleave', () => {
        //     circle.style.display = 'none';
        // });

        // container.addEventListener('mousemove', (e) => {
        //     mouseX = e.clientX;
        //     mouseY = e.clientY;
        // });

        // function animateCircle() {
        //     const rect = container.getBoundingClientRect();
        //     // circleX = mouseX - rect.left;
        //     // circleY = mouseY - rect.top;
        //     circleX += (mouseX - circleX - rect.left) * speed;
        //     circleY += (mouseY - circleY - rect.top) * speed;
        //     circle.style.left = `${circleX}px`;
        //     circle.style.top = `${circleY}px`;

        //     requestAnimationFrame(animateCircle);
        // }



        container.addEventListener('mouseenter', () => {
            const rect = container.getBoundingClientRect();
            circleX = mouseX - rect.left;
            circleY = mouseY - rect.top;
            circle.style.opacity = 1;
        });

        container.addEventListener('mouseleave', () => {
            circle.style.opacity = 0;
        });

        document.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX;
            mouseY = e.clientY;
            circleX += (mouseX - circleX - rect.left) * speed;
            circleY += (mouseY - circleY - rect.top) * speed;
            circle.style.left = `${circleX}px`;
            circle.style.top = `${circleY}px`;
        });

        // function animateCircle() {
        //     const rect = container.getBoundingClientRect();
        //     // circleX = mouseX - rect.left;
        //     // circleY = mouseY - rect.top;
        //     circleX += (mouseX - circleX - rect.left) * speed;
        //     circleY += (mouseY - circleY - rect.top) * speed;
        //     circle.style.left = `${circleX}px`;
        //     circle.style.top = `${circleY}px`;

        //     requestAnimationFrame(animateCircle);
        // }

        // animateCircle();
    }, []);

    const [form, setForm] = useState({
        email: '',
        password: '',
        tag: '',
        name: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.message ?? 'Something went wrong');
            return;
        }
    };

    const handleContainerClick = () => {
        handleSubmit(new Event('submit') as unknown as React.FormEvent);
    };
    
    return (
        <main>
            <h1>Registration</h1>
            <form className='flex flex-col w-fit bg-blue-200 p-4 rounded-xl gap-2 items-center' onSubmit={handleSubmit}>
                <input className='bg-white rounded-md px-3 py-0.5' name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input className='bg-white rounded-md px-3 py-0.5' name="tag" placeholder="Tag" value={form.tag} onChange={handleChange} required />
                <input className='bg-white rounded-md px-3 py-0.5' name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input className='bg-white rounded-md px-3 py-0.5' name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                {error && <p>{error}</p>}
                <div onClick={handleContainerClick} id="container">
                    <div className='button-inner-text'>Зарегистрироваться</div>
                    <div id="trailing-circle"></div>
                </div>
                <Link href="/login">Войти</Link>
            </form>
        </main>
    );
}
