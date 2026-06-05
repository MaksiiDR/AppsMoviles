# Guía Técnica del Repositorio

## Resumen

Este repositorio contiene la aplicación CuidaMed, desarrollada con Expo, React Nativle y TypeScript. E objetivo principal es demostrar una app móvil con navegación clara, persistencia local y tres funcionalidades académicamente evaluables: ficha del adulto mayor, citas médicas y medicamentos.

## Decisiones técnicas

### Framework

- Expo 54 para reducir complejidad de configuración y facilitar la demo.
- React Native para interfaz móvil multiplataforma.
- TypeScript con `strict: true` para reforzar consistencia del código.

### Navegación

- Expo Router con estructura basada en archivos.
- `app/_layout.tsx` define el stack raíz.
- `app/(tabs)/_layout.tsx` define la navegación principal por tabs.

### Persistencia

- SQLite local mediante `expo-sqlite`.
- La lógica está centralizada en `hooks/useDatabase.ts`.
- Se crean tablas e insertan datos de prueba para facilitar la evaluación.

### Estilo

- Tema compartido en `constants/theme.ts`.
- Tipografía cargada en `app/_layout.tsx`.
- Se usan dos familias tipográficas reales para cumplir la pauta visual.

## Mapa rápido de carpetas

- `app/`: pantallas y rutas.
- `components/`: componentes reutilizables.
- `constants/`: tema visual.
- `hooks/`: acceso a datos y lógica compartida.
- `services/`: integraciones y comportamientos auxiliares.
- `utils/`: funciones puras.
- `tests/`: pruebas unitarias.

## Reglas de trabajo sugeridas

- Mantener la lógica de base de datos en `useDatabase.ts`.
- Evitar duplicar estilos duros si ya existe algo reusable en `constants/theme.ts`.
- Validar con `npm run lint` antes de cerrar cambios.
- Validar con `npm test` cuando se modifique lógica pura.

## Referencia de documentación externa

Si se necesita documentación oficial de Expo, usar la versión exacta:

https://docs.expo.dev/versions/v54.0.0/
