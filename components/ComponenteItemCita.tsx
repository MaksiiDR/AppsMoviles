import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cita } from '../hooks/useDatabase';

interface Props {
    cita: Cita;
    onEdit?: (cita: Cita) => void;
    onDelete?: (id: string) => void;
    isHistorial?: boolean;
}

export default function ComponenteItemCita({ cita, onEdit, onDelete, isHistorial }: Props) {
    // Determina color según estado
    const colorEstado = cita.estado === 'pendiente' ? '#FFA500' : 
                        cita.estado === 'realizada' ? '#4CAF50' : '#F44336';

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{cita.tipoCita.toUpperCase()}</Text>
                <Text style={[styles.status, { color: colorEstado }]}>
                    {cita.estado.toUpperCase()}
                </Text>
            </View>

            <Text style={styles.info}>Profesional: {cita.profesional}</Text>
            <Text style={styles.info}>Fecha: {cita.fecha} a las {cita.hora}</Text>
            <Text style={styles.info}>Lugar: {cita.establecimiento} ({cita.tipoAtencion})</Text>

            {!isHistorial && (
                <View style={styles.actions}>
                    {onEdit && (
                        <TouchableOpacity style={[styles.btn, styles.btnEdit]} onPress={() => onEdit(cita)}>
                            <Text style={styles.btnText}>Editar</Text>
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={() => onDelete(cita.id)}>
                            <Text style={styles.btnText}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 2
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    title: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontWeight: 'bold',
        fontSize: 16,
    },
    status: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontWeight: 'bold',
    },
    info: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 14,
        marginBottom: 4,
        color: '#333'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10
    },
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    btnEdit: {
        backgroundColor: '#2196F3',
    },
    btnDelete: {
        backgroundColor: '#F44336',
    },
    btnText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#fff',
        fontWeight: 'bold'
    }
});
