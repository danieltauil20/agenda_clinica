const API_URL = 'https://agenda-clinica-fg18.onrender.com';

// Obtener todos los pacientes
export const obtenerPacientes = async () => {
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        if (!response.ok) throw new Error('Error al obtener los pacientes');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

// Crear un nuevo paciente
export const crearPaciente = async (datosPaciente) => {
    try {
        const response = await fetch(`${API_URL}/pacientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosPaciente),
        });
        if (!response.ok) throw new Error('Error al registrar el paciente');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};