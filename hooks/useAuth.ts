import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  skill_level: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        skill_level: 'Intermediate',
        avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      });
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate sign in
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email,
        skill_level: 'Intermediate',
      });
      setLoading(false);
    }, 1500);
  };

  const signOut = async () => {
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}