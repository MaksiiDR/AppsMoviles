import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FichaAdultoMayor } from '../hooks/useDatabase';
import { theme } from '../constants/theme';

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
        backgroundColor: theme.colors.surface,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: theme.radius.md,
        borderLeftWidth: 5,
        borderLeftColor: theme.colors.secondary,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    title: {
        fontFamily: theme.typography.displayMedium,
        fontSize: 18,
        marginBottom: 10,
        color: theme.colors.text,
    },
    label: {
        fontFamily: theme.typography.bodyBold,
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 5
    },
    text: {
        fontFamily: theme.typography.body,
        fontSize: 14,
        color: theme.colors.text,
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
        color: '#C62828',
        fontFamily: theme.typography.bodyBold,
        fontSize: 13,
        textAlign: 'center'
    },
    updateText: {
        fontFamily: theme.typography.body,
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 10,
        textAlign: 'right'
    }
});
