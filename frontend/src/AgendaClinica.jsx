import { useState, useEffect } from 'react';
import PatientModal from './components/PatientModal';

export default function AgendaClinica() {
  const [citas] = useState([
    {
      summary: 'Dra. Edianny - Implantología (Juan Pérez)',
      descripcion: 'Control de implante pieza 36 y revisión general de encías.',
      start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    },
    {
      summary: 'Dra. Edianny - Endodoncia (María Gómez)',
      descripcion: 'Dolor agudo en pieza 16. Diagnóstico y apertura.',
      start: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
    },
    {
      summary: 'Dra. Edianny - Limpieza y Blanqueamiento (Carlos Ruiz)',
      descripcion: 'Limpieza ultrasónica semestral y presupuesto de blanqueamiento.',
      start: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    }
  ]);
  const [error] = useState(null);
  const [estadoSillon, setEstadoSillon] = useState('libre'); // 'libre', 'ocupado', 'esterilizando'
  const [pacienteActual, setPacienteActual] = useState({
    summary: 'Dra. Edianny - Implantología (Juan Pérez)',
    descripcion: 'Control de implante pieza 36 y revisión general de encías.',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
  });
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    // Espacio reservado para sincronizar con el backend de Flask en el futuro
  }, []);

  return (
    <div className="min-h-screen bg-[#141010] text-[#EBCAC5] font-sans p-6 md:p-10 selection:bg-[#EBCAC5] selection:text-[#513028]">
      
      {/* Cabecera del Sábado */}
      <header className="max-w-7xl mx-auto mb-8 bg-[#1E1513] border border-[#513028]/60 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#EBCAC5] animate-pulse"></span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#FDFBFB] tracking-tight">
              Gabinete Principal <span className="text-[#EBCAC5] font-normal">| Agenda de Sábado</span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#EBCAC5]/70 mt-1">
            Dra. Edianny Salazar • Jornada Intensiva de Sábado
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#2C1B17] border border-[#513028] text-xs font-semibold text-[#EBCAC5] flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${estadoSillon === 'ocupado' ? 'bg-red-400 animate-ping' : estadoSillon === 'esterilizando' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            Sillón: <span className="uppercase tracking-wider">{estadoSillon}</span>
          </div>
          <a
            href="http://localhost:5000/auth/login"
            className="text-xs bg-[#513028] hover:bg-[#3D231E] text-[#FDFBFB] font-medium px-4 py-2.5 rounded-xl shadow-md border border-[#EBCAC5]/30 transition-all"
          >
            Sincronizar Google
          </a>
        </div>
      </header>

      {/* Grid Principal: Sillón en Vivo + Lista de Sábado */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Panel de Control del Sillón Actual (Columna Principal Izquierda) */}
        <section className="lg:col-span-1 bg-[#1E1513] rounded-2xl shadow-xl border border-[#513028]/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-[#513028]/40 pb-4">
              <h2 className="text-base font-bold text-[#FDFBFB]">Control de Sillón</h2>
              <span className="text-xs bg-[#513028] text-[#EBCAC5] px-2.5 py-1 rounded-lg border border-[#EBCAC5]/20 font-mono">
                Sábado VIVO
              </span>
            </div>

            {pacienteActual ? (
              <div className="space-y-4">
                <div 
                  onClick={() => setSelectedPatient({ name: pacienteActual.summary, phone: '600000000', dni: '12345678X' })}
                  className="p-4 rounded-xl bg-[#141010] border border-[#513028] cursor-pointer hover:border-[#EBCAC5] transition-all group"
                >
                  <span className="text-[10px] uppercase font-bold text-[#EBCAC5]/60 tracking-wider block mb-1">Paciente en Curso (Haz clic para ver ficha)</span>
                  <h3 className="text-lg font-bold text-[#FDFBFB] group-hover:text-blue-300 transition-colors">{pacienteActual.summary}</h3>
                  <p className="text-xs text-[#EBCAC5]/80 mt-1">{pacienteActual.descripcion || 'Sin observaciones clínicas previas.'}</p>
                </div>

                <div className="bg-[#141010] p-4 rounded-xl border border-[#513028]/60 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#EBCAC5]/60">Horario programado:</span>
                    <span className="font-mono text-[#FDFBFB] font-bold">
                      {new Date(pacienteActual.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-[#EBCAC5]/50 text-sm">
                Ningún paciente seleccionado en el sillón.
              </div>
            )}
          </div>

          {/* Botones de Cambio Rápido de Estado */}
          <div className="mt-8 space-y-2.5">
            <p className="text-xs font-semibold text-[#EBCAC5]/70 mb-2">Acciones de Gabinete:</p>
            <button 
              onClick={() => setEstadoSillon('ocupado')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#513028] hover:bg-[#3D231E] text-[#FDFBFB] text-xs font-bold border border-[#EBCAC5]/30 transition-all shadow"
            >
              Marcar Sillón: Ocupado (En Tratamiento)
            </button>
            <button 
              onClick={() => setEstadoSillon('esterilizando')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2C1B17] hover:bg-[#513028] text-[#EBCAC5] text-xs font-semibold border border-[#513028] transition-all"
            >
              Tiempo de Esterilización / Buffer
            </button>
            <button 
              onClick={() => setEstadoSillon('libre')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141010] hover:bg-[#2C1B17] text-[#EBCAC5] text-xs font-medium border border-[#513028]/50 transition-all"
            >
              Liberar Sillón (Siguiente Paciente)
            </button>
          </div>
        </section>

        {/* Listado de Citas del Sábado (Derecha) */}
        <section className="lg:col-span-2 bg-[#1E1513] rounded-2xl shadow-xl border border-[#513028]/60 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-[#513028]/40 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#FDFBFB]">Agenda del Sábado</h2>
              <p className="text-xs text-[#EBCAC5]/70">Flujo diario de pacientes agendados</p>
            </div>
            <span className="text-xs font-semibold text-[#EBCAC5] bg-[#513028] px-3 py-1 rounded-lg border border-[#EBCAC5]/30">
              {citas.length} citas para hoy
            </span>
          </div>

          {error && (
            <div className="p-4 bg-[#2C1B17] border border-[#513028] rounded-xl text-[#EBCAC5] text-sm">
              <p className="font-bold mb-1">Se requiere autenticación de Google Calendar:</p>
              <p className="text-xs text-[#EBCAC5]/70">Haz clic en <strong>Sincronizar Google</strong> arriba a la derecha.</p>
            </div>
          )}

          {citas.length > 0 && (
            <div className="space-y-3 max-h-120 overflow-y-auto pr-2">
              {citas.map((cita, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setPacienteActual(cita);
                    setSelectedPatient({ name: cita.summary, phone: '600000000', dni: '12345678X' });
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    pacienteActual?.summary === cita.summary 
                      ? 'bg-[#2C1B17] border-[#EBCAC5] shadow-md' 
                      : 'bg-[#141010] border-[#513028]/40 hover:border-[#513028]'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#FDFBFB] text-base">
                      {cita.summary}
                    </h3>
                    <p className="text-xs text-[#EBCAC5]/70 line-clamp-1">
                      {cita.descripcion || 'Sin notas clínicas adicionales'}
                    </p>
                  </div>
                  
                  <div className="text-right bg-[#1E1513] px-3.5 py-2 rounded-xl border border-[#513028]">
                    <span className="text-xs font-bold text-[#EBCAC5] block capitalize">
                      {new Date(cita.start).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-xs font-semibold text-[#FDFBFB] font-mono">
                      {new Date(cita.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* MODAL / DRAWER LATERAL DE PACIENTE */}
      {selectedPatient && (
        <PatientModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
}