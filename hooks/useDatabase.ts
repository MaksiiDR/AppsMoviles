import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { validarRUT } from '../utils/validadorRut';

export interface Cita {
    id: number;
    profesional: string;
    tipoCita: string; // toma de examen, cirugía, consulta
    fecha: string; // YYYY-MM-DD
    hora: string; // HH:MM
    establecimiento: string;
    tipoAtencion: string; // pública, privada/particular
    estado: string; // pendiente, realizada, cancelada
}

export interface FichaAdultoMayor {
    id: number;
    nombreCompleto: string;
    edad: number;
    rut: string;
    condicion: string;
    enfermedadesCronicas: string;
    antecedentesQuirurgicos: string;
    alergiasConocidas: string;
    medicoTratante: string;
    contactosEmergencia: string;
    ultimaActualizacion: string;
}

export interface HistorialFicha {
    id: number;
    ficha_id: number;
    fecha: string;
    hora: string;
    usuario: string;
    tratamiento: string;
    comentarios: string;
    accion: string;
    cambios?: string; // Campos modificados
}

export interface Medicamento {
    id: number;
    ficha_id: number;
    nombreComercial: string;
    principioActivo: string;
    viaAdministracion: string; // Oral, Subcutánea, Tópica, Inhalada, Otra
    estado: string; // Activo, Suspendido, Terminado
    observaciones: string;
    fechaCreacion: string;
    fechaUltimaModificacion: string;
}

const inicializarEsquema = async (db: SQLite.SQLiteDatabase): Promise<void> => {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS cita (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            profesional TEXT NOT NULL,
            tipoCita TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            establecimiento TEXT NOT NULL,
            tipoAtencion TEXT NOT NULL,
            estado TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS ficha_adulto_mayor (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            nombreCompleto TEXT NOT NULL,
            edad INTEGER NOT NULL,
            rut TEXT NOT NULL,
            condicion TEXT NOT NULL,
            enfermedadesCronicas TEXT,
            antecedentesQuirurgicos TEXT,
            alergiasConocidas TEXT,
            medicoTratante TEXT NOT NULL,
            contactosEmergencia TEXT NOT NULL,
            ultimaActualizacion TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS historial_ficha (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            ficha_id INTEGER NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            usuario TEXT NOT NULL,
            tratamiento TEXT,
            comentarios TEXT,
            accion TEXT NOT NULL,
            cambios TEXT
        );
        CREATE TABLE IF NOT EXISTS medicamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            ficha_id INTEGER NOT NULL DEFAULT 1,
            nombreComercial TEXT NOT NULL,
            principioActivo TEXT NOT NULL,
            viaAdministracion TEXT NOT NULL,
            estado TEXT NOT NULL,
            observaciones TEXT,
            fechaCreacion TEXT NOT NULL,
            fechaUltimaModificacion TEXT NOT NULL
        );`
    );

    const tableInfo: any[] = await db.getAllAsync('PRAGMA table_info(historial_ficha)');
    const hasCambios = tableInfo.some(col => col.name === 'cambios');
    if (!hasCambios) {
        await db.execAsync('ALTER TABLE historial_ficha ADD COLUMN cambios TEXT;');
    }
};

const abrirConEsquema = async (databaseName: string): Promise<SQLite.SQLiteDatabase> => {
    const db = await SQLite.openDatabaseAsync(databaseName);
    await inicializarEsquema(db);
    return db;
};

const conectarDB = async (): Promise<SQLite.SQLiteDatabase | null> => {
    try {
        return await abrirConEsquema('citasMedicasDB');
    } catch (primaryError) {
        if (Platform.OS === 'web') {
            console.warn('SQLite persistente no disponible en web. Usando base en memoria como fallback.');
            try {
                return await abrirConEsquema(':memory:');
            } catch (memoryError) {
                console.error('Fallo tambien la base en memoria:', memoryError);
                throw memoryError;
            }
        }

        throw primaryError;
    }
};

let globalDbPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;
let globalDb: SQLite.SQLiteDatabase | null = null;

const insertarDatosDePrueba = async (database: SQLite.SQLiteDatabase) => {
    // Solo inserta si está vacía
    try {
        const count: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM cita');
        if (count && count.count === 0) {
            await database.runAsync(
                'INSERT INTO cita (profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado) VALUES (?,?,?,?,?,?,?)',
                'El gran Profesor y Doctor Roberto Pérez ツ', 'consulta', '2026-09-18', '10:00', 'Hospital Regional', 'pública', 'pendiente'
            );
        }

        const countFicha: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM ficha_adulto_mayor');
        if (countFicha && countFicha.count === 0) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0].substring(0, 5);
            
            await database.runAsync(
                'INSERT INTO ficha_adulto_mayor (nombreCompleto, edad, rut, condicion, enfermedadesCronicas, antecedentesQuirurgicos, alergiasConocidas, medicoTratante, contactosEmergencia, ultimaActualizacion) VALUES (?,?,?,?,?,?,?,?,?,?)',
                'María Silva', 78, '5.555.555-5', 'Dependencia Leve', 'Hipertensión', 'Apendicectomía', 'Penicilina', 'Dr. Juan Pérez', 'Hijo: +56 9 1234 5678', today
            );
            
            await database.runAsync(
                'INSERT INTO historial_ficha (ficha_id, fecha, hora, usuario, tratamiento, comentarios, accion, cambios) VALUES (?,?,?,?,?,?,?,?)',
                1, today, time, 'Cuidador Principal', 'Losartan 50mg diario. Control en 1 mes.', 'Creación inicial de la ficha base.', 'Creación', 'Creación inicial'
            );
        }

        const countMeds: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM medicamento');
        if (countMeds && countMeds.count === 0) {
            const today = new Date().toISOString().split('T')[0];
            await database.runAsync(
                'INSERT INTO medicamento (ficha_id, nombreComercial, principioActivo, viaAdministracion, estado, observaciones, fechaCreacion, fechaUltimaModificacion) VALUES (?,?,?,?,?,?,?,?)',
                1, 'Paracetamol', 'Paracetamol 500mg', 'Oral', 'Activo', 'Tomar en caso de dolor', today, today
            );
            await database.runAsync(
                'INSERT INTO medicamento (ficha_id, nombreComercial, principioActivo, viaAdministracion, estado, observaciones, fechaCreacion, fechaUltimaModificacion) VALUES (?,?,?,?,?,?,?,?)',
                1, 'Ibuprofeno', 'Ibuprofeno 400mg', 'Oral', 'Terminado', 'Tratamiento completado', today, today
            );
        }
    } catch (e) {
        console.error("Error insertando datos de prueba: ", e);
    }
}

export function useDatabase() {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(globalDb);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (globalDb) {
            setDb(globalDb);
            return;
        }

        if (!globalDbPromise) {
            globalDbPromise = (async () => {
                try {
                    const database = await conectarDB();
                    if (database) {
                        await insertarDatosDePrueba(database);
                        globalDb = database;
                        return database;
                    }
                } catch (err) {
                    console.error("Fallo la conexion a la BD: ", err);
                    throw err;
                }
                return null;
            })();
        }

        globalDbPromise
            .then((database) => {
                if (database) {
                    setDb(database);
                    setError(null);
                }
            })
            .catch((err) => {
                setError(err as Error);
            });
    }, []);

    const crearCita = async (
        profesional: string,
        tipoCita: string,
        fecha: string,
        hora: string,
        establecimiento: string,
        tipoAtencion: string,
        estado: string
    ): Promise<number | null> => {
        if (!db) return null;
        try {
            const result = await db.runAsync(
                'INSERT INTO cita (profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado) VALUES (?,?,?,?,?,?,?)',
                profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado
            );
            return result.lastInsertRowId;
        } catch (err) {
            console.error("Ocurrio un error en el ingreso de cita: ", err);
            return null;
        }
    }

    const obtenerTodasLasCitas = async (): Promise<Cita[]> => {
        if (!db) return [];
        try {
            const result = await db.getAllAsync<Cita>('SELECT * FROM cita ORDER BY fecha DESC, hora DESC;');
            return result;
        } catch (err) {
            console.error("Error al obtener todas las citas: ", err);
            return [];
        }
    }

    const obtenerCitaPorId = async (id: number): Promise<Cita | null> => {
        if (!db) return null;
        try {
            const result = await db.getFirstAsync<Cita>('SELECT * FROM cita WHERE id=?', id);
            return result || null;
        } catch (err) {
            console.error("Error al obtener cita: ", err);
            return null;
        }
    }

    const actualizarCita = async (
        id: number,
        profesional: string,
        tipoCita: string,
        fecha: string,
        hora: string,
        establecimiento: string,
        tipoAtencion: string,
        estado: string
    ): Promise<boolean> => {
        if (!db) return false;
        try {
            await db.runAsync(
                'UPDATE cita SET profesional=?, tipoCita=?, fecha=?, hora=?, establecimiento=?, tipoAtencion=?, estado=? WHERE id=?',
                profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado, id
            );
            return true;
        } catch (err) {
            console.error("Error al actualizar cita: ", err);
            return false;
        }
    }

    const eliminarCita = async (id: number): Promise<boolean> => {
        if (!db) return false;
        try {
            await db.runAsync('DELETE FROM cita WHERE id=?', id);
            return true;
        } catch (err) {
            console.error("Error eliminando cita: ", err);
            return false;
        }
    }

    const obtenerFicha = async (): Promise<FichaAdultoMayor | null> => {
        if (!db) return null;
        try {
            const result = await db.getFirstAsync<FichaAdultoMayor>('SELECT * FROM ficha_adulto_mayor LIMIT 1');
            return result || null;
        } catch (err) {
            console.error("Error al obtener ficha: ", err);
            return null;
        }
    }

    const guardarFicha = async (
        ficha: Omit<FichaAdultoMayor, 'id' | 'ultimaActualizacion'>,
        usuario: string,
        tratamiento: string,
        comentarios: string,
        accion: string
    ): Promise<boolean> => {
        if (!db) return false;

        if (!validarRUT(ficha.rut)) {
            console.error("RUT inválido en el backend");
            return false;
        }

        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0].substring(0, 5);
            
            const fichaActual = await obtenerFicha();
            let fichaId = 1;
            let cambiosDetectados = '';
            
            if (fichaActual) {
                fichaId = fichaActual.id;
                
                const cambios = [];
                if (fichaActual.nombreCompleto !== ficha.nombreCompleto) cambios.push(`Nombre ("${fichaActual.nombreCompleto}" -> "${ficha.nombreCompleto}")`);
                if (fichaActual.edad.toString() !== ficha.edad.toString()) cambios.push(`Edad (${fichaActual.edad} -> ${ficha.edad})`);
                if (fichaActual.rut !== ficha.rut) cambios.push(`RUT ("${fichaActual.rut}" -> "${ficha.rut}")`);
                if (fichaActual.condicion !== ficha.condicion) cambios.push(`Condición ("${fichaActual.condicion}" -> "${ficha.condicion}")`);
                if (fichaActual.enfermedadesCronicas !== ficha.enfermedadesCronicas) cambios.push(`Enfermedades ("${fichaActual.enfermedadesCronicas || 'Ninguna'}" -> "${ficha.enfermedadesCronicas || 'Ninguna'}")`);
                if (fichaActual.antecedentesQuirurgicos !== ficha.antecedentesQuirurgicos) cambios.push(`Antecedentes ("${fichaActual.antecedentesQuirurgicos || 'Ninguno'}" -> "${ficha.antecedentesQuirurgicos || 'Ninguno'}")`);
                if (fichaActual.alergiasConocidas !== ficha.alergiasConocidas) cambios.push(`Alergias ("${fichaActual.alergiasConocidas || 'Ninguna'}" -> "${ficha.alergiasConocidas || 'Ninguna'}")`);
                if (fichaActual.medicoTratante !== ficha.medicoTratante) cambios.push(`Médico ("${fichaActual.medicoTratante}" -> "${ficha.medicoTratante}")`);
                if (fichaActual.contactosEmergencia !== ficha.contactosEmergencia) cambios.push(`Contactos ("${fichaActual.contactosEmergencia}" -> "${ficha.contactosEmergencia}")`);

                if (cambios.length > 0) {
                    cambiosDetectados = `Cambios:\n• ${cambios.join('\n• ')}`;
                }
            } else {
                cambiosDetectados = 'Creación inicial';
            }

            await db.withTransactionAsync(async () => {
                if (fichaActual) {
                    await db.runAsync(
                        'UPDATE ficha_adulto_mayor SET nombreCompleto=?, edad=?, rut=?, condicion=?, enfermedadesCronicas=?, antecedentesQuirurgicos=?, alergiasConocidas=?, medicoTratante=?, contactosEmergencia=?, ultimaActualizacion=? WHERE id=?',
                        ficha.nombreCompleto ?? '', ficha.edad ?? 0, ficha.rut ?? '', ficha.condicion ?? '', ficha.enfermedadesCronicas ?? '', ficha.antecedentesQuirurgicos ?? '', ficha.alergiasConocidas ?? '', ficha.medicoTratante ?? '', ficha.contactosEmergencia ?? '', today, fichaId
                    );
                } else {
                    const result = await db.runAsync(
                        'INSERT INTO ficha_adulto_mayor (nombreCompleto, edad, rut, condicion, enfermedadesCronicas, antecedentesQuirurgicos, alergiasConocidas, medicoTratante, contactosEmergencia, ultimaActualizacion) VALUES (?,?,?,?,?,?,?,?,?,?)',
                        ficha.nombreCompleto ?? '', ficha.edad ?? 0, ficha.rut ?? '', ficha.condicion ?? '', ficha.enfermedadesCronicas ?? '', ficha.antecedentesQuirurgicos ?? '', ficha.alergiasConocidas ?? '', ficha.medicoTratante ?? '', ficha.contactosEmergencia ?? '', today
                    );
                    fichaId = result.lastInsertRowId;
                }

                await db.runAsync(
                    'INSERT INTO historial_ficha (ficha_id, fecha, hora, usuario, tratamiento, comentarios, accion, cambios) VALUES (?,?,?,?,?,?,?,?)',
                    fichaId, today, time, usuario ?? '', tratamiento ?? '', comentarios ?? '', accion ?? '', cambiosDetectados
                );
            });

            return true;
        } catch (err) {
            console.error("Error al guardar ficha: ", err);
            return false;
        }
    }

    const obtenerHistorialFicha = async (fichaId: number): Promise<HistorialFicha[]> => {
        if (!db) return [];
        try {
            const result = await db.getAllAsync<HistorialFicha>('SELECT * FROM historial_ficha WHERE ficha_id=? ORDER BY id DESC', fichaId);
            return result;
        } catch (err) {
            console.error("Error al obtener historial: ", err);
            return [];
        }
    }

    const obtenerMedicamentos = async (estadoFiltro?: string): Promise<Medicamento[]> => {
        if (!db) return [];
        try {
            if (estadoFiltro && estadoFiltro !== 'Todos') {
                return await db.getAllAsync<Medicamento>('SELECT * FROM medicamento WHERE estado=? ORDER BY id DESC', estadoFiltro);
            }
            return await db.getAllAsync<Medicamento>('SELECT * FROM medicamento ORDER BY id DESC');
        } catch (err) {
            console.error("Error al obtener medicamentos: ", err);
            return [];
        }
    }

    const obtenerMedicamentoPorId = async (id: number): Promise<Medicamento | null> => {
        if (!db) return null;
        try {
            const result = await db.getFirstAsync<Medicamento>('SELECT * FROM medicamento WHERE id=?', id);
            return result || null;
        } catch (err) {
            console.error("Error al obtener medicamento: ", err);
            return null;
        }
    }

    const guardarMedicamento = async (
        medicamento: Omit<Medicamento, 'id' | 'fechaCreacion' | 'fechaUltimaModificacion'>,
        id?: number
    ): Promise<boolean> => {
        if (!db) return false;
        try {
            const today = new Date().toISOString().split('T')[0];

            if (id) {
                // Verificar que no esté Terminado
                const existente = await obtenerMedicamentoPorId(id);
                if (existente && existente.estado === 'Terminado') {
                    console.error("No se puede editar un medicamento Terminado");
                    return false;
                }

                await db.runAsync(
                    'UPDATE medicamento SET nombreComercial=?, principioActivo=?, viaAdministracion=?, estado=?, observaciones=?, fechaUltimaModificacion=? WHERE id=?',
                    medicamento.nombreComercial ?? '', medicamento.principioActivo ?? '', medicamento.viaAdministracion ?? '', medicamento.estado ?? '', medicamento.observaciones ?? '', today, id
                );
            } else {
                await db.runAsync(
                    'INSERT INTO medicamento (ficha_id, nombreComercial, principioActivo, viaAdministracion, estado, observaciones, fechaCreacion, fechaUltimaModificacion) VALUES (?,?,?,?,?,?,?,?)',
                    medicamento.ficha_id || 1, medicamento.nombreComercial ?? '', medicamento.principioActivo ?? '', medicamento.viaAdministracion ?? '', medicamento.estado ?? '', medicamento.observaciones ?? '', today, today
                );
            }
            return true;
        } catch (err) {
            console.error("Error al guardar medicamento: ", err);
            return false;
        }
    }

    const eliminarMedicamento = async (id: number): Promise<boolean> => {
        if (!db) return false;
        try {
            const existente = await obtenerMedicamentoPorId(id);
            if (existente && existente.estado === 'Terminado') {
                console.error("No se puede eliminar un medicamento Terminado");
                return false;
            }
            await db.runAsync('DELETE FROM medicamento WHERE id=?', id);
            return true;
        } catch (err) {
            console.error("Error eliminando medicamento: ", err);
            return false;
        }
    }

    return {
        db,
        error,
        crearCita,
        obtenerTodasLasCitas,
        obtenerCitaPorId,
        actualizarCita,
        eliminarCita,
        obtenerFicha,
        guardarFicha,
        obtenerHistorialFicha,
        obtenerMedicamentos,
        obtenerMedicamentoPorId,
        guardarMedicamento,
        eliminarMedicamento
    };
}