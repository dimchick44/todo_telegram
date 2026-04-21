"use client";


import {useEffect, useState} from "react";



type Task = {
    id: number;
    title: string;
    time: string;
    done: boolean;
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [userId, setUserId] = useState<string>("demo");

    // загрузка задач
    async function loadTasks() {
        const res = await fetch("/api/test");
        const data = await res.json();
        setTasks(data);
    }

    useEffect(() => {
        async function init() {
            const WebApp = (await import("@twa-dev/sdk")).default;

            WebApp.ready();
            WebApp.expand();

            const initData = WebApp.initData;

            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData }),
            });

            const data = await res.json();

            if (data.ok) {
                setUserId(data.userId.toString());
            }
        }

        init();
    }, []);
        

    // добавление задачи
    async function addTask() {
        if (!title || !time) return;

        await fetch("/api/test", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title,
                time,
                userId,
            })
        });

        setTitle("");
        setTime("");
        loadTasks();
    }

    return (
        <div style={{maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif"}}>
            <h1>📋 Telegram Task Planner</h1>

            {/* форма */}
            <div style={{display: "flex", gap: 8, marginBottom: 20}}>
                <input
                    placeholder="Задача"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Время"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <button onClick={addTask}>Добавить</button>
            </div>

            {/* список */}
            <ul style={{padding: 0}}>
                {tasks.map((t) => (
                    <li
                        key={t.id}
                        style={{
                            listStyle: "none",
                            padding: 10,
                            marginBottom: 8,
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            background: t.done ? "#e6ffe6" : "#fff",
                        }}
                    >
                        <strong>{t.title}</strong> — {t.time}
                    </li>
                ))}
            </ul>
        </div>
    );
}