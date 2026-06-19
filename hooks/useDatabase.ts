import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { runFullSync, syncPush } from '../services/ServicioSincronizacion';
import * as Crypto from 'expo-crypto';
import { validarRUT } from '../utils/validadorRut';

export interface Cita {
    id: string;
    profesional: string;
    tipoCita: string; 
    fecha: string; 
    hora: string; 
    establecimiento: string;
    tipoAtencion: string; 
    estado: string; 
    sync_status?: string;
    updated_at?: string;
}

export interface FichaAdultoMayor {
    id: string;
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
    sync_status?: string;
    updated_at?: string;
}

export interface HistorialFicha {
    id: string;
    ficha_id: string;
    fecha: string;
    hora: string;
    usuario: string;
    tratamiento: string;
    comentarios: string;
    accion: string;
    cambios?: string; 
    sync_status?: string;
    updated_at?: string;
}

export interface Medicamento {
    id: string;
    ficha_id: string;
    nombreComercial: string;
    principioActivo: string;
    viaAdministracion: string; 
    estado: string; 
    observaciones: string;
    fechaCreacion: string;
    fechaUltimaModificacion: string;
    sync_status?: string;
    updated_at?: string;
}

export interface Alimentacion {
    id: string;
    ficha_id: string;
    fecha: string;
    hora: string;
    tipoComida: string; 
    comidaDetalle: string;
    tipoDieta: string;
    observaciones: string;
    estado: string; 
    sync_status?: string;
    updated_at?: string;
}

const getIsoTime = () => new Date().toISOString();

const conectarDB = async (): Promise<SQLite.SQLiteDatabase | null> => {
    // Usamos citasMedicasDB_v2 para forzar una base de datos limpia con UUIDs
    const db = await SQLite.openDatabaseAsync('citasMedicasDB_v2');
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS cita (
            id TEXT PRIMARY KEY NOT NULL,
            profesional TEXT NOT NULL,
            tipoCita TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            establecimiento TEXT NOT NULL,
            tipoAtencion TEXT NOT NULL,
            estado TEXT NOT NULL,
            sync_status TEXT DEFAULT 'pending_insert',
            updated_at TEXT
        );
        CREATE TABLE IF NOT EXISTS ficha_adulto_mayor (
            id TEXT PRIMARY KEY NOT NULL,
            nombreCompleto TEXT NOT NULL,
            edad INTEGER NOT NULL,
            rut TEXT NOT NULL,
            condicion TEXT NOT NULL,
            enfermedadesCronicas TEXT,
            antecedentesQuirurgicos TEXT,
            alergiasConocidas TEXT,
            medicoTratante TEXT NOT NULL,
            contactosEmergencia TEXT NOT NULL,
            ultimaActualizacion TEXT NOT NULL,
            sync_status TEXT DEFAULT 'pending_insert',
            updated_at TEXT
        );
        CREATE TABLE IF NOT EXISTS historial_ficha (
            id TEXT PRIMARY KEY NOT NULL,
            ficha_id TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            usuario TEXT NOT NULL,
            tratamiento TEXT,
            comentarios TEXT,
            accion TEXT NOT NULL,
            cambios TEXT,
            sync_status TEXT DEFAULT 'pending_insert',
            updated_at TEXT
        );
        CREATE TABLE IF NOT EXISTS medicamento (
            id TEXT PRIMARY KEY NOT NULL,
            ficha_id TEXT NOT NULL,
            nombreComercial TEXT NOT NULL,
            principioActivo TEXT NOT NULL,
            viaAdministracion TEXT NOT NULL,
            estado TEXT NOT NULL,
            observaciones TEXT,
            fechaCreacion TEXT NOT NULL,
            fechaUltimaModificacion TEXT NOT NULL,
            sync_status TEXT DEFAULT 'pending_insert',
            updated_at TEXT
        );
        CREATE TABLE IF NOT EXISTS alimentacion (
            id TEXT PRIMARY KEY NOT NULL,
            ficha_id TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            tipoComida TEXT NOT NULL,
            comidaDetalle TEXT NOT NULL DEFAULT "",
            tipoDieta TEXT NOT NULL,
            observaciones TEXT,
            estado TEXT NOT NULL,
            sync_status TEXT DEFAULT 'pending_insert',
            updated_at TEXT
        );`
    );

    return db;
}

let globalDbPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;
let globalDb: SQLite.SQLiteDatabase | null = null;

const insertarDatosDePrueba = async (database: SQLite.SQLiteDatabase) => {
    try {
        const count: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM cita');
        if (count && count.count === 0) {
            const time = getIsoTime();
            await database.runAsync(
                'INSERT INTO cita (id, profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado, updated_at) VALUES (?,?,?,?,?,?,?,?,?)',
                Crypto.randomUUID(), 'El gran Profesor y Doctor Roberto Pérez ツ', 'consulta', '2026-09-18', '10:00', 'Hospital Regional', 'pública', 'pendiente', time
            );
        }

        let fichaId = '';
        const fichaCount: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM ficha_adulto_mayor');
        if (fichaCount && fichaCount.count === 0) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
            fichaId = Crypto.randomUUID();
            
            await database.runAsync(
                'INSERT INTO ficha_adulto_mayor (id, nombreCompleto, edad, rut, condicion, enfermedadesCronicas, antecedentesQuirurgicos, alergiasConocidas, medicoTratante, contactosEmergencia, ultimaActualizacion, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                fichaId, 'María Silva', 78, '5.555.555-5', 'Dependencia Leve', 'Hipertensión', 'Apendicectomía', 'Penicilina', 'Dr. Juan Pérez', 'Hijo: +56 9 1234 5678', today, getIsoTime()
            );
            
            await database.runAsync(
                'INSERT INTO historial_ficha (id, ficha_id, fecha, hora, usuario, tratamiento, comentarios, accion, cambios, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                Crypto.randomUUID(), fichaId, today, timeStr, 'Cuidador Principal', 'Losartan 50mg diario. Control en 1 mes.', 'Creación inicial de la ficha base.', 'Creación', 'Creación inicial', getIsoTime()
            );
        } else {
            const ficha: any = await database.getFirstAsync('SELECT id FROM ficha_adulto_mayor LIMIT 1');
            if (ficha) fichaId = ficha.id;
        }

        const countMeds: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM medicamento');
        if (countMeds && countMeds.count === 0 && fichaId) {
            const today = new Date().toISOString().split('T')[0];
            await database.runAsync(
                'INSERT INTO medicamento (id, ficha_id, nombreComercial, principioActivo, viaAdministracion, estado, observaciones, fechaCreacion, fechaUltimaModificacion, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                Crypto.randomUUID(), fichaId, 'Paracetamol', 'Paracetamol 500mg', 'Oral', 'Activo', 'Tomar en caso de dolor', today, today, getIsoTime()
            );
            await database.runAsync(
                'INSERT INTO medicamento (id, ficha_id, nombreComercial, principioActivo, viaAdministracion, estado, observaciones, fechaCreacion, fechaUltimaModificacion, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                Crypto.randomUUID(), fichaId, 'Ibuprofeno', 'Ibuprofeno 400mg', 'Oral', 'Terminado', 'Tratamiento completado', today, today, getIsoTime()
            );
        }

        const countAlim: any = await database.getFirstAsync('SELECT COUNT(*) as count FROM alimentacion');
        if (countAlim && countAlim.count === 0 && fichaId) {
            const today = new Date().toISOString().split('T')[0];
            await database.runAsync(
                'INSERT INTO alimentacion (id, ficha_id, fecha, hora, tipoComida, comidaDetalle, tipoDieta, observaciones, estado, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                Crypto.randomUUID(), fichaId, today, '08:30', 'Desayuno', 'Avena con leche', 'Normal', 'Comió todo sin problemas', 'Consumido', getIsoTime()
            );
            await database.runAsync(
                'INSERT INTO alimentacion (id, ficha_id, fecha, hora, tipoComida, comidaDetalle, tipoDieta, observaciones, estado, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                Crypto.randomUUID(), fichaId, today, '13:00', 'Almuerzo', 'Cazuela de ave', 'Blanda', 'Dejó la mitad de la sopa', 'Parcial', getIsoTime()
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
        if (!db) return;
        
        // Sincronizar al iniciar
        runFullSync(db).catch(console.error);

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                runFullSync(db).catch(console.error);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [db]);


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
    ): Promise<string | null> => {
        if (!db) return null;
        try {
            const id = Crypto.randomUUID();
            await db.runAsync(
                'INSERT INTO cita (id, profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado, updated_at) VALUES (?,?,?,?,?,?,?,?,?)',
                id, profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado, getIsoTime()
            );
            syncPush(db).catch(console.error);
            return id;
        } catch (err) {
            console.error("Ocurrio un error en el ingreso de cita: ", err);
            return null;
        }
    }

    const obtenerTodasLasCitas = async (): Promise<Cita[]> => {
        if (!db) return [];
        try {
            return await db.getAllAsync<Cita>('SELECT * FROM cita ORDER BY fecha DESC, hora DESC;');
        } catch (err) {
            console.error("Error al obtener todas las citas: ", err);
            return [];
        }
    }

    const obtenerCitaPorId = async (id: string): Promise<Cita | null> => {
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
        id: string,
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
                'UPDATE cita SET profesional=?, tipoCita=?, fecha=?, hora=?, establecimiento=?, tipoAtencion=?, estado=?, sync_status=?, updated_at=? WHERE id=?',
                profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado, 'pending_update', getIsoTime(), id
            );
            syncPush(db).catch(console.error);
            return true;
        } catch (err) {
            console.error("Error al actualizar cita: ", err);
            return false;
        }
    }

    const eliminarCita = async (id: string): Promise<boolean> => {
        if (!db) return false;
        try {
            await db.runAsync('DELETE FROM cita WHERE id=?', id);
            syncPush(db).catch(console.error);
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
        ficha: Omit<FichaAdultoMayor, 'id' | 'ultimaActualizacion' | 'sync_status' | 'updated_at'>,
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
            let fichaId = '';
            let cambiosDetectados = '';
            
            if (fichaActual) {
                fichaId = fichaActual.id;
                const cambios = [];
                if (fichaActual.nombreCompleto !== ficha.nombreCompleto) cambios.push(`Nombre`);
                if (fichaActual.edad.toString() !== ficha.edad.toString()) cambios.push(`Edad`);
                if (fichaActual.rut !== ficha.rut) cambios.push(`RUT`);
                if (cambios.length > 0) cambiosDetectados = `Cambios: ${cambios.join(', ')}`;
            } else {
                fichaId = Crypto.randomUUID();
                cambiosDetectados = 'Creación inicial';
            }

            await db.withTransactionAsync(async () => {
                if (fichaActual) {
                    await db.runAsync(
                        'UPDATE ficha_adulto_mayor SET nombreCompleto=?, edad=?, rut=?, condicion=?, enfermedadesCronicas=?, antecedentesQuirurgicos=?, alergiasConocidas=?, medicoTratante=?, contactosEmergencia=?, ultimaActualizacion=?, sync_status=?, updated_at=? WHERE id=?',
                        ficha.nombreCompleto ?? '', ficha.edad ?? 0, ficha.rut ?? '', ficha.condicion ?? '', ficha.enfermedadesCronicas ?? '', ficha.antecedentesQuirurgicos ?? '', ficha.alergiasConocidas ?? '', ficha.medicoTratante ?? '', ficha.contactosEmergencia ?? '', today, 'pending_update', getIsoTime(), fichaId
                    );
                } else {
                    await db.runAsync(
                        'INSERT INTO ficha_adulto_mayor (id, nombreCompleto, edad, rut, condicion, enfermedadesCronicas, antecedentesQuirurgicos, alergiasConocidas, medicoTratante, contactosEmergencia, ultimaActualizacion, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                        fichaId, ficha.nombreCompleto ?? '', ficha.edad ?? 0, ficha.rut ?? '', ficha.condicion ?? '', ficha.enfermedadesCronicas ?? '', ficha.antecedentesQuirurgicos ?? '', ficha.alergiasConocidas ?? '', ficha.medicoTratante ?? '', ficha.contactosEmergencia ?? '', today, getIsoTime()
                    );
                }

                await db.runAsync(
                    'INSERT INTO historial_ficha (id, ficha_id, fecha, hora, usuario, tratamiento, comentarios, accion, cambios, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    Crypto.randomUUID(), fichaId, today, time, usuario ?? '', tratamiento ?? '', comentarios ?? '', accion ?? '', cambiosDetectados, getIsoTime()
                );
            });

            syncPush(db).catch(console.error);
            return true;
        } catch (err) {
            console.error("Error al guardar ficha: ", err);
            return false;
        }
    }

    const obtenerHistorialFicha = async (fichaId: string): Promise<HistorialFicha[]> => {
        if (!db) return [];
        try {
            return await db.getAllAsync<HistorialFicha>('SELECT * FROM historial_ficha WHERE ficha_id=? ORDER BY date(fecha) DESC, time(hora) DESC', fichaId);
        } catch (err) {
            console.error("Error al obtener historial: ", err);
            return [];
        }
    }

    const obtenerMedicamentos = async (estadoFiltro?: string): Promise<Medicamento[]> => {
        if (!db) return [];
        try {
            if (estadoFiltro && estadoFiltro !== 'Todos') {
                return await db.getAllAsync<Medicamento>('SELECT * FROM medicamento WHERE estado=? ORDER BY fechaCreacion DESC', estadoFiltro);
            }
            return await db.getAllAsync<Medicamento>('SELECT * FROM medicamento ORDER BY fechaCreacion DESC');
        } catch (err) {
            console.error("Error al obtener medicamentos: ", err);
            return [];
        }
    }

    const obtenerMedicamentoPorId = async (id: string): Promise<Medicamento | null> => {
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
        medicamento: Omit<Medicamento, 'id' | 'fechaCreacion' | 'fechaUltimaModificacion' | 'sync_status' | 'updated_at'>,
        id?: string
    ): Promise<boolean> => {
        if (!db) return false;
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Si no pasaron ficha_id, intentamos buscar la primera ficha
            let fichaIdToUse = medicamento.ficha_id;
            if (!fichaIdToUse || fichaIdToUse === '1') {
                const f = await obtenerFicha();
                if (f) fichaIdToUse = f.id;
                else return false;
            }

            if (id) {
                const existente = await obtenerMedicamentoPorId(id);
                if (existente && existente.estado === 'Terminado') {
                    console.error("No se puede editar un medicamento Terminado");
                    return false;
                }

                await db.runAsync(
                    'UPDATE medicamento SET nombreComercial=?, principioActivo=?, viaAdministracion=?, estado=?, observaciones=?, fechaUltimaModificacion=?, sync_status=?, updated_at=? WHERE id=?',
                    medicamento.nombreComercial ?? '', medicamento.principioActivo ?? '', medicamento.viaAdministracion ?? '', medicamento.estado ?? '', medicamento.observaciones ?? '', today, 'pending_update', getIsoTime(), id
                );
            } else {
                await db.runAsync(
                    'INSERT INTO medicamento (id, ficha_id, nombreComercial, principioActivo, viaAdministracion, estado, observaciones, fechaCreacion, fechaUltimaModificacion, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    Crypto.randomUUID(), fichaIdToUse, medicamento.nombreComercial ?? '', medicamento.principioActivo ?? '', medicamento.viaAdministracion ?? '', medicamento.estado ?? '', medicamento.observaciones ?? '', today, today, getIsoTime()
                );
            }
            syncPush(db).catch(console.error);
            return true;
        } catch (err) {
            console.error("Error al guardar medicamento: ", err);
            return false;
        }
    }

    const eliminarMedicamento = async (id: string): Promise<boolean> => {
        if (!db) return false;
        try {
            const existente = await obtenerMedicamentoPorId(id);
            if (existente && existente.estado === 'Terminado') {
                return false;
            }
            await db.runAsync('DELETE FROM medicamento WHERE id=?', id);
            syncPush(db).catch(console.error);
            return true;
        } catch (err) {
            console.error("Error eliminando medicamento: ", err);
            return false;
        }
    }

    const obtenerAlimentaciones = async (filtroEstado?: string, filtroTipoComida?: string): Promise<Alimentacion[]> => {
        if (!db) return [];
        try {
            let query = 'SELECT * FROM alimentacion WHERE 1=1';
            const params: any[] = [];
            
            if (filtroEstado && filtroEstado !== 'Todos') {
                query += ' AND estado = ?';
                params.push(filtroEstado);
            }
            if (filtroTipoComida && filtroTipoComida !== 'Todas') {
                query += ' AND tipoComida = ?';
                params.push(filtroTipoComida);
            }
            
            query += ' ORDER BY fecha DESC, hora DESC';
            return await db.getAllAsync<Alimentacion>(query, ...params);
        } catch (err) {
            console.error("Error al obtener alimentacion: ", err);
            return [];
        }
    }

    const obtenerAlimentacionPorId = async (id: string): Promise<Alimentacion | null> => {
        if (!db) return null;
        try {
            const result = await db.getFirstAsync<Alimentacion>('SELECT * FROM alimentacion WHERE id=?', id);
            return result || null;
        } catch (err) {
            console.error("Error al obtener alimentacion por id: ", err);
            return null;
        }
    }

    const guardarAlimentacion = async (
        alimentacion: Omit<Alimentacion, 'id' | 'sync_status' | 'updated_at'>,
        id?: string
    ): Promise<boolean> => {
        if (!db) return false;
        try {
            let fichaIdToUse = alimentacion.ficha_id;
            if (!fichaIdToUse || fichaIdToUse === '1') {
                const f = await obtenerFicha();
                if (f) fichaIdToUse = f.id;
                else return false;
            }

            if (id) {
                await db.runAsync(
                    'UPDATE alimentacion SET fecha=?, hora=?, tipoComida=?, comidaDetalle=?, tipoDieta=?, observaciones=?, estado=?, sync_status=?, updated_at=? WHERE id=?',
                    alimentacion.fecha ?? '', alimentacion.hora ?? '', alimentacion.tipoComida ?? '', alimentacion.comidaDetalle ?? '', alimentacion.tipoDieta ?? '', alimentacion.observaciones ?? '', alimentacion.estado ?? '', 'pending_update', getIsoTime(), id
                );
            } else {
                await db.runAsync(
                    'INSERT INTO alimentacion (id, ficha_id, fecha, hora, tipoComida, comidaDetalle, tipoDieta, observaciones, estado, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    Crypto.randomUUID(), fichaIdToUse, alimentacion.fecha ?? '', alimentacion.hora ?? '', alimentacion.tipoComida ?? '', alimentacion.comidaDetalle ?? '', alimentacion.tipoDieta ?? '', alimentacion.observaciones ?? '', alimentacion.estado ?? '', getIsoTime()
                );
            }
            syncPush(db).catch(console.error);
            return true;
        } catch (err) {
            console.error("Error al guardar alimentacion: ", err);
            return false;
        }
    }

    const eliminarAlimentacion = async (id: string): Promise<boolean> => {
        if (!db) return false;
        try {
            await db.runAsync('DELETE FROM alimentacion WHERE id=?', id);
            syncPush(db).catch(console.error);
            return true;
        } catch (err) {
            console.error("Error eliminando alimentacion: ", err);
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
        eliminarMedicamento,
        obtenerAlimentaciones,
        obtenerAlimentacionPorId,
        guardarAlimentacion,
        eliminarAlimentacion
    };
}