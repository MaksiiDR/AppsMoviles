import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Alimentacion } from '../hooks/useDatabase';

interface Props {
    alimentacion: Alimentacion;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ComponenteItemAlimentacion({ alimentacion, onEdit, onDelete }: Props) {
    const getEstadoColor = () => {
        switch (alimentacion.estado) {
            case 'Consumido': return '#4CAF50';
            case 'Parcial': return '#FF9800';
            case 'No consumido': return '#D32F2F';
            default: return '#757575';
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Eliminar Registro",
            "¿Estás seguro que deseas eliminar este registro de alimentación?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => onDelete(alimentacion.id) }
            ]
        );
    };

    return (
        <View style={[styles.card, { borderLeftColor: getEstadoColor() }]}>
            <View style={styles.header}>
                <Text style={styles.nombre}>{alimentacion.tipoComida}</Text>
                <View style={[styles.badge, { backgroundColor: getEstadoColor() }]}>
                    <Text style={styles.badgeText}>{alimentacion.estado}</Text>
                </View>
            </View>

            <Text style={styles.info}>🕒 {alimentacion.fecha} - {alimentacion.hora}</Text>
            {alimentacion.comidaDetalle ? (
                <Text style={styles.info}>🍽️ Menú: {alimentacion.comidaDetalle}</Text>
            ) : null}
            <Text style={styles.info}>🥗 Dieta: {alimentacion.tipoDieta}</Text>

            {alimentacion.observaciones ? (
                <Text style={styles.obs}>📝 {alimentacion.observaciones}</Text>
            ) : null}

            <View style={styles.actions}>
                <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(alimentacion.id)}>
                    <MaterialIcons name="edit" size={20} color="#1976D2" />
                    <Text style={styles.btnEditText}> Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
                    <MaterialIcons name="delete" size={20} color="#D32F2F" />
                    <Text style={styles.btnDeleteText}> Eliminar</Text>
                </TouchableOpacity>
            </View>
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
    info: {
        fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 15,
        color: '#555',
        marginBottom: 4,
        fontWeight: '500'
    },
    obs: {
        fontFamily: 'SourceSans3_400Regular',
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
        backgroundColor: '#FFFDE7',
        padding: 6,
        borderRadius: 4,
        marginBottom: 8,
        marginTop: 4
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
    }
});
