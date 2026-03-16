import React from 'react';
import { theme } from '../styles/theme';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
  autoDetected?: boolean;
}

interface ComplianceChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

const CheckIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 8.5L6.5 11.5L12.5 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 5V8.5M8 11H8.01M2 13L8 2L14 13H2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ items, onToggle }) => {
  const completedCount = items.filter((i) => i.checked).length;
  const totalRequired = items.filter((i) => i.required).length;
  const requiredCompleted = items.filter((i) => i.required && i.checked).length;
  const allRequiredDone = requiredCompleted === totalRequired;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Compliance Checklist</span>
        <span
          style={{
            ...styles.badge,
            background: allRequiredDone ? theme.colors.successDim : theme.colors.warningDim,
            color: allRequiredDone ? theme.colors.success : theme.colors.warning,
          }}
        >
          {completedCount}/{items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${(completedCount / items.length) * 100}%`,
            background: allRequiredDone ? theme.colors.success : theme.colors.warning,
            boxShadow: allRequiredDone
              ? `0 0 6px ${theme.colors.success}50`
              : `0 0 6px ${theme.colors.warning}50`,
          }}
        />
      </div>

      {/* Items */}
      <div style={styles.list}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.item,
              opacity: item.checked ? 0.75 : 1,
            }}
            onClick={() => onToggle(item.id)}
          >
            {/* Checkbox */}
            <div
              style={{
                ...styles.checkbox,
                background: item.checked ? theme.colors.accent : 'transparent',
                borderColor: item.checked ? theme.colors.accent : theme.colors.border,
                boxShadow: item.checked ? `0 0 4px ${theme.colors.accent}40` : 'none',
              }}
            >
              {item.checked && (
                <span style={{ color: '#fff', display: 'flex' }}>
                  <CheckIcon size={10} />
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                ...styles.itemLabel,
                textDecoration: item.checked ? 'line-through' : 'none',
                color: item.checked ? theme.colors.textTertiary : theme.colors.text,
              }}
            >
              {item.label}
            </span>

            {/* Required badge or auto-detected */}
            <div style={styles.itemMeta}>
              {item.autoDetected && item.checked && (
                <span style={styles.autoBadge}>AUTO</span>
              )}
              {item.required && !item.checked && (
                <span style={styles.warningBadge}>
                  <WarningIcon size={10} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: '10px 12px',
    border: `1px solid ${theme.colors.borderSubtle}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  badge: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.mono,
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: theme.radius.sm,
  },
  progressBar: {
    height: '2px',
    background: theme.colors.elevated,
    borderRadius: '1px',
    marginBottom: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '1px',
    transition: `width ${theme.transition.normal}`,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 6px',
    borderRadius: theme.radius.sm,
    cursor: 'pointer',
    transition: `background ${theme.transition.fast}`,
  },
  checkbox: {
    width: '16px',
    height: '16px',
    minWidth: '16px',
    borderRadius: '3px',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${theme.transition.fast}`,
  },
  itemLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.sans,
    flex: 1,
    transition: `all ${theme.transition.fast}`,
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  autoBadge: {
    fontSize: '8px',
    fontWeight: 700,
    color: theme.colors.success,
    background: theme.colors.successDim,
    padding: '1px 4px',
    borderRadius: '2px',
    letterSpacing: '0.5px',
  },
  warningBadge: {
    color: theme.colors.warning,
    display: 'flex',
    alignItems: 'center',
  },
};

export default ComplianceChecklist;
