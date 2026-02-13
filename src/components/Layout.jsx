import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavPaths = ['/', '/login'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  if (shouldHideNav) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {children}
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pt-3 pb-8 px-6 z-50">
        <ul className="flex justify-between items-center">
          <li className="flex-1">
            <NavLink to="/dashboard" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
              <span className="material-icons text-2xl">dashboard</span>
              <span className="text-[10px] font-bold">Inicio</span>
            </NavLink>
          </li>
          <li className="flex-1">
            <NavLink to="/my-appointments" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
              <span className="material-icons text-2xl">calendar_today</span>
              <span className="text-[10px] font-bold">Citas</span>
            </NavLink>
          </li>
          <li className="flex-1">
            <button 
              onClick={() => { onLogout(); navigate('/login'); }}
              className="flex flex-col items-center gap-1 transition-colors text-slate-400 hover:text-red-500 w-full"
            >
              <span className="material-icons text-2xl">logout</span>
              <span className="text-[10px] font-bold">Salir</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Layout;
