// Light theme colors
const lightColors = {
  background: "#ffffff",
  foreground: "#333333",
  card: "#ffffff",
  cardForeground: "#333333",
  popover: "#ffffff",
  popoverForeground: "#333333",
  primary: "#3b82f6",
  primaryForeground: "#ffffff",
  secondary: "#f3f4f6",
  secondaryForeground: "#4b5563",
  muted: "#f9fafb",
  mutedForeground: "#6b7280",
  accent: "#e0f2fe",
  accentForeground: "#1e3a8a",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",
  border: "#e5e7eb",
  input: "#e5e7eb",
  ring: "#3b82f6",
  chart1: "#3b82f6",
  chart2: "#2563eb",
  chart3: "#1d4ed8",
  chart4: "#1e40af",
  chart5: "#1e3a8a",
  sidebar: "#f9fafb",
  sidebarForeground: "#333333",
  sidebarPrimary: "#3b82f6",
  sidebarPrimaryForeground: "#ffffff",
  sidebarAccent: "#e0f2fe",
  sidebarAccentForeground: "#1e3a8a",
  sidebarBorder: "#e5e7eb",
  sidebarRing: "#3b82f6",
};

// Dark theme colors
const darkColors = {
  background: "#171717",
  foreground: "#e5e5e5",
  card: "#262626",
  cardForeground: "#e5e5e5",
  popover: "#262626",
  popoverForeground: "#e5e5e5",
  primary: "#3b82f6",
  primaryForeground: "#ffffff",
  secondary: "#262626",
  secondaryForeground: "#e5e5e5",
  muted: "#1f1f1f",
  mutedForeground: "#a3a3a3",
  accent: "#1e3a8a",
  accentForeground: "#bfdbfe",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",
  border: "#404040",
  input: "#404040",
  ring: "#3b82f6",
  chart1: "#60a5fa",
  chart2: "#3b82f6",
  chart3: "#2563eb",
  chart4: "#1d4ed8",
  chart5: "#1e40af",
  sidebar: "#171717",
  sidebarForeground: "#e5e5e5",
  sidebarPrimary: "#3b82f6",
  sidebarPrimaryForeground: "#ffffff",
  sidebarAccent: "#1e3a8a",
  sidebarAccentForeground: "#bfdbfe",
  sidebarBorder: "#404040",
  sidebarRing: "#3b82f6",
};

export const theme = {
  light: {
    colors: lightColors,
    radius: {
      sm: 2,
      md: 4,
      lg: 6,
      xl: 10,
    },
    spacing: {
      xs: 4,    // 0.5x base (tight spacing)
      sm: 8,    // 1x base (standard small spacing)
      md: 12,   // 1.5x base (medium spacing)
      lg: 16,   // 2x base (standard spacing, screen margins)
      xl: 20,   // 2.5x base (comfortable spacing)
      "2xl": 24, // 3x base (loose spacing, section gaps)
      "3xl": 32, // 4x base (large gaps, card spacing)
      "4xl": 40, // 5x base (extra large gaps)
      "5xl": 48, // 6x base (maximum spacing)
    },
  },
  dark: {
    colors: darkColors,
    radius: {
      sm: 2,
      md: 4,
      lg: 6,
      xl: 10,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      "2xl": 24,
      "3xl": 32,
      "4xl": 40,
      "5xl": 48,
    },
  },
} as const;

export type Theme = typeof theme.light;
