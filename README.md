# CuidaMed

CuidaMed es una aplicación móvil desarrollada con Expo y React Native para apoyar la gestión básica de salud de un adulto mayor. El proyecto se orienta a una evaluación académica donde se exige implementar funcionalidades visibles, navegación entre pantallas, persistencia local y una presentación coherente del código y del producto.

## Propósito

La aplicación concentra en un solo lugar la información más relevante para el seguimiento de un paciente adulto mayor:

- ficha médica general
- citas médicas
- medicamentos activos, suspendidos o terminados
- historial de cambios y tratamientos

El enfoque del proyecto es offline-first. La información principal queda persistida localmente con SQLite para que la app pueda demostrarse sin depender de un backend propio.

## Funcionalidades principales

### 1. Gestión de ficha del adulto mayor

Permite crear, visualizar y actualizar una ficha con datos personales, condición actual, enfermedades crónicas, alergias, antecedentes quirúrgicos, médico tratante y contactos de emergencia.

### 2. Gestión de citas médicas

Permite registrar, editar y eliminar citas. Incluye filtros por rango de fechas y estado, además de validación de fechas feriadas mediante un servicio externo.

### 3. Gestión de medicamentos

Permite registrar, editar y eliminar medicamentos. Los medicamentos terminados pasan a un estado de solo lectura y pueden considerarse parte del historial clínico.

### 4. Historial médico

Permite revisar cambios realizados sobre la ficha y consultar citas anteriores o tratamientos ya registrados.

## Tecnologías usadas

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router para navegación basada en archivos
- Expo SQLite para persistencia local
- Expo Font y Google Fonts para tipografía personalizada
- Vitest para pruebas unitarias

## Estructura del proyecto

- `app/`: pantallas principales y rutas manejadas por Expo Router.
- `components/`: componentes reutilizables para tarjetas, filtros y bloques de información.
- `hooks/`: lógica compartida, especialmente acceso a la base de datos local.
- `services/`: servicios auxiliares como consulta de feriados y recordatorios simulados.
- `utils/`: utilidades puras, como la validación del RUT.
- `tests/`: pruebas unitarias.
- `constants/`: tema visual compartido.

## Persistencia local

La app utiliza SQLite local para guardar la información principal. Las tablas creadas son:

- `cita`
- `ficha_adulto_mayor`
- `historial_ficha`
- `medicamento`

Además, el proyecto inserta datos de ejemplo para facilitar la demostración durante la evaluación.

## Navegación

La navegación combina un `Stack` raíz con un conjunto de tabs:

- Adulto Mayor
- Medicamentos
- Citas
- Historial

Desde esas tabs se accede a pantallas de detalle y formularios de edición.

## Requisitos

- Node.js 20 o superior recomendado
- npm
- Expo Go o emulador Android/iOS para pruebas de ejecución

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

También están disponibles:

```bash
npm run android
npm run ios
npm run web
```

## Verificación del proyecto

Lint:

```bash
npm run lint
```

Pruebas:

```bash
npm test
```

## Consideraciones de la evaluación

Este repositorio fue ajustado para que la evidencia técnica sea coherente con la pauta:

- funcionalidades claramente diferenciadas
- navegación entre pantallas
- persistencia local con SQLite
- uso de al menos dos familias tipográficas reales
- documentación para explicar el código y la arquitectura

## Documentación complementaria

- `DOCUMENTO_DEFENSA_REPOSITORIO.md`: guía para explicar el proyecto y el código.
- `CHECKLIST_DEFENSA.md`: verificación rápida contra la pauta.
- `AGENTS.md`: resumen técnico de decisiones del repositorio.
