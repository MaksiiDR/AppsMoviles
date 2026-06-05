import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, Medicamento } from '../../hooks/useDatabase';
import ComponenteItemMedicamento from '../../components/ComponenteItemMedicamento';
import ComponenteFiltroEstado from '../../components/ComponenteFiltroEstado';
import { theme } from '../../constants/theme';

export default function PantallaListaMedicamentos() {
    const { db, obtenerMedicamentos, eliminarMedicamento } = useDatabase();
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [filtro, setFiltro] = useState('Todos');
    const router = useRouter();

    const cargarDatos = useCallback(async () => {
        if (!db) {
            return;
        }

        const data = await obtenerMedicamentos(filtro);
        setMedicamentos(data);
    }, [db, filtro, obtenerMedicamentos]);

    useFocusEffect(
        useCallback(() => {
            void cargarDatos();
        }, [cargarDatos])
    );

    const handleEliminar = async (id: number) => {
        await eliminarMedicamento(id);
        void cargarDatos();
    };

    return (
        <View style={styles.container}>
            <ComponenteFiltroEstado filtroActual={filtro} onFiltrar={setFiltro} />

            <FlatList
                data={medicamentos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ComponenteItemMedicamento
                        medicamento={item}
                        onEdit={(id) => router.push(`/formulario-medicamento?id=${id}`)}
                        onDelete={handleEliminar}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay medicamentos registrados en este estado.</Text>}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/formulario-medicamento')}
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
        marginTop: 40,
        color: theme.colors.textMuted,
        fontFamily: theme.typography.body,
        fontSize: 16
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabText: {
        color: '#fff',
        fontFamily: theme.typography.bodyBold,
        fontSize: 32,
        lineHeight: 36
    }
});
