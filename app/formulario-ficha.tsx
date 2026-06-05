import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDatabase } from '../hooks/useDatabase';
import { validarRUT } from '../utils/validadorRut';

export default function PantallaFormularioFicha() {
    const { db, obtenerFicha, guardarFicha } = useDatabase();
    const router = useRouter();

    const [nombreCompleto, setNombreCompleto] = useState('');
    const [edad, setEdad] = useState('');
    const [rut, setRut] = useState('');
    const [condicion, setCondicion] = useState('');
    const [enfermedadesCronicas, setEnfermedadesCronicas] = useState('');
    const [antecedentesQuirurgicos, setAntecedentesQuirurgicos] = useState('');
    const [alergiasConocidas, setAlergiasConocidas] = useState('');
    const [medicoTratante, setMedicoTratante] = useState('');
    const [contactosEmergencia, setContactosEmergencia] = useState('');
    
    // Para el historial
    const [tratamiento, setTratamiento] = useState('');
    const [comentarios, setComentarios] = useState('');
    
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            if (db) {
                const ficha = await obtenerFicha();
                if (ficha) {
                    setIsEdit(true);
                    setNombreCompleto(ficha.nombreCompleto);
                    setEdad(ficha.edad.toString());
                    setRut(ficha.rut);
                    setCondicion(ficha.condicion);
                    setEnfermedadesCronicas(ficha.enfermedadesCronicas);
                    setAntecedentesQuirurgicos(ficha.antecedentesQuirurgicos);
                    setAlergiasConocidas(ficha.alergiasConocidas);
                    setMedicoTratante(ficha.medicoTratante);
                    setContactosEmergencia(ficha.contactosEmergencia);
                }
            }
        };
        void cargarDatos();
    }, [db, obtenerFicha]);

    // Validación de RUT se hace externamente
    const handleGuardar = async () => {
        if (!nombreCompleto.trim()) {
            Alert.alert('Error', 'El nombre completo es obligatorio.');
            return;
        }
        if (!edad || isNaN(Number(edad))) {
            Alert.alert('Error', 'La edad debe ser un número válido.');
            return;
        }
        if (!validarRUT(rut)) {
            Alert.alert('Error', 'Debe ingresar un RUT válido (formato chileno correcto).');
            return;
        }
        if (!condicion.trim() || !medicoTratante.trim() || !contactosEmergencia.trim()) {
            Alert.alert('Error', 'Condición, Médico Tratante y Contactos de Emergencia son obligatorios.');
            return;
        }

        const exito = await guardarFicha(
            {
                nombreCompleto,
                edad: Number(edad),
                rut,
                condicion,
                enfermedadesCronicas,
                antecedentesQuirurgicos,
                alergiasConocidas,
                medicoTratante,
                contactosEmergencia
            },
            'Cuidador Principal', // Usuario en duro (simplificación académica)
            tratamiento,
            comentarios,
            isEdit ? 'Actualización de Ficha' : 'Creación de Ficha'
        );

        if (exito) {
            Alert.alert('Éxito', 'La ficha ha sido guardada correctamente.');
            router.back();
        } else {
            Alert.alert('Error', 'Hubo un problema al guardar la ficha.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isEdit ? 'Editar Ficha' : 'Crear Ficha'}</Text>
            
            <Text style={styles.sectionTitle}>Datos Personales Básicos</Text>
            <TextInput style={styles.input} placeholder="Nombre Completo *" value={nombreCompleto} onChangeText={setNombreCompleto} />
            <TextInput style={styles.input} placeholder="Edad *" value={edad} onChangeText={setEdad} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="RUT *" value={rut} onChangeText={setRut} />
            
            <Text style={styles.sectionTitle}>Información Médica</Text>
            <TextInput style={styles.input} placeholder="Condición Actual *" value={condicion} onChangeText={setCondicion} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Enfermedades Crónicas" value={enfermedadesCronicas} onChangeText={setEnfermedadesCronicas} multiline />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Antecedentes Quirúrgicos" value={antecedentesQuirurgicos} onChangeText={setAntecedentesQuirurgicos} multiline />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Alergias Conocidas" value={alergiasConocidas} onChangeText={setAlergiasConocidas} multiline />
            <TextInput style={styles.input} placeholder="Médico Tratante *" value={medicoTratante} onChangeText={setMedicoTratante} />
            
            <Text style={styles.sectionTitle}>Emergencias</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Contactos de Emergencia *" value={contactosEmergencia} onChangeText={setContactosEmergencia} multiline />
            
            <Text style={styles.sectionTitle}>Registro de Visita / Tratamiento</Text>
            <Text style={styles.helpText}>Al guardar, esta información se añadirá al historial de la ficha.</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Tratamiento Recetado (Opcional)" value={tratamiento} onChangeText={setTratamiento} multiline />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Comentarios del cuidador (Opcional)" value={comentarios} onChangeText={setComentarios} multiline />
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
                <Text style={styles.saveBtnText}>Guardar Ficha</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
        color: '#1565C0',
        borderBottomWidth: 1,
        borderBottomColor: '#E3F2FD',
        paddingBottom: 4
    },
    input: {
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
    helpText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 10,
        fontStyle: 'italic'
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
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
