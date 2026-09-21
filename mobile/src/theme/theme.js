export const colors = {
  background: '#FBF7F0',
  surface: '#FFFFFF',
  surfaceMuted: '#F1E9DD',
  primary: '#B5836B',
  primaryDark: '#8C6248',
  accent: '#7FA98E',
  accentSoft: '#DCEBE1',
  warning: '#E0A458',
  danger: '#C1503F',
  dangerDark: '#9C3D30',
  text: '#3A2E27',
  textMuted: '#7A6D62',
  border: '#E7DDCF',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radii = { sm: 8, md: 16, lg: 24, pill: 999 };

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, fontWeight: '400', color: colors.text },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '600', color: colors.white },
};

export default { colors, spacing, radii, typography };
