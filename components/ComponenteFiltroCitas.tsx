import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    onFilter: (fechaInicio: string, fechaFin: string, estado: string) => void;
}

export default function ComponenteFiltroCitas({ onFilter }: Props) {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [estado, setEstado] = useState('todos');

    const aplicarFiltro = () => {
        onFilter(fechaInicio, fechaFin, estado);
    };

    const limpiarFiltro = () => {
        setFechaInicio('');
        setFechaFin('');
        setEstado('todos');
        onFilter('', '', 'todos');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filtros</Text>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Desde YYYY-MM-DD"
                    value={fechaInicio}
                    onChangeText={setFechaInicio}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hasta YYYY-MM-DD"
                    value={fechaFin}
                    onChangeText={setFechaFin}
                />
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.chip, estado === 'todos' && styles.chipActive]}
                    onPress={() => setEstado('todos')}
                >
                    <Text style={estado === 'todos' ? styles.chipTextActive : styles.chipText}>Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chip, estado === 'pendiente' && styles.chipActive]}
                    onPress={() => setEstado('pendiente')}
                >
                    <Text style={estado === 'pendiente' ? styles.chipTextActive : styles.chipText}>Pendientes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chip, estado === 'realizada' && styles.chipActive]}
                    onPress={() => setEstado('realizada')}
                >
                    <Text style={estado === 'realizada' ? styles.chipTextActive : styles.chipText}>Realizadas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chip, estado === 'cancelada' && styles.chipActive]}
                    onPress={() => setEstado('cancelada')}
                >
                    <Text style={estado === 'cancelada' ? styles.chipTextActive : styles.chipText}>Canceladas</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.rowActions}>
                <TouchableOpacity style={styles.btnApply} onPress={aplicarFiltro}>
                    <Text style={styles.btnText}>Aplicar Filtro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnClear} onPress={limpiarFiltro}>
                    <Text style={styles.btnText}>Limpiar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 5
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#2196F3',
        backgroundColor: '#fff'
    },
    chipActive: {
        backgroundColor: '#2196F3',
    },
    chipText: {
        color: '#2196F3',
        fontSize: 12
    },
    chipTextActive: {
        color: '#fff',
        fontSize: 12
    },
    rowActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10
    },
    btnApply: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 4
    },
    btnClear: {
        backgroundColor: '#757575',
        padding: 8,
        borderRadius: 4
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
