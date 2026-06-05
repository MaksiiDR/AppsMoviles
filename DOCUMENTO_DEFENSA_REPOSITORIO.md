# Documento de Defensa del Repositorio

## 1. Qué es CuidaMed

CuidaMed es una aplicación móvil construida para apoyar la gestión básica de salud de un adulto mayor. La app reúne en una sola interfaz la ficha médica principal, las citas médicas, el control de medicamentos y el historial asociado a cambios o tratamientos.

La propuesta fue pensada para una evaluación académica, por lo que prioriza claridad funcional, navegación simple y persistencia local demostrable.

## 2. Qué problema resuelve

En muchos contextos familiares o de cuidado informal, la información médica se encuentra dispersa: algunos datos en papel, otros en mensajes o simplemente en la memoria del cuidador. CuidaMed busca centralizar esa información en una app simple de usar.

Esto permite:

- revisar rápidamente la condición general del paciente
- registrar y consultar citas médicas
- mantener un control de medicamentos
- conservar un historial de cambios relevantes

## 3. Funcionalidades que se pueden mostrar en la demo

### Ficha del adulto mayor

Se puede demostrar:

- visualización de resumen de ficha
- acceso al detalle completo
- edición de datos personales y clínicos
- registro de tratamiento y comentarios

Pantallas relacionadas:

- `app/(tabs)/ficha.tsx`
- `app/ficha-completa.tsx`
- `app/formulario-ficha.tsx`

### Citas médicas

Se puede demostrar:

- listado de citas
- filtrado por fecha y estado
- creación de una nueva cita
- edición y eliminación
- advertencia si la fecha corresponde a feriado

Pantallas relacionadas:

- `app/(tabs)/index.tsx`
- `app/formulario-cita.tsx`

### Medicamentos

Se puede demostrar:

- listado por estado
- registro de medicamentos
- edición de medicamentos
- restricción cuando el usuario finaliza el tratamiento de medicacion no modificable

Pantallas relacionadas:

- `app/(tabs)/medicamentos.tsx`
- `app/formulario-medicamento.tsx`

### Historial

Se puede demostrar:

- historial de citas pasadas
- historial de cambios y tratamientos de la ficha

Pantallas relacionadas:

- `app/(tabs)/historial.tsx`
- `app/historial-ficha.tsx`

## 4. Cómo está organizado el repositorio

### `app/`

Contiene las pantallas de la aplicación. Expo Router usa esta carpeta para definir la navegación basada en archivos.

### `components/`

Contiene componentes reutilizables de interfaz, por ejemplo tarjetas de citas, medicamentos, resumen de ficha y filtros.

### `hooks/`

Contiene la lógica compartida. El archivo más importante es `useDatabase.ts`, que centraliza la creación de tablas, inserción de datos de prueba y operaciones CRUD.

### `services/`

Contiene lógica de apoyo no visual:

- `ServicioFeriadosChile.ts`: consulta una API para verificar feriados.
- `ServicioRecordatorios.ts`: simula alertas académicas para recordatorios.

### `utils/`

Incluye utilidades puras. En este proyecto destaca la validación de RUT chileno con módulo 11.

### `tests/`

Contiene pruebas unitarias. Actualmente se valida la lógica del RUT con `vitest`.

### `constants/`

Contiene el tema visual compartido, incluyendo colores, espaciados y familias tipográficas.

## 5. Cómo funciona la navegación

La aplicación usa dos niveles:

- un `Stack` raíz en `app/_layout.tsx`
- una navegación por tabs en `app/(tabs)/_layout.tsx`

Las tabs principales son:

- Adulto Mayor
- Medicamentos
- Citas
- Historial

Desde estas tabs se navega a formularios y vistas de detalle con `router.push(...)`.

## 6. Cómo funciona la persistencia

La app utiliza SQLite local mediante `expo-sqlite`.

En `hooks/useDatabase.ts` se crean las tablas:

- `cita`
- `ficha_adulto_mayor`
- `historial_ficha`
- `medicamento`

Además:

- se inicializa la base automáticamente
- se insertan datos de ejemplo si la base está vacía
- se exponen funciones CRUD para citas, ficha y medicamentos

Esto permite mostrar persistencia local real sin depender de internet para los datos principales.

## 7. Decisiones técnicas importantes

### Por qué Expo Router

Se eligió porque facilita una navegación clara basada en archivos, lo que ayuda también a explicar la estructura del proyecto.

### Por qué SQLite local

Se eligió para cumplir el requisito de persistencia local. Además, evita depender de un backend remoto y facilita la demostración incluso sin conexión.

### Por qué dos familias de fuentes

Se integraron dos familias reales para cumplir la pauta de estilo:

- una familia de exhibición para títulos
- una familia de lectura para textos y etiquetas

## 8. Qué se puede decir si preguntan por el código

### “¿Dónde está la lógica de datos?”

Está centralizada en `hooks/useDatabase.ts`. Ese archivo crea las tablas, inserta datos iniciales y expone las funciones para leer y guardar información.

### “¿Dónde se ve la navegación?”

En `app/_layout.tsx` y `app/(tabs)/_layout.tsx`. Ahí se define la navegación global y las tabs principales.

### “¿Dónde se valida el RUT?”

En `utils/validadorRut.ts`, y esa lógica está verificada por pruebas unitarias en `tests/validadorRut.test.ts`.

### “¿Cómo se demuestra la persistencia?”

Se puede crear o editar una ficha, una cita o un medicamento, volver atrás y comprobar que los datos siguen visibles porque fueron almacenados en SQLite.

### “¿Qué parte usa internet?”

Solo la verificación de feriados usa una API externa. Si esa consulta falla, la app no se bloquea y asume que no es feriado.

## 9. Limitaciones conocidas

- no hay autenticación de usuarios
- no existe sincronización con backend remoto
- los recordatorios son simulados con alertas y no con notificaciones nativas reales
- la cobertura de pruebas automatizadas es todavía acotada

## 10. Recorrido sugerido para la defensa

1. Mostrar la pantalla principal de ficha.
2. Entrar al detalle completo.
3. Editar la ficha y explicar que el cambio queda en SQLite.
4. Ir a citas, mostrar filtros y crear o editar una.
5. Explicar la validación de feriados.
6. Ir a medicamentos y mostrar la diferencia entre estados.
7. Cerrar mostrando historial y la estructura del repositorio.

## 11. Mensaje técnico breve para cerrar

El repositorio está organizado por responsabilidad: navegación en `app`, UI reutilizable en `components`, persistencia en `hooks`, servicios auxiliares en `services`, validaciones puras en `utils` y pruebas en `tests`. Esa separación permite explicar el proyecto de forma clara y extenderlo sin mezclar lógica visual con lógica de datos.