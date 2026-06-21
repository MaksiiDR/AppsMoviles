import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDatabase } from '../hooks/useDatabase';

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

export default function PantallaFormularioAlimentacion() {
    const { db, obtenerAlimentacionPorId, guardarAlimentacion } = useDatabase();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const isEdit = !!id;
    const alimentacionId = isEdit ? id as string : undefined;

    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [tipoComida, setTipoComida] = useState('');
    const [comidaDetalle, setComidaDetalle] = useState('');
    const [tipoDieta, setTipoDieta] = useState('');
    const [estado, setEstado] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFecha(formatDate(selectedDate));
        }
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setHora(formatTime(selectedDate));
        }
    };

    useEffect(() => {
        if (!isEdit) {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0].substring(0, 5);
            setFecha(today);
            setHora(time);
        } else {
            const cargarDatos = async () => {
                if (db && alimentacionId) {
                    const data = await obtenerAlimentacionPorId(alimentacionId);
                    if (data) {
                        setFecha(data.fecha);
                        setHora(data.hora);
                        setTipoComida(data.tipoComida);
                        setComidaDetalle(data.comidaDetalle || '');
                        setTipoDieta(data.tipoDieta);
                        setEstado(data.estado);
                        setObservaciones(data.observaciones || '');
                    }
                }
            };
            cargarDatos();
        }
    }, [db, alimentacionId]);

    const handleGuardar = async () => {
        if (!fecha || !hora) {
            Alert.alert('Error', 'La fecha y hora son obligatorias.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            Alert.alert("Error", "Formato de fecha inválido. Use YYYY-MM-DD");
            return;
        }
        if (!/^\d{2}:\d{2}$/.test(hora)) {
            Alert.alert("Error", "Formato de hora inválido. Use HH:MM");
            return;
        }
        if (!tipoComida) {
            Alert.alert('Error', 'Debe seleccionar un tipo de comida.');
            return;
        }
        if (!tipoDieta.trim()) {
            Alert.alert('Error', 'Debe indicar el tipo de dieta.');
            return;
        }
        if (!estado) {
            Alert.alert('Error', 'Debe seleccionar un estado.');
            return;
        }

        const exito = await guardarAlimentacion({
            ficha_id: '1', // Global patient
            fecha,
            hora,
            tipoComida,
            comidaDetalle,
            tipoDieta,
            estado,
            observaciones
        }, alimentacionId);

        if (exito) {
            router.back();
        } else {
            Alert.alert('Error', 'Hubo un problema al guardar el registro de alimentación.');
        }
    };

    const OptionButton = ({ label, selected, onPress }: any) => (
        <TouchableOpacity
            style={[
                styles.optionBtn,
                selected && styles.optionBtnSelected
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.optionBtnText,
                selected && styles.optionBtnTextSelected
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isEdit ? 'Editar Alimentación' : 'Nueva Alimentación'}</Text>
            
            <Text style={styles.sectionTitle}>Fecha y Hora</Text>
            <View style={styles.row}>
                <View style={styles.flex1}>
                    <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text style={fecha ? styles.dateText : styles.placeholderText}>
                            {fecha || 'Seleccionar'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.spacing} />
                <View style={styles.flex1}>
                    <Text style={styles.label}>Hora (HH:MM)</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                        <Text style={hora ? styles.dateText : styles.placeholderText}>
                            {hora || 'Seleccionar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={fecha ? new Date(fecha + 'T00:00:00') : new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={(() => {
                            if (hora) {
                                const [h, m] = hora.split(':');
                                const d = new Date();
                                d.setHours(Number(h));
                                d.setMinutes(Number(m));
                                return d;
                            }
                            return new Date();
                        })()}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onTimeChange}
                    />
                )}
            </View>

            <Text style={styles.sectionTitle}>Tipo de Comida *</Text>
            <View style={styles.optionsContainer}>
                {['Desayuno', 'Almuerzo', 'Once', 'Cena', 'Colación'].map(tipo => (
                    <OptionButton 
                        key={tipo} 
                        label={tipo} 
                        selected={tipoComida === tipo} 
                        onPress={() => setTipoComida(tipo)}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>¿Qué comió?</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ej. Sopa, pollo con arroz, pan..." 
                value={comidaDetalle} 
                onChangeText={setComidaDetalle} 
            />

            <Text style={styles.sectionTitle}>Tipo de Dieta *</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ej. Blanda, Normal, Sin sal" 
                value={tipoDieta} 
                onChangeText={setTipoDieta} 
            />

            <Text style={styles.sectionTitle}>Estado *</Text>
            <View style={styles.optionsContainer}>
                {['Consumido', 'Parcial', 'No consumido'].map(est => (
                    <OptionButton 
                        key={est} 
                        label={est} 
                        selected={estado === est} 
                        onPress={() => setEstado(est)}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Observaciones (Opcional)</Text>
            <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Escribe aquí notas adicionales (ej. le costó tragar, dejó la mitad)..." 
                value={observaciones} 
                onChangeText={setObservaciones} 
                multiline 
            />
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
                <Text style={styles.saveBtnText}>Guardar Registro</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    sectionTitle: {
        fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
        color: '#1565C0',
    },
    label: {
        fontFamily: 'SourceSans3_600SemiBold',
        fontSize: 14,
        marginBottom: 4,
        color: '#555'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12
    },
    flex1: {
        flex: 1
    },
    spacing: {
        width: 16
    },
    input: {
        fontFamily: 'SourceSans3_400Regular',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#FAFAFA',
        fontSize: 15
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16
    },
    optionBtn: {
        borderWidth: 1,
        borderColor: '#2196F3',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#fff'
    },
    optionBtnSelected: {
        backgroundColor: '#2196F3',
    },
    optionBtnText: {
        color: '#2196F3',
        fontWeight: 'bold'
    },
    optionBtnTextSelected: {
        color: '#fff',
    },
    saveBtn: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    saveBtnText: {
        fontFamily: 'SourceSans3_600SemiBold',
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    dateText: {
        fontFamily: 'SourceSans3_400Regular',
        color: '#333',
        fontSize: 15
    },
    placeholderText: {
        fontFamily: 'SourceSans3_400Regular',
        color: '#888',
        fontSize: 15
    }
});
