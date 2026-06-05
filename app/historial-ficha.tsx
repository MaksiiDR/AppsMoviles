import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useDatabase, HistorialFicha } from '../hooks/useDatabase';
import ComponenteTratamiento from '../components/ComponenteTratamiento';

export default function PantallaHistorialFicha() {
    const { db, obtenerFicha, obtenerHistorialFicha } = useDatabase();
    const [historial, setHistorial] = useState<HistorialFicha[]>([]);

    const cargarDatos = useCallback(async () => {
        if (!db) {
            return;
        }

        const ficha = await obtenerFicha();
        if (ficha) {
            const data = await obtenerHistorialFicha(ficha.id);
            setHistorial(data);
        }
    }, [db, obtenerFicha, obtenerHistorialFicha]);

    useFocusEffect(
        useCallback(() => {
            void cargarDatos();
        }, [cargarDatos])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial Médico</Text>
            <Text style={styles.subtitle}>Cambios, tratamientos y comentarios</Text>

            <FlatList
                data={historial}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ComponenteTratamiento historial={item} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay registros en el historial.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color: '#212121',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16
    }
});
