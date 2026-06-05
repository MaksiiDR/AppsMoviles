import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FichaAdultoMayor } from '../hooks/useDatabase';

interface Props {
    ficha: FichaAdultoMayor;
}

export default function ComponenteResumenFicha({ ficha }: Props) {
    const isDesactualizada = () => {
        const fechaActual = new Date();
        const fechaFicha = new Date(ficha.ultimaActualizacion);
        const diffTime = Math.abs(fechaActual.getTime() - fechaFicha.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 90;
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Resumen: {ficha.nombreCompleto}</Text>
            {isDesactualizada() && (
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>⚠️ Ficha Desactualizada (Más de 3 meses)</Text>
                </View>
            )}
            <Text style={styles.label}>Condición Actual:</Text>
            <Text style={styles.text}>{ficha.condicion || 'No especificada'}</Text>
            
            <Text style={styles.label}>Alergias Conocidas:</Text>
            <Text style={styles.text}>{ficha.alergiasConocidas || 'Ninguna registrada'}</Text>

            <Text style={styles.updateText}>Última actualización: {ficha.ultimaActualizacion}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    title: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    label: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 5
    },
    text: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 14,
        color: '#444',
        marginBottom: 5
    },
    alertBox: {
        backgroundColor: '#FFEBEE',
        padding: 8,
        borderRadius: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EF9A9A'
    },
    alertText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#C62828',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center'
    },
    updateText: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        textAlign: 'right'
    }
});
