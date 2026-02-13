import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ScheduleAppointment = ({ onAdd, onUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingApp = location.state?.appointment;

  const [step, setStep] = useState(editingApp ? 1 : 1);
  const [selection, setSelection] = useState({
    sede: editingApp?.sede || '',
    specialty: editingApp?.specialty || '',
    doctor: editingApp?.doctor || '',
    date: editingApp?.date || '',
    time: editingApp?.time || ''
  });

  // System data: sedes, specialties, doctors, times
  const sedes = ['Sede Campus', 'Sede Salud', 'Sede Guatiguará'];

  const specialties = ['Medicina General', 'Odontología', 'Psicología', 'Fisioterapia'];

  const doctors = {
    'Medicina General': [
      { name: 'Dr. Juan Pérez', consultorio: 'Consultorio 204' },
      { name: 'Dra. Ana Gómez', consultorio: 'Consultorio 301' }
    ],
    'Odontología': [
      { name: 'Dr. Roberto Silva', consultorio: 'Consultorio 102' },
      { name: 'Dra. Elena Roos', consultorio: 'Consultorio 105' }
    ],
    'Psicología': [
      { name: 'Dr. Carlos Ruiz', consultorio: 'Consultorio 401' }
    ],
    'Fisioterapia': [
      { name: 'Dra. Marta Luna', consultorio: 'Consultorio 210' }
    ]
  };

  const times = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : navigate(-1);

  const handleConfirm = () => {
    const doctorInfo = doctors[selection.specialty]?.find(d => d.name === selection.doctor);
    const appDetails = {
      sede: selection.sede,
      specialty: selection.specialty,
      doctor: selection.doctor,
      consultorio: doctorInfo?.consultorio || '',
      date: selection.date,
      time: selection.time
    };

    if (editingApp) {
      onUpdate(editingApp.id, appDetails);
    } else {
      onAdd(appDetails);
    }
    setStep(4);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Selecciona una Sede</h2>
            {sedes.map(s => (
              <button 
                key={s}
                onClick={() => { setSelection({...selection, sede: s}); handleNext(); }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selection.sede === s ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{s}</span>
                  <span className="material-icons text-primary">location_on</span>
                </div>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Especialidad</h2>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map(spec => (
                  <button 
                    key={spec}
                    onClick={() => setSelection({...selection, specialty: spec, doctor: ''})}
                    className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${selection.specialty === spec ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
            {selection.specialty && (
              <div>
                <h2 className="text-xl font-bold mb-4">Médico Disponible</h2>
                <div className="space-y-3">
                  {doctors[selection.specialty].map(doc => (
                    <button 
                      key={doc.name}
                      onClick={() => { setSelection({...selection, doctor: doc.name}); handleNext(); }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selection.doctor === doc.name ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="material-icons text-primary">person</span>
                        </div>
                        <div>
                          <span className="font-bold block">{doc.name}</span>
                          <span className="text-xs text-slate-500">{doc.consultorio}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">{editingApp ? 'Nueva Fecha y Horario' : 'Fecha y Horario'}</h2>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fecha</label>
              <input 
                type="date"
                min={today}
                value={selection.date}
                className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 mb-6"
                onChange={(e) => setSelection({...selection, date: e.target.value})}
              />
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Horario disponible</label>
              <div className="grid grid-cols-3 gap-2">
                {times.map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelection({...selection, time: t})}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${selection.time === t ? 'bg-primary text-white border-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-6">
              <button 
                disabled={!selection.date || !selection.time}
                onClick={handleConfirm}
                className="w-full bg-primary py-4 rounded-xl font-bold text-black shadow-lg shadow-primary/30 disabled:opacity-50 hover:bg-primary-dark hover:text-white transition-all"
              >
                {editingApp ? 'ACTUALIZAR CITA' : 'CONFIRMAR CITA'}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons text-primary text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-bold">{editingApp ? '¡Cita Reagendada!' : '¡Cita Agendada!'}</h2>
            <p className="text-slate-500">{editingApp ? 'Tu cita ha sido actualizada exitosamente.' : 'Tu cita ha sido registrada exitosamente.'}</p>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-left space-y-3">
              <p className="text-sm border-b pb-2"><span className="text-slate-500">Sede:</span> <span className="font-bold float-right">{selection.sede}</span></p>
              <p className="text-sm border-b pb-2"><span className="text-slate-500">Especialidad:</span> <span className="font-bold float-right">{selection.specialty}</span></p>
              <p className="text-sm border-b pb-2"><span className="text-slate-500">Médico:</span> <span className="font-bold float-right">{selection.doctor}</span></p>
              <p className="text-sm border-b pb-2"><span className="text-slate-500">Fecha:</span> <span className="font-bold float-right">{selection.date}</span></p>
              <p className="text-sm"><span className="text-slate-500">Hora:</span> <span className="font-bold float-right">{selection.time}</span></p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/my-appointments')}
                className="w-full bg-primary py-4 rounded-xl font-bold text-black shadow-lg shadow-primary/30 hover:bg-primary-dark hover:text-white transition-all"
              >
                VER MIS CITAS
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-slate-100 dark:bg-slate-800 py-4 rounded-xl font-bold"
              >
                VOLVER AL INICIO
              </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-100 font-display">
      <header className="px-5 pt-12 pb-6">
        <button onClick={handleBack} className="mb-4 flex items-center text-slate-500">
          <span className="material-icons">arrow_back</span>
          <span className="ml-2 font-medium">Volver</span>
        </button>
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-bold">Agendar Cita</h1>
          {step < 4 && <span className="text-primary font-bold text-sm">Paso {step} de 3</span>}
        </div>
        {step < 4 && (
          <div className="flex gap-2 mt-4">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            ))}
          </div>
        )}
      </header>
      <main className="px-5 pb-24">
        {renderStep()}
      </main>
    </div>
  );
};

export default ScheduleAppointment;
