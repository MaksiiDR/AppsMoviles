import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    contacto: string;
}

export default function ComponenteContactoEmergencia({ contacto }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>📞 Contacto de Emergencia</Text>
            <Text style={styles.text}>{contacto || 'No registrado'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#90CAF9'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 4
    },
    text: {
        fontSize: 16,
        color: '#333'
    }
});
