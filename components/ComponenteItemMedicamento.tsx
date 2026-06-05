import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Medicamento } from '../hooks/useDatabase';

interface Props {
    medicamento: Medicamento;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ComponenteItemMedicamento({ medicamento, onEdit, onDelete }: Props) {
    const isTerminado = medicamento.estado === 'Terminado';

    const getEstadoColor = () => {
        switch (medicamento.estado) {
            case 'Activo': return '#4CAF50';
            case 'Suspendido': return '#FF9800';
            case 'Terminado': return '#9E9E9E';
            default: return '#757575';
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Eliminar Medicamento",
            "¿Estás seguro que deseas eliminar este medicamento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => onDelete(medicamento.id) }
            ]
        );
    };

    return (
        <View style={[styles.card, isTerminado && styles.cardTerminado]}>
            <View style={styles.header}>
                <Text style={styles.nombre}>{medicamento.nombreComercial}</Text>
                <View style={[styles.badge, { backgroundColor: getEstadoColor() }]}>
                    <Text style={styles.badgeText}>{medicamento.estado}</Text>
                </View>
            </View>

            <Text style={styles.principio}>💊 {medicamento.principioActivo}</Text>
            <Text style={styles.via}>Vía: {medicamento.viaAdministracion}</Text>

            {medicamento.observaciones ? (
                <Text style={styles.obs}>📝 {medicamento.observaciones}</Text>
            ) : null}

            {isTerminado ? (
                <Text style={styles.terminadoText}>🔒 Medicamento en historial (Solo lectura)</Text>
            ) : (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(medicamento.id)}>
                        <MaterialIcons name="edit" size={20} color="#1976D2" />
                        <Text style={styles.btnEditText}> Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
                        <MaterialIcons name="delete" size={20} color="#D32F2F" />
                        <Text style={styles.btnDeleteText}> Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3'
    },
    cardTerminado: {
        backgroundColor: '#F5F5F5',
        borderLeftColor: '#9E9E9E',
        opacity: 0.85
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    nombre: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    principio: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 15,
        color: '#555',
        marginBottom: 4,
        fontWeight: '500'
    },
    via: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 8
    },
    obs: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
        backgroundColor: '#FFFDE7',
        padding: 6,
        borderRadius: 4,
        marginBottom: 8
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10,
        marginTop: 4
    },
    btnEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        padding: 4
    },
    btnEditText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#1976D2',
        fontWeight: 'bold'
    },
    btnDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4
    },
    btnDeleteText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#D32F2F',
        fontWeight: 'bold'
    },
    terminadoText: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 12,
        color: '#757575',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#DDD'
    }
});
