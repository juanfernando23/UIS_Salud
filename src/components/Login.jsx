import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [pendingCredentials, setPendingCredentials] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!userId || !password) return;

    const users = JSON.parse(localStorage.getItem('uis_users') || '{}');
    const existingUser = users[userId];

    if (existingUser) {
      if (existingUser.password === password) {
        onLogin({ id: userId, name: existingUser.name });
        navigate('/dashboard');
      } else {
        setError('Contraseña incorrecta. Intenta de nuevo.');
      }
    } else {
      setPendingCredentials({ id: userId, password });
      setShowRegister(true);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const users = JSON.parse(localStorage.getItem('uis_users') || '{}');
    users[pendingCredentials.id] = {
      name: fullName.trim(),
      password: pendingCredentials.password
    };
    localStorage.setItem('uis_users', JSON.stringify(users));

    onLogin({ id: pendingCredentials.id, name: fullName.trim() });
    navigate('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center font-display text-gray-800 dark:text-white transition-colors duration-300 p-4">
      <div className="w-full max-w-md h-[90vh] md:h-auto md:min-h-[600px] bg-background-light dark:bg-background-dark md:bg-surface-light md:dark:bg-surface-dark relative flex flex-col md:shadow-soft md:rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <main className="flex-1 flex flex-col px-8 pt-12 pb-8 z-10 justify-center">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-white dark:bg-surface-dark rounded-2xl shadow-lg flex items-center justify-center mb-6 relative overflow-hidden border border-neutral-light dark:border-primary/20">
              <span className="material-icons text-5xl text-primary drop-shadow-sm">health_and_safety</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center tracking-tight">UIS-Salud</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-[240px]">
              Reservas de citas médicas para la comunidad universitaria
            </p>
          </div>

          {!showRegister ? (
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1" htmlFor="institutional-id">
                  Usuario Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">badge</span>
                  </div>
                  <input 
                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-150 ease-in-out sm:text-sm text-gray-900 dark:text-white shadow-sm" 
                    id="institutional-id" 
                    placeholder="ej. 2180500" 
                    type="text" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">lock_outline</span>
                  </div>
                  <input 
                    className="block w-full pl-10 pr-10 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-150 ease-in-out sm:text-sm text-gray-900 dark:text-white shadow-sm" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-2">
                  <span className="material-icons text-red-500 text-lg">error</span>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              )}

              <button className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-primary hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] mt-4" type="submit">
                INGRESAR
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5 w-full">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <span className="material-icons text-blue-500 text-xl mt-0.5">person_add</span>
                <div>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Primera vez ingresando</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Ingresa tu nombre completo para crear tu cuenta.</p>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1" htmlFor="full-name">
                  Nombre y Apellidos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">person</span>
                  </div>
                  <input 
                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-150 ease-in-out sm:text-sm text-gray-900 dark:text-white shadow-sm" 
                    id="full-name" 
                    placeholder="ej. María Camila Rodríguez" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-primary hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] mt-4" type="submit">
                CREAR CUENTA E INGRESAR
              </button>

              <button
                type="button"
                onClick={() => { setShowRegister(false); setPendingCredentials(null); setFullName(''); }}
                className="w-full text-center text-sm text-gray-500 hover:text-primary font-medium transition-colors"
              >
                ← Volver al inicio de sesión
              </button>
            </form>
          )}

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-light dark:bg-background-dark md:bg-white md:dark:bg-surface-dark text-gray-400">&nbsp;</span>
            </div>
          </div>
        </main>

        <div className="h-2 w-full bg-gradient-to-r from-primary via-green-400 to-primary"></div>
      </div>
    </div>
  );
};

export default Login;
