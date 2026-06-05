import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useDatabase, Cita } from '../../hooks/useDatabase';
import ComponenteItemCita from '../../components/ComponenteItemCita';
import { useFocusEffect } from 'expo-router';

export default function PantallaHistorial() {
    const { db, obtenerTodasLasCitas } = useDatabase();
    const [historial, setHistorial] = useState<Cita[]>([]);

    const cargarHistorial = useCallback(async () => {
        if (!db) {
            return;
        }

        const todas = await obtenerTodasLasCitas();
        const pasadas = todas.filter(c => c.estado !== 'pendiente');
        setHistorial(pasadas);
    }, [db, obtenerTodasLasCitas]);

    useFocusEffect(
        useCallback(() => {
            void cargarHistorial();
        }, [cargarHistorial])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Citas Pasadas</Text>
            <FlatList
                data={historial}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <ComponenteItemCita cita={item} isHistorial={true} />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay registros en el historial.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888'
    }
});
