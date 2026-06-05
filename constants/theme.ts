export const theme = {
    colors: {
        background: '#F4F1EA',
        surface: '#FFFDF8',
        surfaceMuted: '#EFE7DA',
        text: '#2D2A26',
        textMuted: '#6C645A',
        primary: '#1F6FA8',
        secondary: '#6F8F4E',
        accent: '#A65A3A',
        border: '#D9CDBD',
        danger: '#B84032',
        warning: '#B87A27',
        success: '#4D7A46',
    },
    typography: {
        display: 'CormorantGaramond_700Bold',
        displayMedium: 'CormorantGaramond_600SemiBold',
        body: 'SourceSans3_400Regular',
        bodySemiBold: 'SourceSans3_600SemiBold',
        bodyBold: 'SourceSans3_700Bold',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 8,
        md: 14,
        lg: 22,
    },
};

export type AppTheme = typeof theme;