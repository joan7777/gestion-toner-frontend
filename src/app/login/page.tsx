// pages/login.tsx
'use client';

import { useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    console.log("Tentative de connexion...");
    e.preventDefault();
    
    try {
      const res = await api.post('auth/login', { mail: mail, password });
      localStorage.setItem('token', res.data.access_token);
      router.push('/profil');
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={mail} onChange={e => setMail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
    </form>
  );
}
