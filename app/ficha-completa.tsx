import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, FichaAdultoMayor } from '../hooks/useDatabase';
import ComponenteContactoEmergencia from '../components/ComponenteContactoEmergencia';
import { theme } from '../constants/theme';

export default function PantallaFichaCompleta() {
    const { db, obtenerFicha } = useDatabase();
    const [ficha, setFicha] = useState<FichaAdultoMayor | null>(null);
    const router = useRouter();

    const cargarFicha = useCallback(async () => {
        if (!db) {
            return;
        }

        const data = await obtenerFicha();
        setFicha(data);
    }, [db, obtenerFicha]);

    useFocusEffect(
        useCallback(() => {
            void cargarFicha();
        }, [cargarFicha])
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
        backgroundColor: theme.colors.background,
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
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontFamily: theme.typography.display,
        fontSize: 26,
        color: theme.colors.text,
    },
    subtitle: {
        fontFamily: theme.typography.body,
        fontSize: 16,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
        backgroundColor: theme.colors.surface,
        padding: 14,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    sectionTitle: {
        fontFamily: theme.typography.displayMedium,
        fontSize: 18,
        color: theme.colors.text,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: 4
    },
    label: {
        fontFamily: theme.typography.bodyBold,
        color: theme.colors.textMuted,
    },
    text: {
        fontFamily: theme.typography.body,
        fontSize: 15,
        color: theme.colors.text,
        marginBottom: 6,
        lineHeight: 22
    },
    footerInfo: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    updateText: {
        fontFamily: theme.typography.body,
        color: theme.colors.textMuted,
        fontSize: 13,
        fontStyle: 'italic'
    },
    historyBtn: {
        backgroundColor: theme.colors.primary,
        padding: 14,
        borderRadius: theme.radius.md,
        marginBottom: 10,
        alignItems: 'center'
    },
    editBtn: {
        backgroundColor: theme.colors.secondary,
        padding: 14,
        borderRadius: theme.radius.md,
        marginBottom: 40,
        alignItems: 'center'
    },
    btnText: {
        color: '#FFF',
        fontFamily: theme.typography.bodyBold,
        fontSize: 16,
    }
});
