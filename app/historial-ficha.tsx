import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useDatabase, HistorialFicha } from '../hooks/useDatabase';
import ComponenteTratamiento from '../components/ComponenteTratamiento';

export default function PantallaHistorialFicha() {
    const { db, obtenerFicha, obtenerHistorialFicha } = useDatabase();
    const [historial, setHistorial] = useState<HistorialFicha[]>([]);

    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                if (db) {
                    const ficha = await obtenerFicha();
                    if (ficha) {
                        const data = await obtenerHistorialFicha(ficha.id);
                        setHistorial(data);
                    }
                }
            };
            cargarDatos();
        }, [db])
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
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color: '#212121',
    },
    subtitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    emptyText: {
    fontFamily: 'SourceSans3_400Regular',
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16
    }
});
