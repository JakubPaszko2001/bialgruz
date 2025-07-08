import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Depozytor1') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin-panel');
    } else {
      alert('Nieprawidłowe hasło');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] px-4">
      <div className="bg-[#2c2c2c] text-white p-8 rounded-xl shadow-[0_0_30px_rgba(255,255,0,0.1)] max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Panel administratora</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-yellow-400" htmlFor="password">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-[#111] border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Wpisz hasło"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:brightness-110 transition"
          >
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
