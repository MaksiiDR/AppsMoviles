import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ComponenteFiltroCitas from '../../components/ComponenteFiltroCitas';
import ComponenteItemCita from '../../components/ComponenteItemCita';
import { Cita, useDatabase } from '../../hooks/useDatabase';
import { theme } from '../../constants/theme';

export default function PantallaListaCitas() {
    const { db, obtenerTodasLasCitas, eliminarCita } = useDatabase();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [citasFiltradas, setCitasFiltradas] = useState<Cita[]>([]);
    const router = useRouter();

    const cargarDatos = useCallback(async () => {
        if (!db) {
            return;
        }

        const todas = await obtenerTodasLasCitas();
        setCitas(todas);
        setCitasFiltradas(todas);
    }, [db, obtenerTodasLasCitas]);

    useFocusEffect(
        useCallback(() => {
            void cargarDatos();
        }, [cargarDatos])
    );

    const handleEliminar = async (id: number) => {
        await eliminarCita(id);
        void cargarDatos();
    };

    const handleFiltrar = (fechaInicio: string, fechaFin: string, estado: string) => {
        let filtradas = [...citas];

        if (fechaInicio) {
            filtradas = filtradas.filter(c => c.fecha >= fechaInicio);
        }
        if (fechaFin) {
            filtradas = filtradas.filter(c => c.fecha <= fechaFin);
        }
        if (estado !== 'todos') {
            filtradas = filtradas.filter(c => c.estado === estado);
        }

        setCitasFiltradas(filtradas);
    };

    return (
        <View style={styles.container}>
            <ComponenteFiltroCitas onFilter={handleFiltrar} />

            <FlatList
                data={citasFiltradas}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <ComponenteItemCita
                            cita={item}
                            onDelete={handleEliminar}
                            onEdit={() => router.push(`/formulario-cita?id=${item.id}`)}
                        />

                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay citas pendientes encontradas.</Text>}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/formulario-cita')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: theme.colors.textMuted,
        fontFamily: theme.typography.body
    },
    btnRecordatorio: {
        backgroundColor: '#607D8B',
        padding: 5,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 4,
        alignItems: 'center'
    },
    btnRecordatorioText: {
        color: '#fff',
        fontSize: 12
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: theme.colors.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4
    },
    fabText: {
        color: '#fff',
        fontFamily: theme.typography.bodyBold,
        fontSize: 30,
        lineHeight: 34
    }
});
