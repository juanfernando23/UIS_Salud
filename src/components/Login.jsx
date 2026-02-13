import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('');
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
        // Pass all user data except password
        const { password: _, ...userData } = existingUser;
        onLogin({ id: userId, ...userData });
        navigate('/dashboard');
      } else {
        setError('Contraseña incorrecta. Intenta de nuevo.');
      }
    } else {
      setPendingCredentials({ id: userId, password });
      // Reset registration fields to ensure a fresh start
      setFullName('');
      setPhone('');
      setBirthDate('');
      setBloodType('');
      setShowRegister(true);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone || !birthDate || !bloodType) {
      setError('Por favor complete todos los campos.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('uis_users') || '{}');
    users[pendingCredentials.id] = {
      name: fullName.trim(),
      password: pendingCredentials.password,
      phone: phone,
      birthDate: birthDate,
      bloodType: bloodType,
      registrationDate: new Date().toISOString()
    };
    localStorage.setItem('uis_users', JSON.stringify(users));

    onLogin({ 
      id: pendingCredentials.id, 
      name: fullName.trim(),
      phone: phone,
      birthDate: birthDate,
      bloodType: bloodType
    });
    navigate('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[100dvh] flex items-center justify-center font-display text-gray-800 dark:text-white transition-colors duration-300 p-2 sm:p-4">
      <div className="w-full max-w-md min-h-[100dvh] sm:min-h-0 sm:h-auto sm:max-h-[95dvh] bg-background-light dark:bg-background-dark sm:bg-surface-light sm:dark:bg-surface-dark relative flex flex-col sm:shadow-soft sm:rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <main className="flex-1 flex flex-col px-5 sm:px-8 pt-8 sm:pt-12 pb-4 sm:pb-8 z-10 overflow-hidden">
          {!showRegister ? (
            <div className="flex-1 flex flex-col justify-center overflow-y-auto">
              <div className="flex flex-col items-center mb-6 sm:mb-10">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white dark:bg-surface-dark rounded-2xl shadow-lg flex items-center justify-center mb-4 sm:mb-6 relative overflow-hidden border border-neutral-light dark:border-primary/20">
                  <span className="material-icons text-4xl sm:text-5xl text-primary drop-shadow-sm">health_and_safety</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-center tracking-tight">UIS-Salud</h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm text-center max-w-[240px]">
                  Reservas de citas médicas para la comunidad universitaria
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5 w-full" autoComplete="off">
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1" htmlFor="institutional-id">
                    Número de Cédula
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">badge</span>
                    </div>
                    <input 
                      className="block w-full pl-10 pr-3 py-3 sm:py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-150 ease-in-out text-sm text-gray-900 dark:text-white shadow-sm" 
                      id="institutional-id" 
                      placeholder="ej. 1005123456" 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                      autoComplete="off"
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
                      className="block w-full pl-10 pr-10 py-3 sm:py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-150 ease-in-out text-sm text-gray-900 dark:text-white shadow-sm" 
                      id="password" 
                      placeholder="••••••••" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
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

                <button className="w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-primary hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] mt-3 sm:mt-4" type="submit">
                  INGRESAR
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-1 space-y-3 sm:space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                  <span className="material-icons text-primary text-lg sm:text-xl mt-0.5">person_add</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Nueva Cuenta</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Registrando cédula: <span className="font-bold text-primary">{pendingCredentials?.id}</span>. Completa tus datos para continuar.
                    </p>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1" htmlFor="full-name">
                    Nombre y Apellidos
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">person</span>
                    </div>
                    <input 
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm text-gray-900 dark:text-white" 
                      id="full-name" 
                      placeholder="ej. María Camila Rodríguez" 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1" htmlFor="phone">
                      Celular
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">smartphone</span>
                      </div>
                      <input 
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm text-gray-900 dark:text-white" 
                        id="phone" 
                        placeholder="310..." 
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1" htmlFor="blood-type">
                      Tipo de Sangre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">bloodtype</span>
                      </div>
                      <select 
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm text-gray-900 dark:text-white appearance-none" 
                        id="blood-type"
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        required
                      >
                        <option value="">Seleccione</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1" htmlFor="birth-date">
                    Fecha de Nacimiento
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">calendar_today</span>
                    </div>
                    <input 
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm text-gray-900 dark:text-white" 
                      id="birth-date" 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      autoComplete="off"
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
              </div>

              <div className="pt-4 sm:pt-6 space-y-2 sm:space-y-3 shrink-0">
                <button 
                  onClick={handleRegister}
                  className="w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-primary hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98]" 
                  type="submit"
                >
                  CREAR CUENTA E INGRESAR
                </button>

                <button
                  type="button"
                  onClick={() => { setShowRegister(false); setPendingCredentials(null); setFullName(''); setPhone(''); setBirthDate(''); setBloodType(''); setError(''); }}
                  className="w-full text-center text-sm text-gray-500 hover:text-primary font-medium transition-colors py-2"
                >
                  ← Volver al inicio de sesión
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-light dark:bg-background-dark sm:bg-white sm:dark:bg-surface-dark text-gray-400">&nbsp;</span>
            </div>
          </div>
        </main>

        <div className="h-2 w-full bg-gradient-to-r from-primary via-green-400 to-primary"></div>
      </div>
    </div>
  );
};

export default Login;
