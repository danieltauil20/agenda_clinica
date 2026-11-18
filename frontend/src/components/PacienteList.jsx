

export const PacienteList = ({ pacientes }) => {
    if (!pacientes.length) {
        return <p className="text-gray-500 italic p-4">No hay pacientes registrados todavía. ¡Añade el primero!</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOPD</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pacientes.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.tipo_doc}: {p.num_doc || 'N/D'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.telefono}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.email || 'N/D'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.lopd ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {p.lopd ? 'Firmado' : 'Pendiente'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};