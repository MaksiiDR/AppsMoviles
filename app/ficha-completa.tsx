import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, FichaAdultoMayor } from '../hooks/useDatabase';
import ComponenteContactoEmergencia from '../components/ComponenteContactoEmergencia';

export default function PantallaFichaCompleta() {
    const { db, obtenerFicha } = useDatabase();
    const [ficha, setFicha] = useState<FichaAdultoMayor | null>(null);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const cargarFicha = async () => {
                if (db) {
                    const data = await obtenerFicha();
                    setFicha(data);
                }
            };
            cargarFicha();
        }, [db])
    );

    if (!ficha) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.text}>Cargando ficha...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{ficha.nombreCompleto}</Text>
                <Text style={styles.subtitle}>{ficha.edad} años | RUT: {ficha.rut}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Condición Médica</Text>
                <Text style={styles.text}><Text style={styles.label}>Condición actual: </Text>{ficha.condicion}</Text>
                <Text style={styles.text}><Text style={styles.label}>Enfermedades crónicas: </Text>{ficha.enfermedadesCronicas || 'Ninguna'}</Text>
                <Text style={styles.text}><Text style={styles.label}>Alergias: </Text>{ficha.alergiasConocidas || 'Ninguna'}</Text>
                <Text style={styles.text}><Text style={styles.label}>Antecedentes quirúrgicos: </Text>{ficha.antecedentesQuirurgicos || 'Ninguno'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Atención Médica</Text>
                <Text style={styles.text}><Text style={styles.label}>Médico Tratante: </Text>{ficha.medicoTratante}</Text>
            </View>

            <ComponenteContactoEmergencia contacto={ficha.contactosEmergencia} />

            <View style={styles.footerInfo}>
                <Text style={styles.updateText}>Última actualización: {ficha.ultimaActualizacion}</Text>
            </View>

            <TouchableOpacity style={styles.historyBtn} onPress={() => router.push('/historial-ficha')}>
                <Text style={styles.btnText}>Ver Historial de Cambios y Tratamientos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/formulario-ficha')}>
                <Text style={styles.btnText}>Editar Ficha</Text>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
    },
    subtitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    sectionTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
        paddingBottom: 4
    },
    label: {
    fontFamily: 'SourceSans3_600SemiBold',
        fontWeight: 'bold',
        color: '#555'
    },
    text: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 15,
        color: '#333',
        marginBottom: 6,
        lineHeight: 22
    },
    footerInfo: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    updateText: {
    fontFamily: 'SourceSans3_400Regular',
        color: '#888',
        fontSize: 13,
        fontStyle: 'italic'
    },
    historyBtn: {
        backgroundColor: '#607D8B',
        padding: 14,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center'
    },
    editBtn: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        marginBottom: 40,
        alignItems: 'center'
    },
    btnText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
