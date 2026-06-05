# Implementacion de Fuentes de Letra

## Objetivo

Cumplir el requisito de usar al menos 2 familias de fuentes en la aplicacion.

## Familias usadas

- Cormorant Garamond (titulos)
- Source Sans 3 (texto de lectura)

## Donde se instalaron

En `package.json`:

- `@expo-google-fonts/cormorant-garamond`
- `@expo-google-fonts/source-sans-3`
- `expo-font` (ya presente)

## Donde se cargan

En `app/_layout.tsx`:

1. Se importan las variantes de ambas familias.
2. Se cargan con `useFonts(...)`.
3. Se controla Splash Screen para evitar render antes de que esten listas.

## Donde se centralizan

En `constants/theme.ts`:

- `typography.display`
- `typography.displayMedium`
- `typography.body`
- `typography.bodySemiBold`
- `typography.bodyBold`

## Donde se aplican

- `app/(tabs)/_layout.tsx`
- `app/(tabs)/ficha.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/medicamentos.tsx`
- `components/ComponenteResumenFicha.tsx`
- `components/ComponenteItemCita.tsx`
- `components/ComponenteItemMedicamento.tsx`

## Validacion rapida

1. Ejecutar `npm run lint`
2. Abrir la app y revisar visualmente encabezados/titulos y textos
3. Confirmar que no aparecen fuentes de sistema por defecto en zonas ya migradas
