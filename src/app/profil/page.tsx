// pages/profile.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        //router.push('/login');
        return;
      }

      try {
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        //router.push('/login');
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Bienvenue {profile.mail}</h1>
      <button onClick={() => {
        localStorage.removeItem('token');
        router.push('/login');
      }}>Déconnexion</button>
    </div>
  );
}
