import { useState, useEffect } from 'react';
import PatientModal from './components/PatientModal';
import { lookupPostalCode } from './utils/postalCodes';

export default function App() {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('dental_patients');
    if (saved) return JSON.parse(saved);
    
    return [
      {
        id: 1,
        name: 'MARÍA GARCÍA LÓPEZ',
        phone: '612 345 678',
        docType: 'DNI',
        docNumber: '12345678-X',
        dob: '1988-04-12',
        email: 'maria.garcia@email.com',
        nextAppointmentDate: new Date().toISOString().split('T')[0],
        nextAppointmentTime: '10:00 - 10:45',
        filiation: { 
          fullName: 'MARÍA GARCÍA LÓPEZ', 
          docType: 'DNI', 
          docNumber: '12345678-X', 
          dob: '1988-04-12', 
          phone: '612 345 678', 
          email: 'maria.garcia@email.com', 
          street: 'CALLE MAYOR 12, 3º A',
          postalCode: '28222',
          city: 'MAJADAHONDA',
          province: 'MADRID',
          rgpdAccepted: true 
        },
        medicalHistory: {
          chiefComplaint: 'REVISIÓN PERIÓDICA Y MOLESTIA AL MASTICAR',
          allergies: 'PENICILINA Y LÁTEX',
          diseases: 'HIPERTENSIÓN ARTERIAL CONTROLADA',
          currentMedication: 'NINGUNA'
        },
        exploration: {
          extraoralATM: 'ATM NORMAL SIN CHASQUIDOS.',
          intraoralMucosa: 'MUCOSA HIDRATADA.',
          complementaryTests: 'ORTOPANTOMOGRAFÍA INICIAL REALIZADA.',
          diagnosis: 'CARIES EN PIEZA 36.'
        },
        evolutionNotes: [
          { id: 1, date: '2026-10-15', tooth: '36', note: 'OBTURACIÓN DE COMPOSITE EN CARA OCLUSAL.', dentist: 'DRA. EDIANNY' }
        ],
        budgets: []
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedAgendaDate, setSelectedAgendaDate] = useState(todayStr);

  // FORMULARIO DE ALTA
  const [newFullName, setNewFullName] = useState('');
  const [docType, setDocType] = useState('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [postalCode, setPostalCode] = useState('28222');
  const [city, setCity] = useState('MAJADAHONDA');
  const [province, setProvince] = useState('MADRID');
  const [newLegalTutor, setNewLegalTutor] = useState('');
  const [newRgpdAccepted, setNewRgpdAccepted] = useState(false);

  // Historia Clínica
  const [newChiefComplaint, setNewChiefComplaint] = useState('');
  const [newAllergies, setNewAllergies] = useState('');
  const [newDiseases, setNewDiseases] = useState('');
  const [newMedication, setNewMedication] = useState('');

  // Exploración y Diagnóstico
  const [newExtraoral, setNewExtraoral] = useState('ATM NORMOCURSIVA, SIN DOLOR A LA PALPACIÓN.');
  const [newIntraoral, setNewIntraoral] = useState('MUCOSA ORAL NORMOCOLOREADA E HIDRATADA.');
  const [newTests, setNewTests] = useState('PENDIENTE DE RADIOGRAFÍA PERIAPICAL / ORTOPANTOMOGRAFÍA.');
  const [newDiagnosis, setNewDiagnosis] = useState('');

  // Cita inicial
  const [hasAppointment, setHasAppointment] = useState(true);
  const [apptDate, setApptDate] = useState(todayStr);
  const [apptTime, setApptTime] = useState('10:00 - 10:30');

  useEffect(() => {
    localStorage.setItem('dental_patients', JSON.stringify(patients));
  }, [patients]);

  const handlePostalCodeChange = (e) => {
    const cp = e.target.value.replace(/\D/g, '').slice(0, 5);
    setPostalCode(cp);

    if (cp.length === 5) {
      const result = lookupPostalCode(cp);
      if (result.city) setCity(result.city);
      if (result.province) setProvince(result.province);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.docNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const agendaAppointments = patients.filter(p => p.nextAppointmentDate === selectedAgendaDate);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
    } else if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    }
    setNewPhone(formatted);
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    if (!newFullName.trim() || !newRgpdAccepted) return;

    const cleanPhone = newPhone.replace(/\s/g, '');
    if (cleanPhone.length !== 9) {
      alert('El teléfono móvil debe tener exactamente 9 dígitos.');
      return;
    }

    const newPatientObj = {
      id: Date.now(),
      name: newFullName.toUpperCase(),
      phone: newPhone,
      docType,
      docNumber: docNumber.toUpperCase() || 'SIN IDENTIFICAR',
      dob: newDob || 'NO ESPECIFICADA',
      email: newEmail.toLowerCase() || 'no especificado',
      nextAppointmentDate: hasAppointment ? apptDate : '',
      nextAppointmentTime: hasAppointment ? apptTime : '',
      filiation: {
        fullName: newFullName.toUpperCase(),
        docType,
        docNumber: docNumber.toUpperCase() || 'SIN IDENTIFICAR',
        dob: newDob || 'NO ESPECIFICADA',
        phone: newPhone,
        email: newEmail.toLowerCase() || 'no especificado',
        street: newStreet.toUpperCase() || '',
        postalCode: postalCode.toUpperCase(),
        city: city.toUpperCase() || 'MAJADAHONDA',
        province: province.toUpperCase() || 'MADRID',
        legalTutor: newLegalTutor.toUpperCase() || '',
        rgpdAccepted: newRgpdAccepted
      },
      medicalHistory: {
        chiefComplaint: newChiefComplaint.toUpperCase() || 'PRIMERA VISITA',
        allergies: newAllergies.toUpperCase() || 'NINGUNA CONOCIDA',
        diseases: newDiseases.toUpperCase() || 'NINGUNA DE INTERÉS',
        currentMedication: newMedication.toUpperCase() || 'NINGUNA'
      },
      exploration: {
        extraoralATM: newExtraoral.toUpperCase(),
        intraoralMucosa: newIntraoral.toUpperCase(),
        complementaryTests: newTests.toUpperCase(),
        diagnosis: newDiagnosis.toUpperCase() || 'EXPLORACIÓN INICIAL EN CURSO'
      },
      evolutionNotes: [],
      budgets: []
    };

    setPatients([newPatientObj, ...patients]);

    setNewFullName('');
    setDocType('DNI');
    setDocNumber('');
    setNewDob('');
    setNewPhone('');
    setNewEmail('');
    setNewStreet('');
    setPostalCode('28222');
    setCity('MAJADAHONDA');
    setProvince('MADRID');
    setNewLegalTutor('');
    setNewRgpdAccepted(false);
    setNewChiefComplaint('');
    setNewAllergies('');
    setNewDiseases('');
    setNewMedication('');
    setNewDiagnosis('');
    setHasAppointment(true);
    setApptDate(todayStr);
    setApptTime('10:00 - 10:30');
    
    setShowNewPatientModal(false);
    setSelectedPatient(newPatientObj);
  };

  const handleUpdatePatient = (updatedPatient) => {
    const updatedList = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
    setPatients(updatedList);
    setSelectedPatient(updatedPatient);
  };

  const handleSyncGoogleCalendar = (patient) => {
    if (!patient.nextAppointmentDate || !patient.nextAppointmentTime) {
      alert('Este paciente no tiene una fecha de cita asignada.');
      return;
    }
    const title = encodeURIComponent(`Cita Dental: ${patient.name}`);
    const details = encodeURIComponent(`Consulta odontológica con Dra. Edianny Salazar.\nTel: ${patient.phone}`);
    const dateFormatted = patient.nextAppointmentDate.replace(/-/g, '');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateFormatted}/${dateFormatted}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Clínica Dental Dra. Edianny Salazar</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Gestión integral de pacientes, historia clínica y presupuestos • Nuevos Ministerios, Madrid</p>
          </div>
          
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Crear Ficha e Historia Clínica
          </button>
        </div>

        {/* AGENDA */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">📅 Agenda de Citas</h2>
              <p className="text-xs text-slate-400">Selecciona una fecha para consultar la planificación de la jornada</p>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Ver día:</label>
              <input 
                type="date" 
                value={selectedAgendaDate}
                onChange={(e) => setSelectedAgendaDate(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-blue-700 focus:outline-none"
              />
              <button 
                onClick={() => setSelectedAgendaDate(todayStr)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl transition"
              >
                Hoy
              </button>
            </div>
          </div>

          {agendaAppointments.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm text-slate-400 font-medium">No hay pacientes citados para el día <strong className="text-slate-700">{selectedAgendaDate}</strong>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agendaAppointments.map(patient => (
                <div 
                  key={patient.id} 
                  className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50/60 to-indigo-50/30 border border-blue-100 rounded-2xl shadow-xs"
                >
                  <div className="space-y-1 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">{patient.name}</h3>
                    <p className="text-xs text-slate-500">Tel: {patient.phone} • Doc: {patient.docNumber}</p>
                    <p className="text-xs text-blue-700 font-bold pt-0.5">⏰ {patient.nextAppointmentTime || 'Hora no especificada'}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 items-end">
                    <button 
                      onClick={() => setSelectedPatient(patient)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-xl shadow-xs transition"
                    >
                      Abrir Historia
                    </button>
                    <button 
                      onClick={() => handleSyncGoogleCalendar(patient)}
                      className="text-[10px] text-slate-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 transition"
                    >
                      📅 Sincronizar Google
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIRECTORIO GENERAL */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Directorio General de Pacientes</h2>
            <input 
              type="text" 
              placeholder="Buscar por nombre, documento o teléfono..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Paciente</th>
                  <th className="p-3 font-semibold">Teléfono</th>
                  <th className="p-3 font-semibold">Documento Identificativo</th>
                  <th className="p-3 font-semibold">Próxima Cita Programada</th>
                  <th className="p-3 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400 italic">No hay pacientes registrados.</td>
                  </tr>
                ) : (
                  filteredPatients.map(patient => (
                    <tr 
                      key={patient.id} 
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="p-3 font-bold text-slate-900">{patient.name}</td>
                      <td className="p-3 text-slate-600 font-mono">{patient.phone}</td>
                      <td className="p-3 text-slate-600 font-mono">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded mr-1.5">{patient.docType || 'DNI'}</span>
                        {patient.docNumber}
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        {patient.nextAppointmentDate ? (
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-mono">
                            📅 {patient.nextAppointmentDate} ({patient.nextAppointmentTime})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Sin cita programada</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          Ver Ficha
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL DE NUEVO PACIENTE */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreatePatient} className="bg-white w-full max-w-3xl p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 overflow-y-auto max-h-[90vh] font-sans text-xs">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Crear Ficha e Historia Clínica</h3>
                <p className="text-xs text-slate-400">Base de datos postal completa de España integrada</p>
              </div>
              <button type="button" onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg p-2">✕</button>
            </div>
            
            <div className="space-y-5">
              
              {/* 1. DATOS PERSONALES */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">📋 Datos Personales (RGPD Obligatorio)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      value={newFullName}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').toUpperCase();
                        setNewFullName(val);
                      }}
                      required
                      placeholder="EJ. ANA MARÍA TORRES"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                  
                  {/* TIPO DE IDENTIFICACIÓN */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo de Identificación *</label>
                    <select 
                      value={docType}
                      onChange={(e) => {
                        setDocType(e.target.value);
                        setDocNumber('');
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none font-bold text-slate-800 uppercase"
                    >
                      <option value="DNI">DNI</option>
                      <option value="NIE">NIE</option>
                      <option value="PASAPORTE">PASAPORTE</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Número de {docType} *</label>
                    <input 
                      type="text" 
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value.toUpperCase())}
                      required
                      placeholder={
                        docType === 'DNI' ? 'EJ. 12345678-X' :
                        docType === 'NIE' ? 'EJ. X-1234567-T' : 'EJ. PA1234567'
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fecha de Nacimiento</label>
                    <input 
                      type="date" 
                      value={newDob}
                      onChange={(e) => setNewDob(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil *</label>
                    <input 
                      type="text" 
                      value={newPhone}
                      onChange={handlePhoneChange}
                      required
                      maxLength="11"
                      placeholder="612 345 678"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value.toLowerCase())}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none lowercase"
                    />
                  </div>

                  {/* DIRECCIÓN */}
                  <div className="md:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Calle, Número y Piso *</label>
                    <input 
                      type="text" 
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value.toUpperCase())}
                      required
                      placeholder="CALLE PRÍNCIPE DE VERGARA 45"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Código Postal *</label>
                    <input 
                      type="text" 
                      maxLength="5"
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      required
                      placeholder="28222"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Localidad *</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value.toUpperCase())}
                      required
                      placeholder="MAJADAHONDA"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none font-bold text-slate-800 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Provincia *</label>
                    <input 
                      type="text" 
                      value={province}
                      onChange={(e) => setProvince(e.target.value.toUpperCase())}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none font-bold text-slate-800 uppercase"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Tutor Legal (Nombre y DNI)</label>
                    <input 
                      type="text" 
                      value={newLegalTutor}
                      onChange={(e) => setNewLegalTutor(e.target.value.toUpperCase())}
                      placeholder="JUAN PÉREZ (12345678-A)"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                </div>

                {/* RGPD OBLIGATORIO */}
                <div className="pt-3 border-t border-slate-200 bg-emerald-50/80 p-4 rounded-xl border border-emerald-300">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="newRgpd"
                      required
                      checked={newRgpdAccepted}
                      onChange={(e) => setNewRgpdAccepted(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer mt-0.5"
                    />
                    <label htmlFor="newRgpd" className="font-bold text-emerald-950 cursor-pointer leading-tight">
                      Cláusula de Protección de Datos (RGPD) Firmada y Conforme *
                      <span className="block font-normal text-[11px] text-emerald-800 mt-0.5">
                        Obligatorio: El paciente consiente el tratamiento de sus datos de salud para la historia clínica.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. HISTORIA CLÍNICA */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">🩺 Historia Clínica (Motivo, Alergias y Salud)</h4>
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Motivo Principal de Consulta</label>
                  <input 
                    type="text" 
                    value={newChiefComplaint}
                    onChange={(e) => setNewChiefComplaint(e.target.value.toUpperCase())}
                    placeholder='EJ. "ME MOLESTA AL MORDER EN EL LADO DERECHO"'
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <label className="block font-bold text-rose-700 uppercase text-[10px] mb-1">⚠️ Alergias</label>
                    <textarea 
                      value={newAllergies}
                      onChange={(e) => setNewAllergies(e.target.value.toUpperCase())}
                      placeholder="INDICAR CUALQUIER ALERGIA..."
                      rows="2"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none uppercase"
                    />
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">💊 Medicación Habitual</label>
                    <textarea 
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value.toUpperCase())}
                      placeholder="ANTICOAGULANTES, ANTIHIPERTENSIVOS..."
                      rows="2"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-300">
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">🏥 Enfermedades Sistémicas / Antecedentes Médicos</label>
                  <textarea 
                    value={newDiseases}
                    onChange={(e) => setNewDiseases(e.target.value.toUpperCase())}
                    placeholder="DIABETES, HIPERTENSIÓN, CARDIOPATÍAS..."
                    rows="2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* 3. DIAGNÓSTICO */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">🔍 Diagnóstico (Exploración y Pruebas)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exploración Extraoral (ATM)</label>
                    <input 
                      type="text" 
                      value={newExtraoral}
                      onChange={(e) => setNewExtraoral(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exploración Intraoral (Mucosas)</label>
                    <input 
                      type="text" 
                      value={newIntraoral}
                      onChange={(e) => setNewIntraoral(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pruebas Complementarias (Rx)</label>
                    <input 
                      type="text" 
                      value={newTests}
                      onChange={(e) => setNewTests(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Diagnóstico Clínico Principal *</label>
                    <input 
                      type="text" 
                      value={newDiagnosis}
                      onChange={(e) => setNewDiagnosis(e.target.value.toUpperCase())}
                      required
                      placeholder="EJ. PULPITIS IRREVERSIBLE, CARIES..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* CITA INICIAL */}
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="scheduleCheck"
                    checked={hasAppointment}
                    onChange={(e) => setHasAppointment(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="scheduleCheck" className="font-bold text-blue-900 cursor-pointer text-xs">
                    📅 Programar primera cita en el calendario
                  </label>
                </div>

                {hasAppointment && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Fecha de la Cita</label>
                      <input 
                        type="date" 
                        value={apptDate}
                        onChange={(e) => setApptDate(e.target.value)}
                        required={hasAppointment}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Horario / Franja</label>
                      <input 
                        type="text" 
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        placeholder="Ej. 10:00 - 10:45"
                        required={hasAppointment}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowNewPatientModal(false)}
                className="text-xs font-semibold text-slate-600 px-5 py-3 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition"
              >
                Guardar y Crear Ficha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE HISTORIA CLÍNICA */}
      {selectedPatient && (
        <PatientModal 
          patient={selectedPatient} 
          onUpdatePatient={handleUpdatePatient}
          onClose={() => setSelectedPatient(null)} 
        />
      )}

    </div>
  );
}