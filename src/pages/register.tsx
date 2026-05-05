import { useState } from 'react';
import api from '../services/api';
import type { Page } from '../App';

export default function Register({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setPage('login');
    } catch {
      setError('Erro ao registrar. Verifique os dados.');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24 }}>
      <h1>Criar conta</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Senha" type="password" value={form.password} onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Já tem conta?{' '}
        <button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
          Login
        </button>
      </p>
    </div>
  );
}
