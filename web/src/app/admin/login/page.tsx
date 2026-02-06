'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'auraadmin') {
            // In a real app, set a cookie or session here
            document.cookie = "aura_admin_session=true; path=/";
            router.push('/admin/dashboard');
        } else {
            alert('Password Incorrect');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">管理者ログイン</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">パスワード</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2 border"
                            placeholder="パスワードを入力"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded hover:bg-rose-600 transition"
                    >
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
}
