import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDatabase } from '../hooks/useDatabase';

export default function PantallaFormularioMedicamento() {
    const { db, obtenerMedicamentoPorId, guardarMedicamento } = useDatabase();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const isEdit = !!id;
    const medicamentoId = isEdit ? Number(id) : undefined;

    const [nombreComercial, setNombreComercial] = useState('');
    const [principioActivo, setPrincipioActivo] = useState('');
    const [viaAdministracion, setViaAdministracion] = useState('');
    const [estado, setEstado] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [isTerminado, setIsTerminado] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            if (db && medicamentoId) {
                const data = await obtenerMedicamentoPorId(medicamentoId);
                if (data) {
                    setNombreComercial(data.nombreComercial);
                    setPrincipioActivo(data.principioActivo);
                    setViaAdministracion(data.viaAdministracion);
                    setEstado(data.estado);
                    setObservaciones(data.observaciones || '');
                    
                    if (data.estado === 'Terminado') {
                        setIsTerminado(true);
                    }
                }
            }
        };
        cargarDatos();
    }, [db, medicamentoId]);

    const handleGuardar = async () => {
        if (!nombreComercial.trim()) {
            Alert.alert('Error', 'El nombre comercial es obligatorio.');
            return;
        }
        if (!principioActivo.trim()) {
            Alert.alert('Error', 'El principio activo es obligatorio.');
            return;
        }
        if (!viaAdministracion) {
            Alert.alert('Error', 'Debe seleccionar una vía de administración.');
            return;
        }
        if (!estado) {
            Alert.alert('Error', 'Debe seleccionar un estado.');
            return;
        }

        const exito = await guardarMedicamento({
            ficha_id: 1, // Global patient
            nombreComercial,
            principioActivo,
            viaAdministracion,
            estado,
            observaciones
        }, medicamentoId);

        if (exito) {
            Alert.alert('Éxito', 'El medicamento ha sido guardado correctamente.');
            router.back();
        } else {
            Alert.alert('Error', 'Hubo un problema al guardar (probablemente porque está terminado).');
        }
    };

    // Componente simple para los botones de selección
    const OptionButton = ({ label, selected, onPress, disabled }: any) => (
        <TouchableOpacity
            style={[
                styles.optionBtn,
                selected && styles.optionBtnSelected,
                disabled && styles.optionBtnDisabled
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[
                styles.optionBtnText,
                selected && styles.optionBtnTextSelected,
                disabled && styles.optionBtnTextDisabled
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isEdit ? 'Editar Medicamento' : 'Nuevo Medicamento'}</Text>
            
            {isTerminado && (
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>
                        Este medicamento está en estado Terminado y ha pasado a formar parte del historial clínico. No puede ser modificado ni eliminado.
                    </Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Datos del Medicamento</Text>
            <TextInput 
                style={[styles.input, isTerminado && styles.inputDisabled]} 
                placeholder="Nombre Comercial *" 
                value={nombreComercial} 
                onChangeText={setNombreComercial} 
                editable={!isTerminado}
            />
            <TextInput 
                style={[styles.input, isTerminado && styles.inputDisabled]} 
                placeholder="Principio Activo *" 
                value={principioActivo} 
                onChangeText={setPrincipioActivo} 
                editable={!isTerminado}
            />
            
            <Text style={styles.sectionTitle}>Vía de Administración *</Text>
            <View style={styles.optionsContainer}>
                {['Oral', 'Subcutánea', 'Tópica', 'Inhalada', 'Otra'].map(via => (
                    <OptionButton 
                        key={via} 
                        label={via} 
                        selected={viaAdministracion === via} 
                        onPress={() => setViaAdministracion(via)}
                        disabled={isTerminado}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Estado *</Text>
            <View style={styles.optionsContainer}>
                {['Activo', 'Suspendido', 'Terminado'].map(est => (
                    <OptionButton 
                        key={est} 
                        label={est} 
                        selected={estado === est} 
                        onPress={() => setEstado(est)}
                        disabled={isTerminado}
                    />
                ))}
            </View>

            <Text style={styles.sectionTitle}>Observaciones (Opcional)</Text>
            <TextInput 
                style={[styles.input, styles.textArea, isTerminado && styles.inputDisabled]} 
                placeholder="Escribe aquí notas adicionales..." 
                value={observaciones} 
                onChangeText={setObservaciones} 
                multiline 
                editable={!isTerminado}
            />
            
            {!isTerminado && (
                <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
                    <Text style={styles.saveBtnText}>Guardar Medicamento</Text>
                </TouchableOpacity>
            )}
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
    alertBox: {
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFB74D',
        marginBottom: 20
    },
    alertText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#E65100',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    sectionTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
        color: '#1565C0',
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
    inputDisabled: {
        backgroundColor: '#E0E0E0',
        color: '#757575',
        borderColor: '#BDBDBD'
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
    optionBtnDisabled: {
        borderColor: '#BDBDBD',
        backgroundColor: '#F5F5F5',
        opacity: 0.7
    },
    optionBtnText: {
        color: '#2196F3',
        fontWeight: 'bold'
    },
    optionBtnTextSelected: {
        color: '#fff',
    },
    optionBtnTextDisabled: {
        color: '#9E9E9E'
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
    }
});
