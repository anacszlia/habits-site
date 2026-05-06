import { useState } from 'react';
import { usersApi, getUserIdFromToken } from '../services/api';
import type { Page } from '../App';

export default function Dashboard({ setPage }: { setPage: (p: Page) => void }) {

  const userId = getUserIdFromToken();
  const [error, setError] = useState('');

  async function handleUpdateName() {
    const name = prompt('Novo nome:');
    if (!name) return;
    try {
      await usersApi.updateName(userId, name);
      alert('Nome atualizado com sucesso!');
    } catch {
      setError('Erro ao atualizar nome.');
    }
  }

  async function handleUpdateEmail() {
    const email = prompt('Novo email:');
    if (!email) return;
    try {
      await usersApi.updateEmail(userId, email);
      alert('Email atualizado com sucesso!');
    } catch {
      setError('Erro ao atualizar email.');
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Tem certeza que deseja deletar sua conta?')) return;
    try {
      await usersApi.delete(userId);
      localStorage.clear();
      setPage('login');
    } catch {
      setError('Erro ao deletar conta.');
    }
  }
   async function handleUpdatePassword(e: React.FormEvent) {
    const password = prompt('Nova senha:');
    if (!password) return;
    try {
      await usersApi.updatePassword(userId, password);
      alert('Senha atualizada com sucesso!');
      setPage('login');
    } catch {
      setError('Erro ao atualizar senha.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setPage('login');
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: 32 }}>
        <button onClick={handleUpdateName}>Alterar nome</button>
      </div>
      <div style={{ marginTop: 32 }}>
        <button onClick={handleUpdateEmail}>Alterar email</button>
      </div>
      <div style={{ marginTop: 32 }}>
        <button onClick={handleUpdatePassword}>Alterar senha</button>
      </div>
      <div style={{ marginTop: 32 }}>
        <button onClick={handleDeleteAccount} style={{ color: 'red' }}>Deletar conta</button>
      </div>
      <div style={{ marginTop: 32 }}>
        <button onClick={handleLogout} style={{ color: 'red' }}>Sair</button>
      </div>
    </div>
  );
}