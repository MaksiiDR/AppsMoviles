// Servicio conectado a la API real de devsChile
// Endpoint: https://feriados-cl.netlify.app/api/holidays/:year

export const ServicioFeriadosChile = {
    /**
     * Verifica asincrónicamente si una fecha en formato YYYY-MM-DD es feriado consultando a la API oficial.
     */
    esFeriado: async (fecha: string): Promise<boolean> => {
        try {
            const [yearStr, monthStr, dayStr] = fecha.split('-');
            const year = Number(yearStr);
            const month = Number(monthStr);
            const day = Number(dayStr);

            const response = await fetch(`https://feriados-cl.netlify.app/api/holidays/${year}`);
            if (!response.ok) {
                console.error("No se pudo obtener la lista de feriados de la API");
                return false; 
            }
            const data = await response.json();
            
            // La API devuelve: { year: 2026, feriados: { enero: [{mes: 1, dia: 1}], ... } }
            if (data && data.feriados) {
                // Aplanamos todos los arreglos de cada mes en uno solo
                const todosLosFeriados: any[] = Object.values(data.feriados).flat();
                
                const esFeriado = todosLosFeriados.some(f => f.mes === month && f.dia === day);
                return esFeriado;
            }
            return false;
        } catch (error) {
            console.error("Error consultando API de feriados:", error);
            // Si la API falla, asumimos que no es feriado para no bloquear la app
            return false;
        }
    }
};
