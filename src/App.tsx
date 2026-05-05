import { useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

export type Page = 'login' | 'register' | 'dashboard';

function App() {
  const [page, setPage] = useState<Page>('login');

  if (page === 'register') return <Register setPage={setPage} />;
  if (page === 'dashboard') return <Dashboard setPage={setPage} />;
  return <Login setPage={setPage} />;
}

export default App;
