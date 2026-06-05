import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props {
    filtroActual: string;
    onFiltrar: (estado: string) => void;
}

export default function ComponenteFiltroEstado({ filtroActual, onFiltrar }: Props) {
    const estados = ['Todos', 'Activo', 'Suspendido', 'Terminado'];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Filtrar por estado:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                {estados.map((estado) => (
                    <TouchableOpacity
                        key={estado}
                        style={[
                            styles.chip,
                            filtroActual === estado && styles.chipSelected
                        ]}
                        onPress={() => onFiltrar(estado)}
                    >
                        <Text style={[
                            styles.chipText,
                            filtroActual === estado && styles.chipTextSelected
                        ]}>
                            {estado}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    label: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 8,
        color: '#555'
    },
    scroll: {
        paddingHorizontal: 10
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    chipSelected: {
        backgroundColor: '#2196F3',
        borderColor: '#1976D2'
    },
    chipText: {
    fontFamily: 'SourceSans3_400Regular',
        color: '#666',
        fontWeight: '500'
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
