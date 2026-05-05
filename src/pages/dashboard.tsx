import { useEffect, useState } from 'react';
import { habitsApi, streakApi, usersApi } from '../services/api';
import type { Page } from '../App';

type Habit = { id: number; title: string; description?: string; active: boolean };
type EditState = { id: number; title: string; description: string } | null;

export default function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState(0);
  const [newHabit, setNewHabit] = useState({ title: '', description: '' });
  const [edit, setEdit] = useState<EditState>(null);
  const [error, setError] = useState('');
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    if (!localStorage.getItem('token')) { setPage('login'); return; }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [habitsRes, streakRes] = await Promise.all([habitsApi.getAll(), streakApi.get()]);
      setHabits(habitsRes.data);
      setStreak(streakRes.data.currentStreak ?? 0);
    } catch {
      setError('Erro ao carregar dados.');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newHabit.title.trim()) return;
    try {
      await habitsApi.create(newHabit);
      setNewHabit({ title: '', description: '' });
      fetchData();
    } catch {
      setError('Erro ao criar hábito.');
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    try {
      await habitsApi.update(edit.id, { title: edit.title, description: edit.description });
      setEdit(null);
      fetchData();
    } catch {
      setError('Erro ao editar hábito.');
    }
  }

  async function handleComplete(id: number) {
    try {
      await habitsApi.complete(id);
      fetchData();
    } catch {
      setError('Erro ao marcar hábito.');
    }
  }

  async function handleToggleActive(habit: Habit) {
    try {
      await habitsApi.update(habit.id, { active: !habit.active });
      fetchData();
    } catch {
      setError('Erro ao atualizar hábito.');
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

  function handleLogout() {
    localStorage.removeItem('token');
    setPage('login');
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <p>🔥 Streak atual: <strong>{streak} dias</strong></p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Novo Hábito</h2>
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input placeholder="Título" value={newHabit.title} onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })} required />
        <input placeholder="Descrição (opcional)" value={newHabit.description} onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} />
        <button type="submit">Criar</button>
      </form>

      <h2>Meus Hábitos</h2>
      {habits.length === 0 && <p>Nenhum hábito cadastrado.</p>}
      {habits.map((habit) => (
        <div key={habit.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
          {edit?.id === habit.id ? (
            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required />
              <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setEdit(null)}>Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <strong>{habit.title}</strong>
              {habit.description && <p style={{ margin: '4px 0' }}>{habit.description}</p>}
              <p style={{ margin: '4px 0', fontSize: 12, color: habit.active ? 'green' : 'gray' }}>
                {habit.active ? 'Ativo' : 'Inativo'}
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button onClick={() => handleComplete(habit.id)} disabled={!habit.active}>✅ Feito</button>
                <button onClick={() => setEdit({ id: habit.id, title: habit.title, description: habit.description ?? '' })}>✏️ Editar</button>
                <button onClick={() => handleToggleActive(habit)}>{habit.active ? 'Desativar' : 'Ativar'}</button>
              </div>
            </>
          )}
        </div>
      ))}

      <h2>Alterar Senha</h2>
      <form onSubmit={handleForgotPassword} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Salvar</button>
      </form>

      <div style={{ marginTop: 32 }}>
        <button onClick={handleDeleteAccount} style={{ color: 'red' }}>Deletar conta</button>
      </div>
    </div>
  );
}
