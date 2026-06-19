import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, Alimentacion } from '../../hooks/useDatabase';
import ComponenteItemAlimentacion from '../../components/ComponenteItemAlimentacion';
import ComponenteFiltroAlimentacion from '../../components/ComponenteFiltroAlimentacion';

export default function PantallaListaAlimentacion() {
    const { db, obtenerAlimentaciones, eliminarAlimentacion } = useDatabase();
    const [alimentaciones, setAlimentaciones] = useState<Alimentacion[]>([]);
    
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroTipo, setFiltroTipo] = useState('Todas');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    
    const router = useRouter();

    const cargarDatos = async () => {
        if (!db) return;
        let data = await obtenerAlimentaciones(filtroEstado, filtroTipo);
        
        // Frontend filtering for dates
        if (fechaInicio) {
            data = data.filter(item => item.fecha >= fechaInicio);
        }
        if (fechaFin) {
            data = data.filter(item => item.fecha <= fechaFin);
        }
        
        setAlimentaciones(data);
    };

    useFocusEffect(
        useCallback(() => {
            cargarDatos();
        }, [db, filtroEstado, filtroTipo, fechaInicio, fechaFin])
    );

    const handleEliminar = async (id: string) => {
        await eliminarAlimentacion(id);
        cargarDatos();
    };

    const handleFiltrar = (estado: string, tipo: string, fInicio: string, fFin: string) => {
        setFiltroEstado(estado);
        setFiltroTipo(tipo);
        setFechaInicio(fInicio);
        setFechaFin(fFin);
    };

    return (
        <View style={styles.container}>
            <ComponenteFiltroAlimentacion onFiltrar={handleFiltrar} />

            <FlatList
                data={alimentaciones}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ComponenteItemAlimentacion
                        alimentacion={item}
                        onEdit={(id) => router.push(`/formulario-alimentacion?id=${id}`)}
                        onDelete={handleEliminar}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay registros de alimentación con estos filtros.</Text>}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/formulario-alimentacion')}
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
