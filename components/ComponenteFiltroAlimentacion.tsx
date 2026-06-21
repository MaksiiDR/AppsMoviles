import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
    onFiltrar: (estado: string, tipoComida: string, fechaInicio: string, fechaFin: string) => void;
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ComponenteFiltroAlimentacion({ onFiltrar }: Props) {
    const estados = ['Todos', 'Consumido', 'Parcial', 'No consumido'];
    const tipos = ['Todas', 'Desayuno', 'Almuerzo', 'Once', 'Cena', 'Colación'];
    
    const [estadoActual, setEstadoActual] = useState('Todos');
    const [tipoActual, setTipoActual] = useState('Todas');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [showInicioPicker, setShowInicioPicker] = useState(false);
    const [showFinPicker, setShowFinPicker] = useState(false);

    const applyFilters = (estado: string, tipo: string, fInicio: string, fFin: string) => {
        onFiltrar(estado, tipo, fInicio, fFin);
    };

    const handleEstadoChange = (estado: string) => {
        setEstadoActual(estado);
        applyFilters(estado, tipoActual, fechaInicio, fechaFin);
    };

    const handleTipoChange = (tipo: string) => {
        setTipoActual(tipo);
        applyFilters(estadoActual, tipo, fechaInicio, fechaFin);
    };

    const onInicioChange = (event: any, selectedDate?: Date) => {
        setShowInicioPicker(Platform.OS === 'ios');
        const nextDate = selectedDate ? formatDate(selectedDate) : '';
        setFechaInicio(nextDate);
        applyFilters(estadoActual, tipoActual, nextDate, fechaFin);
    };

    const onFinChange = (event: any, selectedDate?: Date) => {
        setShowFinPicker(Platform.OS === 'ios');
        const nextDate = selectedDate ? formatDate(selectedDate) : '';
        setFechaFin(nextDate);
        applyFilters(estadoActual, tipoActual, fechaInicio, nextDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.fechasContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelSmall}>Desde (YYYY-MM-DD)</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowInicioPicker(true)}>
                        <Text style={fechaInicio ? styles.dateText : styles.placeholderText}>
                            {fechaInicio || 'Seleccionar'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelSmall}>Hasta (YYYY-MM-DD)</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowFinPicker(true)}>
                        <Text style={fechaFin ? styles.dateText : styles.placeholderText}>
                            {fechaFin || 'Seleccionar'}
                        </Text>
                    </TouchableOpacity>
                </View>

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

            <Text style={styles.label}>Filtrar por Estado:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                {estados.map((estado) => (
                    <TouchableOpacity
                        key={estado}
                        style={[
                            styles.chip,
                            estadoActual === estado && styles.chipSelected
                        ]}
                        onPress={() => handleEstadoChange(estado)}
                    >
                        <Text style={[
                            styles.chipText,
                            estadoActual === estado && styles.chipTextSelected
                        ]}>
                            {estado}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.label}>Filtrar por Tipo:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                {tipos.map((tipo) => (
                    <TouchableOpacity
                        key={tipo}
                        style={[
                            styles.chip,
                            tipoActual === tipo && styles.chipSelected
                        ]}
                        onPress={() => handleTipoChange(tipo)}
                    >
                        <Text style={[
                            styles.chipText,
                            tipoActual === tipo && styles.chipTextSelected
                        ]}>
                            {tipo}
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
        borderBottomColor: '#eee',
        paddingBottom: 15
    },
    label: {
        fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 8,
        marginTop: 10,
        color: '#555'
    },
    labelSmall: {
        fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 12,
        color: '#555',
        marginBottom: 4
    },
    fechasContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        gap: 10
    },
    inputGroup: {
        flex: 1
    },
    input: {
        fontFamily: 'SourceSans3_400Regular',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#FAFAFA'
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        minHeight: 38
    },
    dateText: {
        fontFamily: 'SourceSans3_400Regular',
        color: '#333',
        fontSize: 14
    },
    placeholderText: {
        fontFamily: 'SourceSans3_400Regular',
        color: '#888',
        fontSize: 14
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
