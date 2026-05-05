import { useState } from 'react';
import api, { usersApi } from '../services/api';
import type { Page } from '../App';

export default function ForgotPassword({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword.trim()) return;
    try {
      await usersApi.updatePassword(userId, newPassword);
      setNewPassword('');
      alert('Senha atualizada!');
      setPage('login');
    } catch {
      setError('Erro ao atualizar senha.');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24 }}>
      <h1>Mudar de senha</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Senha" type="password" value={form.password} onChange={handleChange} required />
        <button type="submit">Alterar</button>
      </form>
    </div>
  );
}
