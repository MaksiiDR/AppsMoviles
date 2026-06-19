import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, Medicamento } from '../../hooks/useDatabase';
import ComponenteItemMedicamento from '../../components/ComponenteItemMedicamento';
import ComponenteFiltroEstado from '../../components/ComponenteFiltroEstado';

export default function PantallaListaMedicamentos() {
    const { db, obtenerMedicamentos, eliminarMedicamento } = useDatabase();
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [filtro, setFiltro] = useState('Todos');
    const router = useRouter();

    const cargarDatos = async () => {
        if (!db) return;
        const data = await obtenerMedicamentos(filtro);
        setMedicamentos(data);
    };

    useFocusEffect(
        useCallback(() => {
            cargarDatos();
        }, [db, filtro])
    );

    const handleEliminar = async (id: string) => {
        await eliminarMedicamento(id);
        cargarDatos();
    };

    return (
        <View style={styles.container}>
            <ComponenteFiltroEstado filtroActual={filtro} onFiltrar={setFiltro} />

            <FlatList
                data={medicamentos}
                keyExtractor={(item) => item.id}
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
        backgroundColor: '#F5F5F5'
    },
    emptyText: {
    fontFamily: 'SourceSans3_400Regular',
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#2196F3',
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
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 36
    }
});
