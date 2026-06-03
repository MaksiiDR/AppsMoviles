import { Alert } from 'react-native';

export const ServicioRecordatorios = {
    /**
     * Genera recordatorios (simulados vía Alert) basados en la hora y fecha de la cita
     * Se simula el "Recordatorio de Voz" para el adulto mayor como una Alerta de texto
     * indicando [VOZ] para cumplir el requerimiento de forma "académica simple" sin librerías extra.
     */
    generarAlertas: (fechaCita: string, horaCita: string, esFeriado: boolean) => {
        // En una app real, aquí se calcularía la diferencia de tiempo actual vs fechaCita/horaCita
        // y se programarían notificaciones push locales (ej. expo-notifications) o alarmas.
        
        // Simulación: mostramos cómo serían las alertas
        
        // 1. Alertas para el Cuidador
        Alert.alert(
            "Alertas Programadas (Cuidador)",
            `Se han programado notificaciones en su dispositivo a las 24, 6 y 3 horas antes de la cita del ${fechaCita} a las ${horaCita}.`
        );

        // 2. Alertas por voz para el Adulto Mayor
        let mensajeVoz = `Tiene una cita médica mañana. Recuerde prepararse.`;
        if (esFeriado) {
            mensajeVoz += ` Atención: El día de la cita es feriado nacional. Se recomienda verificar la asistencia y si el centro estará abierto.`;
        }

        setTimeout(() => {
            Alert.alert(
                "[RECORDATORIO POR VOZ - ADULTO MAYOR]",
                `Simulando voz:\n\n"${mensajeVoz}"\n\n(Se emitirá el día anterior, y a las 6 y 3 horas previas)`
            );
        }, 1000);
    }
};
