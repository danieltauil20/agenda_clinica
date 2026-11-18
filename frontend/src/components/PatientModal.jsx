import { useState } from 'react';
import ClinicalHistoryTab from './patient/ClinicalHistoryTab';
import BudgetTab from './patient/BudgetTab';

export default function PatientModal({ patient, onUpdatePatient, onClose }) {
  // 'history' | 'budgets'
  const [activeTab, setActiveTab] = useState('history');

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 transition-all font-sans">
      <div className="w-full max-w-3xl bg-white text-slate-800 h-full shadow-2xl flex flex-col p-6 md:p-8 overflow-y-auto">
        
        {/* CABECERA DEL PACIENTE */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                Expediente Activo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
              <span>Tel: <strong className="text-slate-700">{patient.phone}</strong></span>
              <span>•</span>
              <span>DNI: <strong className="text-slate-700">{patient.dni || 'No registrado'}</strong></span>
              <span>•</span>
              <span>Nacimiento: <strong className="text-slate-700">{patient.dob || 'No especificada'}</strong></span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        {/* PESTAÑAS PRINCIPALES SIMPLIFICADAS */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'history' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            📋 Historia Clínica y Evolución (Ley 41/2002)
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'budgets' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            💶 Presupuestos y Planes
          </button>
        </div>

        {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
        <div className="flex-1">
          {activeTab === 'history' && (
            <ClinicalHistoryTab 
              patient={patient} 
              onUpdatePatient={onUpdatePatient} 
            />
          )}
          {activeTab === 'budgets' && (
            <BudgetTab 
              patient={patient} 
              onUpdatePatient={onUpdatePatient} 
            />
          )}
        </div>

      </div>
    </div>
  );
}