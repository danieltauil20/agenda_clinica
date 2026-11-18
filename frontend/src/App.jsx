import { useState, useEffect } from 'react';
import PatientModal from './components/PatientModal';
import { obtenerPacientes, crearPaciente } from './services/api';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  // FORMULARIO DE ALTA
  const [newFullName, setNewFullName] = useState('');
  const [docType, setDocType] = useState('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [postalCode, setPostalCode] = useState('28222');
  const [city, setCity] = useState('MAJADAHONDA');
  const [province, setProvince] = useState('MADRID');
  const [newLegalTutor, setNewLegalTutor] = useState('');
  const [newRgpdAccepted, setNewRgpdAccepted] = useState(false);

  // Historia Clínica y Diagnóstico simplificado
  const [newAllergies, setNewAllergies] = useState('');
  const [newDiseases, setNewDiseases] = useState('');
  const [newMedication, setNewMedication] = useState('');

  // CARGAR PACIENTES DESDE EL BACKEND EN RENDER
  useEffect(() => {
    let isMounted = true;
    
    async function fetchPacientes() {
      setLoading(true);
      try {
        const data = await obtenerPacientes();
        if (isMounted) {
          setPatients(data);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('No se pudo conectar con el servidor en la nube.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPacientes();

    return () => {
      isMounted = false;
    };
  }, []);

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
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.num_doc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!newFullName.trim() || !newRgpdAccepted) return;

    const cleanPhone = newPhone.replace(/\s/g, '');
    if (cleanPhone.length !== 9) {
      alert('El teléfono móvil debe tener exactamente 9 dígitos.');
      return;
    }

    const patientPayload = {
      nombre: newFullName.toUpperCase(),
      tipo_doc: docType,
      num_doc: docNumber.toUpperCase() || 'SIN IDENTIFICAR',
      telefono: newPhone,
      email: newEmail.toLowerCase() || '',
      direccion: `${newStreet.toUpperCase()}, ${postalCode} ${city.toUpperCase()} (${province.toUpperCase()})`,
      contacto_emergencia: newLegalTutor.toUpperCase() || '',
      tel_emergencia: '',
      alergias: newAllergies.toUpperCase() || 'NINGUNA',
      antecedentes: `${newDiseases.toUpperCase()} / Med: ${newMedication.toUpperCase()}`,
      lopd: newRgpdAccepted
    };

    try {
      await crearPaciente(patientPayload);
      
      // Limpiar formulario
      setNewFullName('');
      setDocNumber('');
      setNewPhone('');
      setNewEmail('');
      setNewStreet('');
      setNewLegalTutor('');
      setNewRgpdAccepted(false);
      setNewAllergies('');
      setNewDiseases('');
      setNewMedication('');
      setShowNewPatientModal(false);

      // Recargar lista actualizada
      const data = await obtenerPacientes();
      setPatients(data);
    } catch {
      alert('Hubo un error al registrar el paciente en el servidor.');
    }
  };

  const handleUpdatePatient = (updatedPatient) => {
    const updatedList = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
    setPatients(updatedList);
    setSelectedPatient(updatedPatient);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Clínica Dental Dra. Edianny Salazar</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Nube Activa (Render) • Nuevos Ministerios, Madrid</p>
          </div>
          
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Crear Ficha e Historia Clínica
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* DIRECTORIO GENERAL */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Directorio General de Pacientes (Servidor Remoto)</h2>
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
                  <th className="p-3 font-semibold">Visitas / Presupuestos</th>
                  <th className="p-3 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400 italic">Cargando pacientes desde la nube...</td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400 italic">No hay pacientes registrados en el servidor.</td>
                  </tr>
                ) : (
                  filteredPatients.map(patient => (
                    <tr 
                      key={patient.id} 
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="p-3 font-bold text-slate-900">{patient.nombre}</td>
                      <td className="p-3 text-slate-600 font-mono">{patient.telefono}</td>
                      <td className="p-3 text-slate-600 font-mono">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded mr-1.5">{patient.tipo_doc || 'DNI'}</span>
                        {patient.num_doc}
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-mono mr-2">
                          Visitas: {patient.total_visitas}
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-mono">
                          Presupuestos: {patient.total_presupuestos}
                        </span>
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
                <h3 className="text-lg font-extrabold text-slate-900">Registrar Nuevo Paciente (Nube)</h3>
                <p className="text-xs text-slate-400">Los datos se guardarán directamente en PostgreSQL en Render</p>
              </div>
              <button type="button" onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg p-2">✕</button>
            </div>
            
            <div className="space-y-5">
              
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">📋 Datos Personales</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value.toUpperCase())}
                      required
                      placeholder="EJ. ANA MARÍA TORRES"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none uppercase"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo de Identificación *</label>
                    <select 
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 uppercase"
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
                      placeholder="12345678-X"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono uppercase"
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
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value.toLowerCase())}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 lowercase"
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
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono font-bold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Calle y Número *</label>
                    <input 
                      type="text" 
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value.toUpperCase())}
                      required
                      placeholder="CALLE PRÍNCIPE DE VERGARA 45"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 uppercase"
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
                      Cláusula de Protección de Datos (RGPD) Firmada *
                    </label>
                  </div>
                </div>
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
                Guardar en la Nube
              </button>
            </div>
          </form>
        </div>
      )}

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