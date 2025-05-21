// pages/register.tsx
import { useState } from 'react';
import api from '../app/lib/api';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { mmail: mail, password });
      router.push('/login');
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" placeholder="Email" value={mail} onChange={e => setMail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
