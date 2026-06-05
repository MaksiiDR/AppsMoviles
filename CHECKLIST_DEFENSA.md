# Checklist de Defensa

## Pauta versus evidencia

### Tres funcionalidades

- [ ] Ficha del adulto mayor demostrable
- [ ] Citas médicas demostrables
- [ ] Medicamentos demostrables

### Navegación

- [ ] Tabs principales visibles
- [ ] Navegación a formularios funcionando
- [ ] Navegación a detalle e historial funcionando

### Fuentes y estilo

- [ ] Dos familias tipográficas reales cargadas
- [ ] Estilo visual consistente entre tabs y pantallas principales
- [ ] Botones, tarjetas y tipografía visibles en demo

### Persistencia local

- [ ] SQLite explicada como solución de persistencia
- [ ] Crear o editar datos y verificar persistencia
- [ ] Mostrar archivo `useDatabase.ts` si preguntan por el almacenamiento

### Repositorio y código fuente

- [ ] README del proyecto actualizado
- [ ] Documento de defensa disponible
- [ ] Test del validador ejecutable con `npm test`
- [ ] Lint ejecutable con `npm run lint`

## Qué mostrar en la demo

1. Pantalla de ficha.
2. Vista completa de ficha.
3. Edición de ficha con guardado.
4. Lista de citas con filtros.
5. Creación o edición de una cita.
6. Lista de medicamentos.
7. Edición de medicamento o bloqueo por estado terminado.
8. Historial.

## Qué explicar si preguntan por configuración

- Expo se usa para acelerar el desarrollo y simplificar la demostración.
- Expo Router organiza la navegación basada en archivos.
- SQLite permite persistencia local real sin backend.
- Vitest permite ejecutar pruebas unitarias del validador.

## Qué explicar si preguntan por el código

- `app/` contiene las pantallas.
- `components/` contiene piezas reutilizables.
- `hooks/useDatabase.ts` concentra la lógica de base de datos.
- `services/` contiene feriados y recordatorios.
- `utils/validadorRut.ts` contiene la validación del RUT.

## Comandos útiles antes de defender

```bash
npm run lint
npm test
npm start
```