import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
    onFilter: (fechaInicio: string, fechaFin: string, estado: string) => void;
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ComponenteFiltroCitas({ onFilter }: Props) {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [estado, setEstado] = useState('todos');
    const [showInicioPicker, setShowInicioPicker] = useState(false);
    const [showFinPicker, setShowFinPicker] = useState(false);

    const aplicarFiltro = () => {
        onFilter(fechaInicio, fechaFin, estado);
    };

    const limpiarFiltro = () => {
        setFechaInicio('');
        setFechaFin('');
        setEstado('todos');
        onFilter('', '', 'todos');
    };

    const onInicioChange = (event: any, selectedDate?: Date) => {
        setShowInicioPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFechaInicio(formatDate(selectedDate));
        }
    };

    const onFinChange = (event: any, selectedDate?: Date) => {
        setShowFinPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFechaFin(formatDate(selectedDate));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filtros</Text>

            <View style={styles.row}>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowInicioPicker(true)}>
                    <Text style={fechaInicio ? styles.dateText : styles.placeholderText}>
                        {fechaInicio || 'Desde'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dateButton} onPress={() => setShowFinPicker(true)}>
                    <Text style={fechaFin ? styles.dateText : styles.placeholderText}>
                        {fechaFin || 'Hasta'}
                    </Text>
                </TouchableOpacity>

                {showInicioPicker && (
                    <DateTimePicker
                        value={fechaInicio ? new Date(fechaInicio + 'T00:00:00') : new Date()}
                        mode="date"
                        display="default"
                        onChange={onInicioChange}
                    />
                )}

                {showFinPicker && (
                    <DateTimePicker
                        value={fechaFin ? new Date(fechaFin + 'T00:00:00') : new Date()}
                        mode="date"
                        display="default"
                        onChange={onFinChange}
                    />
                )}
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
    fontFamily: 'CormorantGaramond_700Bold',
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
    fontFamily: 'SourceSans3_400Regular',
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
    fontFamily: 'SourceSans3_400Regular',
        color: '#2196F3',
        fontSize: 12
    },
    chipTextActive: {
    fontFamily: 'SourceSans3_600SemiBold',
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
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#fff',
        fontWeight: 'bold'
    },
    dateButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4,
        justifyContent: 'center',
        minHeight: 38
    },
    dateText: {
        fontFamily: 'SourceSans3_400Regular',
        color: '#212121',
        fontSize: 14
    },
    placeholderText: {
        fontFamily: 'SourceSans3_400Regular',
        color: '#888',
        fontSize: 14
    }
});
