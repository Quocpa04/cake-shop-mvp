export const THEME = {
  colors: {
    primary: '#5A2C38',        // Wine / Deep Burgundy (Brand Miette)
    primaryLight: '#7E3F50',
    primaryDark: '#3E1C25',
    secondary: '#A04A5E',      // Rose Red
    accent: '#D4AF37',         // Warm Gold (Loyalty & VIP)
    accentLight: '#F3E5AB',
    background: '#F9F6F0',     // Warm Bakery Off-white / Cream
    surface: '#FFFFFF',
    surfaceSubtle: '#F3ECE8',
    cardBorder: '#EDE2DB',
    textPrimary: '#2D1E23',    // Espresso Dark
    textDark: '#2D1E23',       // Alias for dark text
    textSecondary: '#7A6E72',  // Charcoal Grey
    textMuted: '#A69B9E',
    border: '#E8DDD7',
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#ED6C02',
    warningLight: '#FFF4E5',
    error: '#D32F2F',
    errorLight: '#FFEBEE',
    info: '#0288D1',
    infoLight: '#E1F5FE',
  },
  typography: {
    titleLarge: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
    titleMedium: { fontSize: 18, fontWeight: '700' as const },
    titleSmall: { fontSize: 16, fontWeight: '600' as const },
    bodyLarge: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
    bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    caption: { fontSize: 11, fontWeight: '500' as const },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 999,
  },
  shadows: {
    sm: {
      shadowColor: '#5A2C38',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#5A2C38',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#5A2C38',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};
