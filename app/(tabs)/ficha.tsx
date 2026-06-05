import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, FichaAdultoMayor } from '../../hooks/useDatabase';
import ComponenteResumenFicha from '../../components/ComponenteResumenFicha';
import { theme } from '../../constants/theme';

export default function PantallaDashboardFicha() {
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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Gestión de Ficha</Text>
            {ficha ? (
                <View>
                    <ComponenteResumenFicha ficha={ficha} />
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('/ficha-completa')}>
                            <Text style={styles.buttonText}>Ver Ficha Completa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/formulario-ficha')}>
                            <Text style={styles.buttonText}>Editar Ficha</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay ficha registrada.</Text>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('/formulario-ficha')}>
                        <Text style={styles.buttonText}>Crear Ficha</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerTitle: {
        fontFamily: theme.typography.display,
        fontSize: 30,
        textAlign: 'center',
        marginVertical: 20,
        color: theme.colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginTop: 20,
    },
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: theme.radius.md,
        elevation: 2,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: theme.radius.md,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontFamily: theme.typography.bodyBold,
        fontSize: 16,
        textAlign: 'center'
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontFamily: theme.typography.body,
        fontSize: 16,
        color: theme.colors.textMuted,
        marginBottom: 20,
    }
});
