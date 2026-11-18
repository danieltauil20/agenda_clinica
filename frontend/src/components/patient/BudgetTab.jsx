import { useState } from 'react';

export default function BudgetTab({ patient, onUpdatePatient }) {
  const [budgets, setBudgets] = useState(patient.budgets || []);
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false);

  // Campos para el nuevo presupuesto profesional
  const [budgetName, setBudgetName] = useState('');
  const [validityDays, setValidityDays] = useState('30'); // 30 o 90 días
  const [paymentTerms, setPaymentTerms] = useState('50% al inicio y 50% a la finalización del tratamiento.');
  
  const [items, setItems] = useState([
    { id: 1, treatment: 'Estudio clínico, diagnóstico y radiografía', tooth: 'General', qty: 1, price: 0 }
  ]);

  // Añadir línea
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), treatment: '', tooth: '', qty: 1, price: '' }]);
  };

  // Actualizar línea
  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          [field]: field === 'qty' || field === 'price' ? (parseFloat(value) || 0) : value 
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Eliminar línea
  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // Calcular subtotal general
  const calculateTotal = (currentItems) => {
    return currentItems.reduce((sum, item) => sum + ((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 1)), 0);
  };

  // Guardar presupuesto
  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!budgetName.trim()) return;

    const totalAmount = calculateTotal(items);
    const today = new Date().toISOString().split('T')[0];

    const newBudgetObj = {
      id: Date.now(),
      date: today,
      validityDays,
      name: budgetName,
      paymentTerms,
      items: items.map(i => ({ 
        ...i, 
        price: parseFloat(i.price) || 0,
        qty: parseInt(i.qty) || 1 
      })),
      total: totalAmount,
      status: 'Pendiente' // 'Pendiente' | 'Aceptado' | 'Rechazado'
    };

    const updatedBudgets = [newBudgetObj, ...budgets];
    setBudgets(updatedBudgets);

    const updatedPatient = {
      ...patient,
      budgets: updatedBudgets
    };
    onUpdatePatient(updatedPatient);

    // Reset
    setBudgetName('');
    setItems([{ id: 1, treatment: 'Estudio clínico y diagnóstico', tooth: 'General', qty: 1, price: 0 }]);
    setShowNewBudgetForm(false);
  };

  // Cambiar estado
  const handleUpdateStatus = (budgetId, newStatus) => {
    const updatedBudgets = budgets.map(b => {
      if (b.id === budgetId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBudgets(updatedBudgets);

    const updatedPatient = {
      ...patient,
      budgets: updatedBudgets
    };
    onUpdatePatient(updatedPatient);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* CABECERA DE SECCIÓN */}
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">💶 Presupuestos y Planes de Tratamiento</h3>
          <p className="text-slate-400">Estándar profesional clínico (Transparencia de fases y costes)</p>
        </div>
        <button
          onClick={() => setShowNewBudgetForm(!showNewBudgetForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          {showNewBudgetForm ? 'Cancelar' : '+ Emitir Nuevo Presupuesto'}
        </button>
      </div>

      {/* FORMULARIO DE NUEVO PRESUPUESTO PROFESIONAL */}
      {showNewBudgetForm && (
        <form onSubmit={handleSaveBudget} className="bg-emerald-50/40 border border-emerald-200 p-6 rounded-3xl space-y-5">
          <div className="border-b border-emerald-200 pb-3">
            <h4 className="font-extrabold text-emerald-900 text-sm">Emisión de Presupuesto Clínico Detallado</h4>
            <p className="text-slate-500 text-[11px]">Incluye datos de la clínica Dra. Edianny Salazar, desglose por fases y condiciones de pago.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Nombre del Plan / Tratamiento *</label>
              <input 
                type="text" 
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                required
                placeholder="Ej. Rehabilitación Sector Posterior y Endodoncia"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Validez del Presupuesto</label>
              <select 
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="30">30 días</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
              </select>
            </div>
          </div>

          {/* DESGLOSE DE FASES Y TRATAMIENTOS */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 uppercase text-[10px]">Desglose de Tratamientos y Fases (Incluyendo Anestesia y Revisiones)</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Garantía sin costes ocultos</span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Pieza / Zona</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 36" 
                    value={item.tooth}
                    onChange={(e) => handleItemChange(item.id, 'tooth', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold"
                  />
                </div>
                <div className="md:col-span-6">
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Descripción del Procedimiento</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Endodoncia + Obturación + Revisiones..." 
                    value={item.treatment}
                    onChange={(e) => handleItemChange(item.id, 'treatment', e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Cant.</label>
                  <input 
                    type="number" 
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-center font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Precio Unit. (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-right font-mono"
                  />
                </div>
                <div className="md:col-span-1 flex justify-center pt-4">
                  {items.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button 
                type="button"
                onClick={handleAddItem}
                className="text-emerald-700 hover:text-emerald-800 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 transition"
              >
                + Añadir otra fase o tratamiento
              </button>
              <div className="text-base font-black text-slate-900 font-mono">
                Total Final: {calculateTotal(items).toFixed(2)} €
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Forma de Pago y Condiciones</label>
            <input 
              type="text" 
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-emerald-200">
            <button 
              type="button" 
              onClick={() => setShowNewBudgetForm(false)}
              className="text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-xl transition font-semibold"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition"
            >
              Emitir y Guardar Presupuesto
            </button>
          </div>
        </form>
      )}

      {/* LISTADO DE PRESUPUESTOS EMITIDOS */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-slate-400 italic py-8 text-center bg-white border border-slate-200 rounded-2xl">
            No hay presupuestos emitidos para este paciente.
          </p>
        ) : (
          budgets.map((budget) => (
            <div key={budget.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
              
              {/* CABECERA CORPORATIVA INSTITUCIONAL DEL PRESUPUESTO */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">CLÍNICA DENTAL DRA. EDIANNY SALAZAR</h4>
                  <p className="text-[10px] text-slate-500">Nuevos Ministerios, Madrid • Odontología General y Estética</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Emisión: {budget.date} • Validez: {budget.validityDays || 30} días</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    budget.status === 'Aceptado' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    budget.status === 'Rechazado' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {budget.status}
                  </span>

                  {/* Cambiar estado */}
                  <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => handleUpdateStatus(budget.id, 'Pendiente')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${budget.status === 'Pendiente' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
                    >
                      Pendiente
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(budget.id, 'Aceptado')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${budget.status === 'Aceptado' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                    >
                      Aceptar
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(budget.id, 'Rechazado')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${budget.status === 'Rechazado' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>

              {/* TÍTULO DEL PLAN */}
              <div>
                <h5 className="font-extrabold text-slate-800 text-sm">{budget.name}</h5>
              </div>

              {/* TABLA DE FASES Y TRATAMIENTOS DETALLADOS */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-2 font-semibold w-16">Pieza</th>
                      <th className="py-2.5 px-2 font-semibold">Descripción del Tratamiento / Fase</th>
                      <th className="py-2.5 px-2 font-semibold text-center w-16">Cant.</th>
                      <th className="py-2.5 px-2 font-semibold text-right">Precio Unit.</th>
                      <th className="py-2.5 px-2 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {budget.items.map((item, idx) => {
                      const qty = item.qty || 1;
                      const price = item.price || 0;
                      const subtotal = qty * price;
                      return (
                        <tr key={idx} className="text-slate-700">
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-500">#{item.tooth || 'Gen'}</td>
                          <td className="py-2.5 px-2 font-medium text-slate-900">{item.treatment}</td>
                          <td className="py-2.5 px-2 text-center font-mono">{qty}</td>
                          <td className="py-2.5 px-2 text-right font-mono">{price.toFixed(2)} €</td>
                          <td className="py-2.5 px-2 text-right font-mono font-semibold">{subtotal.toFixed(2)} €</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* CONDICIONES Y TOTAL */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-4 border-t border-slate-100 gap-4">
                <div className="text-slate-500 text-[11px] max-w-md">
                  <span className="font-bold text-slate-700 block mb-0.5">Forma de Pago y Garantía:</span>
                  <p>{budget.paymentTerms || 'Pago según fases clínicas acordadas. Incluye anestesia y revisiones.'}</p>
                </div>

                <div className="text-right w-full md:w-auto">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Importe Total Presupuestado</span>
                  <span className="text-lg font-black text-slate-900 font-mono">{budget.total.toFixed(2)} €</span>
                </div>
              </div>

              {/* BLOQUE DE CONFORMIDAD Y FIRMA */}
              {budget.status === 'Aceptado' && (
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex justify-between items-center text-[11px] text-emerald-900">
                  <span>✓ Presupuesto aceptado y firmado por el paciente para inicio de tratamiento.</span>
                  <span className="font-mono font-bold">Dra. Edianny Salazar</span>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}