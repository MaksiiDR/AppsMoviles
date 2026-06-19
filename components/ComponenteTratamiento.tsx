import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HistorialFicha } from '../hooks/useDatabase';

interface Props {
    historial: HistorialFicha;
}

export default function ComponenteTratamiento({ historial }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.date}>{historial.fecha} - {historial.hora}</Text>
                <Text style={styles.action}>{historial.accion}</Text>
            </View>
            <Text style={styles.user}>Por: {historial.usuario}</Text>
            
            {historial.cambios ? (
                <View style={styles.section}>
                    <Text style={styles.label}>Cambios Realizados:</Text>
                    <Text style={styles.text}>{historial.cambios}</Text>
                </View>
            ) : null}

            {historial.tratamiento ? (
                <View style={styles.section}>
                    <Text style={styles.label}>Tratamiento Recetado:</Text>
                    <Text style={styles.text}>{historial.tratamiento}</Text>
                </View>
            ) : null}

            {historial.comentarios ? (
                <View style={styles.section}>
                    <Text style={styles.label}>Comentarios de la visita:</Text>
                    <Text style={styles.text}>{historial.comentarios}</Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FAFAFA',
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    date: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 13,
        color: '#666',
        fontWeight: 'bold'
    },
    action: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 12,
        backgroundColor: '#E8EAF6',
        color: '#3F51B5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden'
    },
    user: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 13,
        color: '#888',
        marginBottom: 8
    },
    section: {
        marginTop: 6,
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#EEE'
    },
    label: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 13,
        fontWeight: 'bold',
        color: '#444'
    },
    text: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 14,
        color: '#222',
        marginTop: 2
    }
});
