import React, { useState } from 'react';
import { theme, scoreColor } from '../styles/theme';
import ScoreGauge from './ScoreGauge';
import ComplianceChecklist from './ComplianceChecklist';

// ----- Mock Data -----
const scores = {
  ability: 38,
  intent: 72,
  risk: 65,
  composite: 54,
};

const recommendedOffer = {
  type: 'Payment Reduction',
  description: 'Temporary 6-month payment reduction to $290/mo (from $487/mo)',
  savings: '$1,182 total relief',
  conditions: 'Requires income verification within 30 days',
  confidence: 'High',
};

const alternativeOffers = [
  { type: 'Forbearance', detail: '90-day payment pause', risk: 'Moderate' },
  { type: 'Term Extension', detail: 'Extend to 84 mo, $385/mo', risk: 'Low' },
  { type: 'Rate Reduction', detail: '3.99% for 12 months', risk: 'Low' },
];

const initialChecklist = [
  { id: 'ffiec', label: 'FFIEC interaction logged', checked: true, required: true, autoDetected: true },
  { id: 'consent', label: 'Consent to discuss captured', checked: true, required: true, autoDetected: true },
  { id: 'hardship', label: 'Hardship documented', checked: true, required: true, autoDetected: true },
  { id: 'offer', label: 'Offer presented to customer', checked: false, required: true },
  { id: 'response', label: 'Customer response recorded', checked: false, required: true },
];

// ----- Component -----
const InsightsPanel: React.FC = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const compositeColor = scoreColor(scores.composite);
  const compositeLabel =
    scores.composite >= 70 ? 'Approve Standard' : scores.composite >= 40 ? 'Review Required' : 'Manual Override';

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div style={styles.panel}>
      {/* Score Breakdown */}
      <div style={styles.section}>
        <span style={styles.sectionTitle}>AI Score Breakdown</span>
        <div style={styles.gaugeRow}>
          <ScoreGauge score={scores.ability} label="Ability" size={72} />
          <ScoreGauge score={scores.intent} label="Intent" size={72} />
          <ScoreGauge score={scores.risk} label="Risk" size={72} />
        </div>

        {/* Composite */}
        <div style={styles.compositeCard}>
          <div style={styles.compositeHeader}>
            <span style={styles.compositeLabel}>COMPOSITE SCORE</span>
            <span
              style={{
                ...styles.compositeValue,
                color: compositeColor,
                textShadow: `0 0 8px ${compositeColor}40`,
              }}
            >
              {scores.composite}
            </span>
          </div>
          <div style={styles.compositeBar}>
            <div
              style={{
                ...styles.compositeBarFill,
                width: `${scores.composite}%`,
                background: `linear-gradient(90deg, ${theme.colors.danger}, ${theme.colors.warning}, ${theme.colors.success})`,
              }}
            />
            <div
              style={{
                ...styles.compositeMarker,
                left: `${scores.composite}%`,
                background: compositeColor,
                boxShadow: `0 0 6px ${compositeColor}80`,
              }}
            />
          </div>
          <span style={{ ...styles.compositeRec, color: compositeColor }}>{compositeLabel}</span>
        </div>
      </div>

      {/* Recommended Offer */}
      <div style={styles.section}>
        <span style={styles.sectionTitle}>Recommended Offer</span>
        <div style={styles.offerCard}>
          <div style={styles.offerHeader}>
            <span style={styles.offerType}>{recommendedOffer.type}</span>
            <span style={styles.offerConfidence}>
              <span style={styles.confDot} />
              {recommendedOffer.confidence}
            </span>
          </div>
          <p style={styles.offerDesc}>{recommendedOffer.description}</p>
          <div style={styles.offerMeta}>
            <span style={styles.offerSavings}>{recommendedOffer.savings}</span>
          </div>
          <p style={styles.offerCondition}>{recommendedOffer.conditions}</p>
        </div>
      </div>

      {/* Alternative Offers */}
      <div style={styles.section}>
        <span style={styles.sectionTitle}>Alternatives</span>
        <div style={styles.altList}>
          {alternativeOffers.map((alt, i) => (
            <div key={i} style={styles.altItem}>
              <div style={styles.altInfo}>
                <span style={styles.altType}>{alt.type}</span>
                <span style={styles.altDetail}>{alt.detail}</span>
              </div>
              <span
                style={{
                  ...styles.altRisk,
                  color: alt.risk === 'Low' ? theme.colors.success : theme.colors.warning,
                  background:
                    alt.risk === 'Low' ? theme.colors.successDim : theme.colors.warningDim,
                }}
              >
                {alt.risk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionRow}>
        {[
          { label: 'Generate Offer', key: 'gen', primary: true },
          { label: 'Override', key: 'over' },
          { label: 'Escalate', key: 'esc' },
          { label: 'Send to Customer', key: 'send', accent: true },
        ].map((btn) => (
          <button
            key={btn.key}
            style={{
              ...styles.actionBtn,
              ...(btn.primary
                ? {
                    background: theme.colors.accent,
                    color: '#fff',
                    border: 'none',
                    ...(hoveredBtn === btn.key
                      ? { boxShadow: `0 0 10px ${theme.colors.accent}50` }
                      : {}),
                  }
                : btn.accent
                  ? {
                      background: 'transparent',
                      color: theme.colors.accent,
                      border: `1px solid ${theme.colors.accentBorder}`,
                      ...(hoveredBtn === btn.key ? { background: theme.colors.accentBg } : {}),
                    }
                  : {
                      background: 'transparent',
                      color: theme.colors.textSecondary,
                      border: `1px solid ${theme.colors.borderSubtle}`,
                      ...(hoveredBtn === btn.key ? { background: theme.colors.elevated } : {}),
                    }),
            }}
            onMouseEnter={() => setHoveredBtn(btn.key)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Compliance Checklist */}
      <div style={styles.section}>
        <ComplianceChecklist items={checklist} onToggle={toggleCheck} />
      </div>
    </div>
  );
};

// ----- Styles -----
const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: theme.layout.rightPanelWidth,
    minWidth: theme.layout.rightPanelWidth,
    height: '100%',
    background: theme.colors.surface,
    borderLeft: `1px solid ${theme.colors.border}`,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  section: {
    marginBottom: '2px',
  },
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: 700,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
  },
  gaugeRow: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '12px',
  },
  compositeCard: {
    background: theme.colors.bg,
    borderRadius: theme.radius.md,
    padding: '10px 12px',
    border: `1px solid ${theme.colors.borderSubtle}`,
  },
  compositeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  compositeLabel: {
    fontSize: '9px',
    fontWeight: 700,
    color: theme.colors.textTertiary,
    letterSpacing: '1px',
  },
  compositeValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: 800,
    fontFamily: theme.fonts.mono,
  },
  compositeBar: {
    height: '4px',
    background: theme.colors.elevated,
    borderRadius: '2px',
    position: 'relative' as const,
    marginBottom: '6px',
    overflow: 'visible',
  },
  compositeBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: `width ${theme.transition.normal}`,
  },
  compositeMarker: {
    position: 'absolute' as const,
    top: '-3px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
    border: `2px solid ${theme.colors.bg}`,
  },
  compositeRec: {
    fontSize: theme.fontSize.xs,
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  offerCard: {
    background: `linear-gradient(135deg, ${theme.colors.accentBg}, rgba(99, 102, 241, 0.03))`,
    border: `1px solid ${theme.colors.accentBorder}`,
    borderRadius: theme.radius.md,
    padding: '10px 12px',
  },
  offerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  offerType: {
    fontSize: theme.fontSize.md,
    fontWeight: 700,
    color: theme.colors.accent,
    fontFamily: theme.fonts.sans,
  },
  offerConfidence: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
    fontWeight: 600,
  },
  confDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: theme.colors.success,
    display: 'inline-block',
    boxShadow: `0 0 4px ${theme.colors.success}60`,
  },
  offerDesc: {
    margin: '0 0 6px 0',
    fontSize: theme.fontSize.sm,
    lineHeight: '1.5',
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
  },
  offerMeta: {
    marginBottom: '4px',
  },
  offerSavings: {
    fontSize: theme.fontSize.sm,
    fontWeight: 700,
    color: theme.colors.success,
    fontFamily: theme.fonts.mono,
  },
  offerCondition: {
    margin: 0,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic' as const,
  },
  altList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  altItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 8px',
    background: theme.colors.bg,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.borderSubtle}`,
  },
  altInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  altType: {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
  },
  altDetail: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
  },
  altRisk: {
    fontSize: '9px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '3px',
    letterSpacing: '0.3px',
  },
  actionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    marginBottom: '4px',
  },
  actionBtn: {
    padding: '6px 10px',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    fontFamily: theme.fonts.sans,
    cursor: 'pointer',
    transition: `all ${theme.transition.fast}`,
    letterSpacing: '0.2px',
    whiteSpace: 'nowrap' as const,
  },
};

export default InsightsPanel;
