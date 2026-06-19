import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const LAST_SYNC_KEY = '@CuidaMed_last_sync';

export const syncPush = async (db: SQLite.SQLiteDatabase) => {
    console.log('[Sync] Iniciando Push...');
    const tables = ['cita', 'ficha_adulto_mayor', 'historial_ficha', 'medicamento', 'alimentacion'];

    for (const table of tables) {
        try {
            const pendingRecords = await db.getAllAsync<any>(
                `SELECT * FROM ${table} WHERE sync_status IN ('pending_insert', 'pending_update')`
            );

            if (pendingRecords.length > 0) {
                console.log(`[Sync] Push de ${pendingRecords.length} registros en ${table}`);
                
                // Remover columnas locales de sync antes de enviar
                const recordsToPush = pendingRecords.map(r => {
                    const copy = { ...r };
                    delete copy.sync_status;
                    return copy;
                });

                const { error } = await supabase.from(table).upsert(recordsToPush);
                if (error) {
                    console.error(`[Sync] Error en Push ${table}:`, error);
                } else {
                    // Si el push fue exitoso, marcamos como sincronizado
                    for (const rec of pendingRecords) {
                        await db.runAsync(`UPDATE ${table} SET sync_status = 'synced' WHERE id = ?`, rec.id);
                    }
                }
            }
        } catch (err) {
            console.error(`[Sync] Excepción en Push ${table}:`, err);
        }
    }
};

export const syncPull = async (db: SQLite.SQLiteDatabase) => {
    console.log('[Sync] Iniciando Pull...');
    const tables = ['cita', 'ficha_adulto_mayor', 'historial_ficha', 'medicamento', 'alimentacion'];
    
    // Obtenemos el último pull exitoso
    const lastSyncIso = await AsyncStorage.getItem(LAST_SYNC_KEY);
    const pullTime = new Date().toISOString();

    for (const table of tables) {
        try {
            let query = supabase.from(table).select('*');
            if (lastSyncIso) {
                // Solo traer los modificados después de la última sincronización
                query = query.gt('updated_at', lastSyncIso);
            }

            const { data, error } = await query;
            
            if (error) {
                console.error(`[Sync] Error en Pull ${table}:`, error);
                continue;
            }

            if (data && data.length > 0) {
                console.log(`[Sync] Pull de ${data.length} registros en ${table}`);
                // Construir query de Upsert local (en SQLite)
                // Obtenemos los nombres de columnas del primer registro
                const cols = Object.keys(data[0]);
                
                for (const row of data) {
                    // Verificamos si existe localmente para saber si el local es más reciente (conflicto)
                    const localRow = await db.getFirstAsync<any>(`SELECT updated_at, sync_status FROM ${table} WHERE id=?`, row.id);
                    
                    if (localRow && localRow.sync_status !== 'synced') {
                        // Conflicto: el registro local fue editado y no se ha subido. 
                        // Regla simple: si el local es más nuevo, lo dejamos; si la nube es más nueva, la nube gana.
                        const localTime = new Date(localRow.updated_at).getTime();
                        const cloudTime = new Date(row.updated_at).getTime();
                        if (localTime > cloudTime) {
                            // Ignorar pull para esta fila, el próximo Push la sobrescribirá en la nube
                            continue;
                        }
                    }

                    // Insert o Reemplazar local
                    const placeHolders = cols.map(() => '?').join(',');
                    const vals = cols.map(c => row[c]);
                    
                    // Añadimos sync_status al final
                    const finalCols = [...cols, 'sync_status'].join(',');
                    const finalPlaceHolders = placeHolders + ',?';
                    const finalVals = [...vals, 'synced'];

                    await db.runAsync(
                        `INSERT OR REPLACE INTO ${table} (${finalCols}) VALUES (${finalPlaceHolders})`,
                        ...finalVals
                    );
                }
            }
        } catch (err) {
            console.error(`[Sync] Excepción en Pull ${table}:`, err);
        }
    }

    // Actualizamos el last_sync
    await AsyncStorage.setItem(LAST_SYNC_KEY, pullTime);
};

export const runFullSync = async (db: SQLite.SQLiteDatabase) => {
    // Es mejor hacer Push primero para subir los cambios locales antes de traer los de la nube
    await syncPush(db);
    await syncPull(db);
};
