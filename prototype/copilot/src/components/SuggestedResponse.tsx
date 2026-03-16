import React, { useState } from 'react';
import { theme } from '../styles/theme';

interface SuggestedResponseProps {
  text: string;
  confidence: number; // 0-100
  onUse: () => void;
  onEdit: () => void;
  onSkip: () => void;
}

const SuggestedResponse: React.FC<SuggestedResponseProps> = ({
  text,
  confidence,
  onUse,
  onEdit,
  onSkip,
}) => {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const confColor =
    confidence >= 80
      ? theme.colors.success
      : confidence >= 60
        ? theme.colors.warning
        : theme.colors.danger;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.aiTag}>
          <span style={styles.aiDot} />
          AI Suggestion
        </div>
        <div style={{ ...styles.confidence, color: confColor }}>
          <div
            style={{
              ...styles.confBar,
              background: `${confColor}30`,
            }}
          >
            <div
              style={{
                ...styles.confFill,
                width: `${confidence}%`,
                background: confColor,
              }}
            />
          </div>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.xs }}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Suggested text */}
      <p style={styles.text}>{text}</p>

      {/* Action buttons */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.btn,
            ...styles.btnUse,
            ...(hoveredBtn === 'use' ? styles.btnUseHover : {}),
          }}
          onMouseEnter={() => setHoveredBtn('use')}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={onUse}
        >
          Use
        </button>
        <button
          style={{
            ...styles.btn,
            ...styles.btnEdit,
            ...(hoveredBtn === 'edit' ? styles.btnEditHover : {}),
          }}
          onMouseEnter={() => setHoveredBtn('edit')}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          style={{
            ...styles.btn,
            ...styles.btnSkip,
            ...(hoveredBtn === 'skip' ? styles.btnSkipHover : {}),
          }}
          onMouseEnter={() => setHoveredBtn('skip')}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={onSkip}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.accentBorder}`,
    borderLeft: `3px solid ${theme.colors.accent}`,
    borderRadius: theme.radius.md,
    padding: '10px 12px',
    marginBottom: '8px',
    transition: `all ${theme.transition.fast}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  aiTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  aiDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: theme.colors.accent,
    boxShadow: `0 0 6px ${theme.colors.accent}80`,
    display: 'inline-block',
  },
  confidence: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  confBar: {
    width: '40px',
    height: '3px',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  confFill: {
    height: '100%',
    borderRadius: '2px',
    transition: `width ${theme.transition.normal}`,
  },
  text: {
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: '1.5',
    margin: '0 0 10px 0',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  btn: {
    padding: '4px 14px',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    fontFamily: theme.fonts.sans,
    cursor: 'pointer',
    transition: `all ${theme.transition.fast}`,
    border: 'none',
    letterSpacing: '0.2px',
  },
  btnUse: {
    background: theme.colors.accent,
    color: '#fff',
  },
  btnUseHover: {
    background: theme.colors.accentDim,
    boxShadow: `0 0 8px ${theme.colors.accent}50`,
  },
  btnEdit: {
    background: 'transparent',
    color: theme.colors.accent,
    border: `1px solid ${theme.colors.accentBorder}`,
  },
  btnEditHover: {
    background: theme.colors.accentBg,
  },
  btnSkip: {
    background: 'transparent',
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.border}`,
  },
  btnSkipHover: {
    background: theme.colors.elevated,
    color: theme.colors.text,
  },
};

export default SuggestedResponse;
