import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

const TopBar: React.FC = () => {
  const [callSeconds, setCallSeconds] = useState(247); // start at 4:07

  // Simulate live call timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.topBar}>
      {/* Left: Logo */}
      <div style={styles.left}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke={theme.colors.accent}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke={theme.colors.accent}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke={theme.colors.accent}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={styles.logoText}>
            Harbor<span style={{ color: theme.colors.accent }}>AI</span>
          </span>
          <span style={styles.logoSub}>Agent Copilot</span>
        </div>
      </div>

      {/* Center: Search + Call Timer */}
      <div style={styles.center}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.textTertiary}
            strokeWidth="2"
            style={{ marginRight: '6px', flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search customer, account, or case ID..."
            style={styles.searchInput}
          />
          <span style={styles.searchShortcut}>Ctrl+K</span>
        </div>

        {/* Call timer */}
        <div style={styles.callTimer}>
          <div style={styles.callDot} />
          <span style={styles.callLabel}>ACTIVE CALL</span>
          <span style={styles.callTime}>{formatTime(callSeconds)}</span>
        </div>
      </div>

      {/* Right: Agent info + settings */}
      <div style={styles.right}>
        {/* Agent status */}
        <div style={styles.agentInfo}>
          <div style={styles.avatar}>MR</div>
          <div style={styles.agentMeta}>
            <span style={styles.agentName}>Maria Rodriguez</span>
            <span style={styles.agentStatus}>
              <span style={styles.statusDot} />
              Available
            </span>
          </div>
        </div>

        {/* Settings gear */}
        <button style={styles.iconBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textSecondary} strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topBar: {
    height: theme.layout.topBarHeight,
    background: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 100,
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '200px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    filter: `drop-shadow(0 0 4px ${theme.colors.accent}50)`,
  },
  logoText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 700,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    letterSpacing: '-0.3px',
  },
  logoSub: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    fontWeight: 500,
    marginLeft: '4px',
    paddingLeft: '8px',
    borderLeft: `1px solid ${theme.colors.border}`,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1,
    justifyContent: 'center',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    background: theme.colors.bg,
    border: `1px solid ${theme.colors.borderSubtle}`,
    borderRadius: theme.radius.md,
    padding: '5px 10px',
    width: '320px',
    transition: `border-color ${theme.transition.fast}`,
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.sans,
    flex: 1,
    width: '100%',
  },
  searchShortcut: {
    fontSize: '9px',
    color: theme.colors.textTertiary,
    background: theme.colors.elevated,
    padding: '1px 5px',
    borderRadius: '3px',
    fontFamily: theme.fonts.mono,
    marginLeft: '6px',
    flexShrink: 0,
  },
  callTimer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: theme.radius.full,
    background: 'rgba(248, 113, 113, 0.1)',
    border: '1px solid rgba(248, 113, 113, 0.25)',
  },
  callDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: theme.colors.danger,
    boxShadow: `0 0 6px ${theme.colors.danger}80`,
    animation: 'pulse 2s ease-in-out infinite',
  },
  callLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: theme.colors.danger,
    letterSpacing: '0.8px',
  },
  callTime: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.mono,
    fontWeight: 600,
    color: theme.colors.danger,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '200px',
    justifyContent: 'flex-end',
  },
  agentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentDim})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.fontSize.xs,
    fontWeight: 700,
    color: '#fff',
    fontFamily: theme.fonts.sans,
  },
  agentMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  agentName: {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
  },
  agentStatus: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: theme.colors.success,
    boxShadow: `0 0 4px ${theme.colors.success}80`,
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: theme.radius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `background ${theme.transition.fast}`,
  },
};

export default TopBar;
