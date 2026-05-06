import { useState } from 'react';
import api from '../services/api';
import type { Page } from '../App';

export default function Login({ setPage }: { setPage: (p: Page) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setPage('dashboard');
    } catch {
      setError('Email ou senha inválidos.');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24 }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <p style={{ marginTop: 12, textAlign: 'center' }}>
        Não tem conta?{' '}
        <button onClick={() => setPage('register')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
          Registrar
        </button>
      </p>
      <p style={{ marginTop: 8, textAlign: 'center' }}>
        Esqueceu sua senha?{' '}
        <button onClick={() => setPage('forgotPassword')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
          Recuperar senha
        </button>
      </p>
    </div>
  );
}
