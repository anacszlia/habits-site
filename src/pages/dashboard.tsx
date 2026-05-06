import { useEffect, useState } from 'react';
import { habitsApi, streakApi, getUserIdFromToken } from '../services/api';
import type { Page } from '../App';

type Habit = { id: number; title: string; description?: string; active: boolean };
type EditState = { id: number; title: string; description: string } | null;

export default function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState(0);
  const [newHabit, setNewHabit] = useState({ title: '', description: '' });
  const [edit, setEdit] = useState<EditState>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { setPage('login'); return; }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const userId = getUserIdFromToken();
      const [habitsRes, streakRes] = await Promise.all([habitsApi.getAll(), streakApi.get()]);
      setHabits(habitsRes.data);
      const userStreak = streakRes.data.find((s: { userId: number; currentStreak: number }) => s.userId === userId);
      setStreak(userStreak?.currentStreak ?? 0);
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

  async function handleDelete(id: number) {
    if (!confirm('Deletar este hábito?')) return;
    try {
      await habitsApi.delete(id);
      fetchData();
    } catch {
      setError('Erro ao deletar hábito.');
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

  function handleLogout() {
    localStorage.removeItem('token');
    setPage('login');
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPage('changePerfil')} style={{ color: 'green' }}>Alterar Perfil</button>
          <button onClick={handleLogout} style={{ color: 'red' }}>Sair</button>
        </div>
      </div>

      <p>🔥 Streak atual: <strong>{streak} dias</strong></p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
        <input
          placeholder="Título do hábito"
          value={newHabit.title}
          onChange={e => setNewHabit({ ...newHabit, title: e.target.value })}
          required
        />
        <input
          placeholder="Descrição (opcional)"
          value={newHabit.description}
          onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
        />
        <button type="submit">Adicionar hábito</button>
      </form>

      {edit && (
        <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, padding: 12, border: '1px solid #ccc' }}>
          <strong>Editando hábito</strong>
          <input
            value={edit.title}
            onChange={e => setEdit({ ...edit, title: e.target.value })}
            required
          />
          <input
            value={edit.description}
            onChange={e => setEdit({ ...edit, description: e.target.value })}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
        {habits.map(habit => (
          <li key={habit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ textDecoration: habit.active ? 'none' : 'line-through', color: habit.active ? 'inherit' : '#aaa' }}>
              <strong>{habit.title}</strong>
              {habit.description && <span> — {habit.description}</span>}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => handleComplete(habit.id)}>✅</button>
              <button onClick={() => setEdit({ id: habit.id, title: habit.title, description: habit.description ?? '' })}>✏️</button>
              <button onClick={() => handleToggleActive(habit)}>{habit.active ? '⏸️' : '▶️'}</button>
              <button onClick={() => handleDelete(habit.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
