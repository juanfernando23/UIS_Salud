import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyAppointments = ({ appointments = [], onCancel }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activas');

  function convertTo24h(time12) {
    if (!time12) return '00:00';
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  const now = new Date();

  // Active = Confirmada and date/time hasn't passed yet
  const activeAppointments = appointments
    .filter(app => {
      if (app.status !== 'Confirmada') return false;
      const appDate = new Date(`${app.date}T${convertTo24h(app.time)}`);
      return appDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${convertTo24h(a.time)}`);
      const dateB = new Date(`${b.date}T${convertTo24h(b.time)}`);
      return dateA - dateB;
    });

  // History = Cancelled, No Asistió, or past confirmed appointments
  const historyAppointments = appointments
    .filter(app => {
      if (app.status === 'Cancelada' || app.status === 'No Asistió' || app.status === 'Asistió') return true;
      if (app.status === 'Confirmada') {
        const appDate = new Date(`${app.date}T${convertTo24h(app.time)}`);
        return appDate < now;
      }
      return false;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${convertTo24h(a.time)}`);
      const dateB = new Date(`${b.date}T${convertTo24h(b.time)}`);
      return dateB - dateA;
    });

  function canEditAppointment(app) {
    const appDate = new Date(`${app.date}T${convertTo24h(app.time)}`);
    const diffMs = appDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours >= 2;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 antialiased min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-primary/10 pt-14 pb-2 px-4 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">UIS-Salud</h2>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">Mis Citas</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <span className="material-icons text-slate-600 dark:text-slate-300">notifications_none</span>
              {activeAppointments.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
              )}
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center bg-primary/20">
                <span className="material-icons text-primary text-xl">person</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-background-light dark:border-background-dark rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('activas')}
            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'activas' ? 'text-primary' : 'text-slate-400'}`}
          >
            Activas ({activeAppointments.length})
            {activeTab === 'activas' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'historial' ? 'text-primary' : 'text-slate-400'}`}
          >
            Historial ({historyAppointments.length})
            {activeTab === 'historial' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-5 pb-32">
        {activeTab === 'activas' ? (
          <>
            {activeAppointments.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm flex items-start gap-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 text-xl mt-0.5">info</span>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-snug">
                  <strong>Política de Cambios:</strong> Solo se permite cancelar citas con un mínimo de <span className="font-bold underline decoration-primary decoration-2">2 horas de antelación</span>.
                </p>
              </div>
            )}

            {activeAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-slate-400 text-4xl">event_available</span>
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-2">No tienes citas activas</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Agenda una nueva cita para comenzar.</p>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="bg-primary text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark hover:text-white transition-all"
                >
                  Agendar Cita
                </button>
              </div>
            ) : (
              activeAppointments.map(app => {
                const editable = canEditAppointment(app);
                return (
                  <article key={app.id} className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative ${!editable ? 'opacity-90' : ''}`}>
                    {!editable && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 flex items-center gap-2 border-b border-amber-100 dark:border-amber-800/30">
                        <span className="material-icons text-amber-500 text-sm">warning</span>
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Menos de 2h - Cambios restringidos</p>
                      </div>
                    )}
                    <div className={`absolute top-0 left-0 w-1 h-full ${editable ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{formatDate(app.date)}</span>
                          <span className="text-2xl font-bold text-slate-800 dark:text-white">{app.time}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${editable ? 'bg-primary/20 text-green-800 dark:text-green-200 border border-primary/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {editable ? 'Confirmada' : 'En breve'}
                        </span>
                      </div>

                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <span className="material-icons text-slate-500 text-2xl">person</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{app.doctor}</h3>
                          <p className={`${editable ? 'text-primary' : 'text-slate-500'} font-medium text-sm mb-1`}>{app.specialty}</p>
                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                            <span className="material-icons text-[14px] mr-1">location_on</span>
                            {app.sede}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          disabled={!editable}
                          onClick={() => editable && onCancel(app.id)}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${editable ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                        >
                          <span className="material-icons text-sm">cancel</span>
                          Cancelar Cita
                        </button>
                      </div>
                      {!editable && (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-medium mt-3">
                          <span className="material-icons text-[14px]">payments</span>
                          Inasistencia generará multa de $3.000
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </>
        ) : (
          <div className="space-y-4">
            {historyAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-slate-400 text-4xl">history</span>
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-2">Sin historial aún</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tu historial de citas aparecerá aquí.</p>
              </div>
            ) : (
              historyAppointments.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.doctor}</h4>
                    <p className="text-xs text-slate-500">{item.specialty} • {formatDate(item.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.status === 'Asistió' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Cancelada' ? 'bg-slate-100 text-slate-600' : 
                      item.status === 'No Asistió' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'Confirmada' ? 'Pasada' : item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
