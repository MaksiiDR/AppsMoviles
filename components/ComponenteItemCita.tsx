import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cita } from '../hooks/useDatabase';
import { theme } from '../constants/theme';

interface Props {
    cita: Cita;
    onEdit?: (cita: Cita) => void;
    onDelete?: (id: number) => void;
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
        backgroundColor: theme.colors.surface,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        elevation: 2
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    title: {
        fontFamily: theme.typography.displayMedium,
        fontSize: 16,
        color: theme.colors.text,
    },
    status: {
        fontFamily: theme.typography.bodyBold,
    },
    info: {
        fontFamily: theme.typography.body,
        fontSize: 14,
        marginBottom: 4,
        color: theme.colors.text
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
        backgroundColor: theme.colors.primary,
    },
    btnDelete: {
        backgroundColor: theme.colors.danger,
    },
    btnText: {
        color: '#fff',
        fontFamily: theme.typography.bodyBold,
    }
});
