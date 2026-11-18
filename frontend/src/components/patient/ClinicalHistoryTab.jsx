import { useState } from 'react';

export default function ClinicalHistoryTab({ patient, onUpdatePatient }) {
  // 'personal' | 'medical' | 'diagnosis' | 'documents' | 'treatments'
  const [activeSubTab, setActiveSubTab] = useState('personal');

  // 1. Datos Personales y RGPD
  const [filiation, setFiliation] = useState(patient.filiation || {
    fullName: patient.name || '',
    docType: patient.docType || 'DNI',
    docNumber: patient.docNumber || '',
    dob: patient.dob || '',
    phone: patient.phone || '',
    email: patient.email || '',
    street: patient.street || '',
    postalCode: patient.postalCode || '',
    city: patient.city || '',
    province: patient.province || '',
    legalTutor: patient.legalTutor || '',
    rgpdAccepted: patient.rgpdAccepted || true,
  });

  // 2. Historia Clínica
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory || {
    chiefComplaint: patient.chiefComplaint || '',
    allergies: '',
    diseases: '',
    currentMedication: ''
  });

  // 3. Diagnóstico
  const [exploration, setExploration] = useState(patient.exploration || {
    extraoralATM: 'ATM SIN CHASQUIDOS NI DOLOR A LA PALPACIÓN.',
    intraoralMucosa: 'MUCOSA ROSADA E HIDRATADA.',
    complementaryTests: 'ORTOPANTOMOGRAFÍA DIGITAL.',
    diagnosis: 'CARIES OCLUSAL EN PIEZA 36.'
  });

  // 4. Documentación
  const [consents] = useState(patient.consents || [
    { id: 1, title: 'CONSENTIMIENTO GENERAL Y ANESTESIA LOCAL', signed: true, date: '2026-10-31' }
  ]);

  // 5. Tratamientos
  const [evolutionNotes, setEvolutionNotes] = useState(patient.evolutionNotes || []);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newTooth, setNewTooth] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
    } else if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    }
    setFiliation({...filiation, phone: formatted});
  };

  const handleSaveFullHistory = () => {
    const cleanPhone = filiation.phone.replace(/\s/g, '');
    if (cleanPhone.length !== 9) {
      alert('El teléfono móvil debe tener exactamente 9 dígitos.');
      return;
    }

    const updatedPatient = {
      ...patient,
      name: filiation.fullName.toUpperCase(),
      phone: filiation.phone,
      docType: filiation.docType,
      docNumber: filiation.docNumber.toUpperCase(),
      dob: filiation.dob,
      filiation: {
        ...filiation,
        fullName: filiation.fullName.toUpperCase(),
        docNumber: filiation.docNumber.toUpperCase(),
        email: filiation.email.toLowerCase(),
        street: filiation.street.toUpperCase(),
        postalCode: filiation.postalCode,
        city: filiation.city.toUpperCase(),
        province: filiation.province.toUpperCase(),
        legalTutor: filiation.legalTutor.toUpperCase()
      },
      medicalHistory: {
        chiefComplaint: medicalHistory.chiefComplaint.toUpperCase(),
        allergies: medicalHistory.allergies.toUpperCase(),
        diseases: medicalHistory.diseases.toUpperCase(),
        currentMedication: medicalHistory.currentMedication.toUpperCase()
      },
      exploration: {
        extraoralATM: exploration.extraoralATM.toUpperCase(),
        intraoralMucosa: exploration.intraoralMucosa.toUpperCase(),
        complementaryTests: exploration.complementaryTests.toUpperCase(),
        diagnosis: exploration.diagnosis.toUpperCase()
      },
      consents,
      evolutionNotes
    };
    onUpdatePatient(updatedPatient);
    setIsEditing(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const nuevaNota = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      tooth: newTooth.toUpperCase() || 'GENERAL',
      note: newNoteText.toUpperCase(),
      dentist: 'DRA. EDIANNY'
    };

    const updatedNotes = [nuevaNota, ...evolutionNotes];
    setEvolutionNotes(updatedNotes);

    const updated = {
      ...patient,
      evolutionNotes: updatedNotes
    };
    onUpdatePatient(updated);

    setNewNoteText('');
    setNewTooth('');
    setShowNoteForm(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* BARRA DE SECCIONES */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('personal')}
          className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'personal' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📋 Datos Personales
        </button>
        <button
          onClick={() => setActiveSubTab('medical')}
          className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'medical' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🩺 Historia Clínica
        </button>
        <button
          onClick={() => setActiveSubTab('diagnosis')}
          className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'diagnosis' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🔍 Diagnóstico
        </button>
        <button
          onClick={() => setActiveSubTab('documents')}
          className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'documents' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📝 Documentación
        </button>
        <button
          onClick={() => setActiveSubTab('treatments')}
          className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'treatments' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🦷 Tratamientos
        </button>
      </div>

      {/* BOTÓN SUPERIOR DE GUARDAR / EDITAR */}
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600">
          Estado del Expediente: <strong className="text-emerald-700">Conforme a Normativa Sanitaria</strong>
        </span>
        <button
          onClick={() => {
            if (isEditing) handleSaveFullHistory();
            else setIsEditing(true);
          }}
          className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition"
        >
          {isEditing ? '💾 Guardar Ficha Completa' : '✏️ Editar Datos Clínicos'}
        </button>
      </div>

      {/* ---------------- 1. DATOS PERSONALES ---------------- */}
      {activeSubTab === 'personal' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-2">
            1. Datos de Identificación y Protección de Datos (RGPD)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.fullName}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').toUpperCase();
                  setFiliation({...filiation, fullName: val});
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>

            {/* TIPO DE IDENTIFICACIÓN */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Identificación</label>
              <select 
                disabled={!isEditing}
                value={filiation.docType || 'DNI'}
                onChange={(e) => setFiliation({...filiation, docType: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-800 uppercase"
              >
                <option value="DNI">DNI</option>
                <option value="NIE">NIE</option>
                <option value="PASAPORTE">PASAPORTE</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Número de Documento *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.docNumber}
                onChange={(e) => setFiliation({...filiation, docNumber: e.target.value.toUpperCase()})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input 
                type="date" 
                disabled={!isEditing}
                value={filiation.dob}
                onChange={(e) => setFiliation({...filiation, dob: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.phone}
                onChange={handlePhoneChange}
                maxLength="11"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                disabled={!isEditing}
                value={filiation.email}
                onChange={(e) => setFiliation({...filiation, email: e.target.value.toLowerCase()})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none lowercase"
              />
            </div>

            {/* DIRECCIÓN */}
            <div className="md:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Calle, Número y Piso *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.street}
                onChange={(e) => setFiliation({...filiation, street: e.target.value.toUpperCase()})}
                placeholder="CALLE PRÍNCIPE DE VERGARA 45"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>

            {/* CÓDIGO POSTAL LIBRE */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Código Postal *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                maxLength="5"
                value={filiation.postalCode}
                onChange={(e) => {
                  const cp = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setFiliation({...filiation, postalCode: cp});
                }}
                placeholder="28312"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-mono font-bold text-slate-800"
              />
            </div>

            {/* LOCALIDAD LIBRE */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Localidad *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.city}
                onChange={(e) => setFiliation({...filiation, city: e.target.value.toUpperCase()})}
                placeholder="ARANJUEZ (LAS INFANTAS)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-800 uppercase"
              />
            </div>

            {/* PROVINCIA LIBRE */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Provincia *</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.province}
                onChange={(e) => setFiliation({...filiation, province: e.target.value.toUpperCase()})}
                placeholder="MADRID"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-800 uppercase"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Tutor Legal (Nombre y DNI)</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={filiation.legalTutor}
                onChange={(e) => setFiliation({...filiation, legalTutor: e.target.value.toUpperCase()})}
                placeholder="JUAN PÉREZ (12345678-A)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 bg-emerald-50/80 p-4 rounded-xl border border-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                disabled={!isEditing}
                id="rgpdCheck"
                checked={filiation.rgpdAccepted}
                onChange={(e) => setFiliation({...filiation, rgpdAccepted: e.target.checked})}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="rgpdCheck" className="font-bold text-emerald-900 cursor-pointer">
                Cláusula de Protección de Datos (RGPD) Firmada y Conforme
              </label>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
              ✓ RGPD Verificado
            </span>
          </div>
        </div>
      )}

      {/* ---------------- 2. HISTORIA CLÍNICA ---------------- */}
      {activeSubTab === 'medical' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-2">
            2. Anamnesis, Alergias y Antecedentes de Salud
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Motivo Principal de Consulta</label>
            <input 
              type="text" 
              disabled={!isEditing}
              value={medicalHistory.chiefComplaint}
              onChange={(e) => setMedicalHistory({...medicalHistory, chiefComplaint: e.target.value.toUpperCase()})}
              placeholder='EJ. "ME MOLESTA AL MORDER EN EL LADO DERECHO"'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block font-bold text-rose-700 uppercase text-[10px] mb-1">⚠️ Alergias Conocidas</label>
              <textarea 
                disabled={!isEditing}
                value={medicalHistory.allergies}
                onChange={(e) => setMedicalHistory({...medicalHistory, allergies: e.target.value.toUpperCase()})}
                placeholder="ALERGIA A MEDICAMENTOS, LÁTEX..."
                rows="2"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none uppercase"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">💊 Medicación Habitual</label>
              <textarea 
                disabled={!isEditing}
                value={medicalHistory.currentMedication}
                onChange={(e) => setMedicalHistory({...medicalHistory, currentMedication: e.target.value.toUpperCase()})}
                placeholder="ANTICOAGULANTES, ANTIHIPERTENSIVOS..."
                rows="2"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">🏥 Enfermedades Sistémicas y Antecedentes Médicos</label>
            <textarea 
              disabled={!isEditing}
              value={medicalHistory.diseases}
              onChange={(e) => setMedicalHistory({...medicalHistory, diseases: e.target.value.toUpperCase()})}
              placeholder="DIABETES, HIPERTENSIÓN, CARDIOPATÍAS..."
              rows="3"
              className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-none uppercase"
            />
          </div>
        </div>
      )}

      {/* ---------------- 3. DIAGNÓSTICO ---------------- */}
      {activeSubTab === 'diagnosis' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-2">
            3. Exploración Clínica y Diagnóstico
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Exploración Extraoral (ATM)</label>
              <textarea 
                disabled={!isEditing}
                value={exploration.extraoralATM}
                onChange={(e) => setExploration({...exploration, extraoralATM: e.target.value.toUpperCase()})}
                rows="2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Exploración Intraoral (Mucosas)</label>
              <textarea 
                disabled={!isEditing}
                value={exploration.intraoralMucosa}
                onChange={(e) => setExploration({...exploration, intraoralMucosa: e.target.value.toUpperCase()})}
                rows="2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pruebas Complementarias (Radiografías / TAC)</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={exploration.complementaryTests}
                onChange={(e) => setExploration({...exploration, complementaryTests: e.target.value.toUpperCase()})}
                placeholder="ORTOPANTOMOGRAFÍA, RX PERIAPICAL..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Diagnóstico Clínico Principal</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={exploration.diagnosis}
                onChange={(e) => setExploration({...exploration, diagnosis: e.target.value.toUpperCase()})}
                placeholder="PULPITIS, PERIODONTITIS, CARIES..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none uppercase"
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 4. DOCUMENTACIÓN ---------------- */}
      {activeSubTab === 'documents' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-2">
            4. Consentimientos Informados y Documentos
          </h3>

          <div className="space-y-2">
            {consents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900">{doc.title}</h4>
                  <p className="text-[10px] text-slate-400">Firmado digitalmente el {doc.date}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  ✓ Documento Válido
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 5. TRATAMIENTOS ---------------- */}
      {activeSubTab === 'treatments' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">5. Tratamientos y Evolución en Sillón</h3>
              <p className="text-slate-400">Seguimiento cronológico de intervenciones por visita</p>
            </div>
            <button 
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-xs"
            >
              {showNoteForm ? 'Cancelar' : '+ Registrar Tratamiento / Nota'}
            </button>
          </div>

          {/* Formulario Nueva Nota */}
          {showNoteForm && (
            <form onSubmit={handleAddNote} className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl space-y-3">
              <h4 className="font-bold text-blue-800 uppercase tracking-wide text-[11px]">Nueva Entrada en el Historial de Tratamientos</h4>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block font-medium text-slate-700 mb-1">Pieza Dental</label>
                  <input 
                    type="text" 
                    placeholder="EJ. 36 O GENERAL" 
                    value={newTooth}
                    onChange={(e) => setNewTooth(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none uppercase"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-slate-700 mb-1">Descripción del procedimiento realizado</label>
                  <input 
                    type="text" 
                    placeholder="EJ. ENDODONCIA PIEZA 36, OBTURACIÓN..." 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value.toUpperCase())}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none uppercase"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                >
                  Guardar en Tratamientos
                </button>
              </div>
            </form>
          )}

          {/* Listado de Notas */}
          <div className="space-y-3">
            {evolutionNotes.length === 0 ? (
              <p className="text-slate-400 italic py-6 text-center bg-white border border-slate-200 rounded-2xl">
                No hay tratamientos registrados todavía para este paciente.
              </p>
            ) : (
              evolutionNotes.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 border-l-4 border-l-blue-600 p-4 rounded-2xl shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="font-semibold text-slate-700">📅 {item.date}</span>
                    <span className="bg-blue-50 text-blue-700 font-mono font-semibold px-2 py-0.5 rounded-md">Pieza #{item.tooth}</span>
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed">{item.note}</p>
                  <div className="text-[11px] text-slate-400 text-right pt-1">Atendido por: {item.dentist}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}