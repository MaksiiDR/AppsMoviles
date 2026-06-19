import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase, FichaAdultoMayor } from '../../hooks/useDatabase';
import ComponenteResumenFicha from '../../components/ComponenteResumenFicha';

export default function PantallaDashboardFicha() {
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
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#212121',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginTop: 20,
    },
    buttonPrimary: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 2,
    },
    buttonSecondary: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 2,
    },
    buttonText: {
    fontFamily: 'SourceSans3_600SemiBold',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
    fontFamily: 'SourceSans3_400Regular',
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    }
});
