// HarborAI Agent Copilot - Dark Theme
// Bloomberg Terminal + VS Code aesthetic with accent colors

export const theme = {
  colors: {
    // Core backgrounds
    bg: '#0F172A',         // Slate-900 — deepest background
    surface: '#1E293B',    // Slate-800 — panels, cards
    elevated: '#334155',   // Slate-700 — hover states, raised elements
    border: '#475569',     // Slate-600 — dividers, borders
    borderSubtle: '#334155',

    // Text hierarchy
    text: '#F8FAFC',       // Slate-50 — primary text
    textSecondary: '#94A3B8', // Slate-400 — secondary/muted text
    textTertiary: '#64748B',  // Slate-500 — timestamps, labels
    textInverse: '#0F172A',

    // Accent
    accent: '#818CF8',     // Indigo-400 — primary accent
    accentDim: '#6366F1',  // Indigo-500
    accentBg: 'rgba(129, 140, 248, 0.1)',
    accentBorder: 'rgba(129, 140, 248, 0.3)',

    // Semantic
    success: '#34D399',    // Emerald-400
    successDim: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',    // Amber-400
    warningDim: 'rgba(251, 191, 36, 0.15)',
    danger: '#F87171',     // Red-400
    dangerDim: 'rgba(248, 113, 113, 0.15)',
    info: '#38BDF8',       // Sky-400
    infoDim: 'rgba(56, 189, 248, 0.15)',

    // Agent/Customer message colors
    agentMsg: '#1E293B',
    customerMsg: '#172554', // Blue-950
  },

  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },

  fontSize: {
    xs: '10px',
    sm: '11px',
    base: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '28px',
  },

  spacing: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
  },

  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.5)',
    glow: (color: string) => `0 0 12px ${color}40, 0 0 4px ${color}60`,
    glowStrong: (color: string) => `0 0 20px ${color}50, 0 0 8px ${color}70`,
  },

  layout: {
    topBarHeight: '44px',
    leftPanelWidth: '280px',
    rightPanelWidth: '320px',
  },

  transition: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    slow: '0.4s ease',
  },
} as const;

export type Theme = typeof theme;

// Score color helper
export function scoreColor(score: number): string {
  if (score >= 70) return theme.colors.success;
  if (score >= 40) return theme.colors.warning;
  return theme.colors.danger;
}

// Score label helper
export function scoreLabel(score: number): string {
  if (score >= 70) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'High Risk';
}
