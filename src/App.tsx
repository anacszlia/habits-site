import { useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import ChangePerfil from './pages/alterarPerfil';

export type Page = 'login' | 'register' | 'dashboard' |'changePerfil';

function App() {
  const [page, setPage] = useState<Page>('login');

  if (page === 'register') return <Register setPage={setPage} />;
  if (page === 'dashboard') return <Dashboard setPage={setPage} />;
  if (page === 'changePerfil') return <ChangePerfil setPage={setPage} />;
  return <Login setPage={setPage} />;
}

export default App;
