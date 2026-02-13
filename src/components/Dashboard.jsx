import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, appointments = [] }) => {
  const navigate = useNavigate();

  // Filter only active (confirmed, not cancelled) appointments
  const activeAppointments = appointments
    .filter(app => app.status === 'Confirmada')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${convertTo24h(a.time)}`);
      const dateB = new Date(`${b.date}T${convertTo24h(b.time)}`);
      return dateA - dateB;
    });

  // Count no-shows
  const noShows = appointments.filter(app => app.status === 'No Asistió');
  const penaltiesCount = noShows.length;
  const penaltiesTotal = penaltiesCount * 3000;

  // Get next upcoming appointment
  const now = new Date();
  const nextAppointment = activeAppointments.find(app => {
    const appDate = new Date(`${app.date}T${convertTo24h(app.time)}`);
    return appDate >= now;
  });

  function convertTo24h(time12) {
    if (!time12) return '00:00';
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return { day: '--', month: '---' };
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return { day, month: months[date.getMonth()] };
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex flex-col font-display antialiased overflow-hidden selection:bg-primary selection:text-white">
      <div className="w-full h-12 bg-background-light dark:bg-background-dark shrink-0"></div>

      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-32 px-5 relative pt-4">
        {/* Brand Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-primary tracking-tighter uppercase">UIS-Salud</h2>
        </div>

        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">Bienvenid@ de nuevo,</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{user?.name || 'Usuario'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <span className="material-icons text-slate-600 dark:text-slate-300">notifications_none</span>
              {activeAppointments.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
              )}
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center bg-primary/20">
                <span className="material-icons text-primary text-xl">person</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-background-light dark:border-background-dark rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Penalties Widget — only show if there are penalties */}
        {penaltiesCount > 0 && (
          <section className="mb-6">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-100 dark:bg-red-800/20 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <span className="material-icons text-xl">gavel</span>
                </div>
                <div>
                  <h3 className="font-bold text-red-900 dark:text-red-100 text-sm uppercase tracking-wide">Multas Pendientes</h3>
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium mt-0.5">Tienes {penaltiesCount} inasistencia{penaltiesCount > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <span className="block text-lg font-bold text-red-900 dark:text-red-100">${penaltiesTotal.toLocaleString()} COP</span>
              </div>
            </div>
          </section>
        )}

        {/* Next Appointment Card */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Próxima Cita</h2>
            {activeAppointments.length > 0 && (
              <button onClick={() => navigate('/my-appointments')} className="text-primary text-sm font-semibold hover:opacity-80 transition-opacity">Ver todas</button>
            )}
          </div>
          
          {nextAppointment ? (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary h-full"></div>
              
              <div className="flex justify-between items-start mb-5 pl-3">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{formatDateDisplay(nextAppointment.date).day}</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{formatDateDisplay(nextAppointment.date).month}</span>
                </div>
                <div className="bg-primary/10 text-primary-dark dark:text-primary px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5">
                  <span className="material-icons text-base">schedule</span>
                  {nextAppointment.time}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-4 ml-3"></div>

              <div className="flex items-start gap-4 pl-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                  <span className="material-icons text-slate-500 text-2xl">person</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{nextAppointment.doctor}</h4>
                  <p className="text-primary font-medium text-sm mb-2">{nextAppointment.specialty}</p>
                  <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <span className="material-icons text-sm mt-0.5">location_on</span>
                    <span className="leading-snug">{nextAppointment.sede}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-slate-400 text-3xl">event_busy</span>
              </div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Sin citas próximas</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Agenda tu primera cita para comenzar.</p>
            </div>
          )}
        </section>

        {/* Quick Action: Schedule New */}
        <section className="mb-8">
          <button 
            onClick={() => navigate('/schedule')}
            className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all duration-200 text-white dark:text-black dark:font-bold rounded-2xl p-4 shadow-lg shadow-primary/30 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 dark:bg-black/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="material-icons text-2xl group-hover:rotate-90 transition-transform">add</span>
              </div>
              <div className="text-left">
                <span className="block font-bold text-lg">Agendar Nueva Cita</span>
                <span className="text-sm text-white/90 dark:text-black/70">Medicina, Odontología, Psicol...</span>
              </div>
            </div>
            <span className="material-icons">chevron_right</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
