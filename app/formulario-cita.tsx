import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDatabase } from '../hooks/useDatabase';
import { ServicioFeriadosChile } from '../services/ServicioFeriadosChile';

const OpcionesSeleccion = ({ opciones, valorActual, onChange }: { opciones: string[], valorActual: string, onChange: (val: string) => void }) => (
    <View style={styles.opcionesContainer}>
        {opciones.map(op => (
            <TouchableOpacity
                key={op}
                style={[styles.chip, valorActual === op && styles.chipActive]}
                onPress={() => onChange(op)}
            >
                <Text style={valorActual === op ? styles.chipTextActive : styles.chipText}>
                    {op}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default function PantallaFormularioCita() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { db, obtenerCitaPorId, crearCita, actualizarCita } = useDatabase();

    const [profesional, setProfesional] = useState('');
    const [tipoCita, setTipoCita] = useState('consulta');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [establecimiento, setEstablecimiento] = useState('');
    const [tipoAtencion, setTipoAtencion] = useState('pública');
    const [estado, setEstado] = useState('pendiente');

    const esEdicion = !!id;

    useEffect(() => {
        if (esEdicion && db) {
            obtenerCitaPorId(id as string).then(cita => {
                if (cita) {
                    setProfesional(cita.profesional);
                    setTipoCita(cita.tipoCita);
                    setFecha(cita.fecha);
                    setHora(cita.hora);
                    setEstablecimiento(cita.establecimiento);
                    setTipoAtencion(cita.tipoAtencion);
                    setEstado(cita.estado);
                }
            });
        }
    }, [id, db]);

    const validarYGuardar = async () => {
        if (!profesional || !tipoCita || !fecha || !hora || !establecimiento || !tipoAtencion || !estado) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            Alert.alert("Error", "Formato de fecha inválido. Use YYYY-MM-DD");
            return;
        }

        const ejecutarGuardado = async () => {
            let exito = false;
            if (esEdicion) {
                exito = await actualizarCita(id as string, profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado);
            } else {
                const nuevoId = await crearCita(profesional, tipoCita, fecha, hora, establecimiento, tipoAtencion, estado);
                exito = !!nuevoId;
            }

            if (exito) {
                router.back();
            } else {
                Alert.alert("Error", "Hubo un problema al guardar la cita.");
            }
        };

        const esFeriadoReal = await ServicioFeriadosChile.esFeriado(fecha);
        if (esFeriadoReal) {
            let mensajeAdvertencia = "La fecha seleccionada corresponde a un feriado en Chile.\n\n";
            
            if (tipoAtencion === 'pública') {
                mensajeAdvertencia += "⚠️ Atención pública: El establecimiento podría no estar operativo.";
            } else {
                mensajeAdvertencia += "⚠️ Atención privada: Se recomienda confirmar disponibilidad directamente con el establecimiento.";
            }

            Alert.alert(
                "Advertencia de Feriado",
                mensajeAdvertencia + "\n\n¿Desea guardar la cita de todos modos?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sí, Guardar", onPress: () => { ejecutarGuardado(); } }
                ]
            );
        } else {
            await ejecutarGuardado();
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{esEdicion ? 'Editar Cita' : 'Nueva Cita'}</Text>

            <Text style={styles.label}>Profesional</Text>
            <TextInput style={styles.input} value={profesional} onChangeText={setProfesional} placeholder="Ej. Dr. Pérez" />

            <Text style={styles.label}>Tipo de Cita</Text>
            <OpcionesSeleccion
                opciones={['consulta', 'toma de examen', 'cirugía']}
                valorActual={tipoCita}
                onChange={setTipoCita}
            />

            <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={fecha} onChangeText={setFecha} placeholder="2026-09-18" />

            <Text style={styles.label}>Hora (HH:MM)</Text>
            <TextInput style={styles.input} value={hora} onChangeText={setHora} placeholder="10:00" />

            <Text style={styles.label}>Establecimiento de Salud</Text>
            <TextInput style={styles.input} value={establecimiento} onChangeText={setEstablecimiento} />

            <Text style={styles.label}>Tipo de Atención</Text>
            <OpcionesSeleccion
                opciones={['pública', 'privada/particular']}
                valorActual={tipoAtencion}
                onChange={setTipoAtencion}
            />

            {esEdicion && (
                <>
                    <Text style={styles.label}>Estado</Text>
                    <OpcionesSeleccion
                        opciones={['pendiente', 'realizada', 'cancelada']}
                        valorActual={estado}
                        onChange={setEstado}
                    />
                </>
            )}

            <TouchableOpacity style={styles.btnSave} onPress={validarYGuardar}>
                <Text style={styles.btnSaveText}>Guardar</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5
    },
    input: {
    fontFamily: 'SourceSans3_400Regular',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4
    },
    opcionesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 5
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2196F3',
        backgroundColor: '#fff'
    },
    chipActive: {
        backgroundColor: '#2196F3',
    },
    chipText: {
    fontFamily: 'SourceSans3_400Regular',
        color: '#2196F3',
    },
    chipTextActive: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#fff',
    },
    btnSave: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    btnSaveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});
