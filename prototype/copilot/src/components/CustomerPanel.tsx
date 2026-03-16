import React from 'react';
import { theme, scoreColor } from '../styles/theme';

// ----- Mock Data -----
const customer = {
  name: 'James R. Patterson',
  ssn4: '4821',
  dob: '03/15/1978',
  phone: '(214) 555-0193',
  email: 'j.patterson@email.com',
  address: '1247 Elm Creek Dr, Dallas, TX 75201',
};

const account = {
  product: 'Auto Loan',
  number: '****8834',
  balance: 18420.67,
  payment: 487.32,
  dpd: 62,
  riskTier: 'Tier 3',
  origDate: '06/2021',
  rate: '5.99%',
  term: '72 mo',
  ltv: 112,
};

const financial = {
  monthlyIncome: 4850,
  monthlyExpenses: 3920,
  dti: 68,
  savings: 1240,
  otherDebts: 2,
  creditScore: 598,
  recentMissed: 2,
  employmentStatus: 'Part-time',
};

// ----- Component -----
const CustomerPanel: React.FC = () => {
  const riskColor = account.dpd > 60 ? theme.colors.danger : account.dpd > 30 ? theme.colors.warning : theme.colors.success;

  return (
    <div style={styles.panel}>
      {/* Customer Identity */}
      <Section title="Customer">
        <div style={styles.nameRow}>
          <span style={styles.customerName}>{customer.name}</span>
          <span style={{ ...styles.riskBadge, background: `${riskColor}20`, color: riskColor, boxShadow: `0 0 6px ${riskColor}30` }}>
            {account.dpd} DPD
          </span>
        </div>
        <DataRow label="SSN (last 4)" value={`***-**-${customer.ssn4}`} mono />
        <DataRow label="DOB" value={customer.dob} />
        <DataRow label="Phone" value={customer.phone} />
      </Section>

      {/* Account Details */}
      <Section title="Account">
        <div style={styles.productBadge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accent} strokeWidth="2">
            <rect x="1" y="3" width="22" height="18" rx="3" />
            <line x1="1" y1="9" x2="23" y2="9" />
          </svg>
          <span style={{ color: theme.colors.accent, fontWeight: 600, fontSize: theme.fontSize.sm }}>
            {account.product}
          </span>
          <span style={{ color: theme.colors.textTertiary, fontSize: theme.fontSize.xs }}>
            {account.number}
          </span>
        </div>
        <DataRow label="Balance" value={`$${account.balance.toLocaleString()}`} mono highlight />
        <DataRow label="Payment" value={`$${account.payment.toLocaleString()}/mo`} mono />
        <DataRow label="Rate / Term" value={`${account.rate} / ${account.term}`} />
        <DataRow label="LTV" value={`${account.ltv}%`} mono warn={account.ltv > 100} />
        <DataRow label="Risk Tier" value={account.riskTier} />
      </Section>

      {/* Financial Snapshot */}
      <Section title="Financial Snapshot" badge="Plaid">
        <DataRow label="Monthly Income" value={`$${financial.monthlyIncome.toLocaleString()}`} mono />
        <DataRow label="Monthly Expenses" value={`$${financial.monthlyExpenses.toLocaleString()}`} mono />
        <DataRow
          label="DTI Ratio"
          value={`${financial.dti}%`}
          mono
          warn={financial.dti > 50}
        />
        <DataRow label="Savings" value={`$${financial.savings.toLocaleString()}`} mono />
        <DataRow label="Credit Score" value={financial.creditScore.toString()} mono warn={financial.creditScore < 620} />
        <DataRow label="Employment" value={financial.employmentStatus} />
        <DataRow label="Missed Payments" value={`${financial.recentMissed} (last 6 mo)`} warn={financial.recentMissed > 0} />
      </Section>

      {/* Mini Risk Indicator */}
      <div style={styles.riskCard}>
        <div style={styles.riskHeader}>
          <span style={styles.riskTitle}>RISK ASSESSMENT</span>
          <span style={{ ...styles.riskLevel, color: theme.colors.danger }}>ELEVATED</span>
        </div>
        <div style={styles.riskBar}>
          <div style={{ ...styles.riskBarFill, width: '72%', background: `linear-gradient(90deg, ${theme.colors.warning}, ${theme.colors.danger})` }} />
        </div>
        <div style={styles.riskFactors}>
          <span style={styles.riskFactor}>High DTI</span>
          <span style={styles.riskFactor}>62 DPD</span>
          <span style={styles.riskFactor}>LTV 112%</span>
        </div>
      </div>
    </div>
  );
};

// ----- Sub-components -----

const Section: React.FC<{ title: string; badge?: string; children: React.ReactNode }> = ({
  title,
  badge,
  children,
}) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <span style={styles.sectionTitle}>{title}</span>
      {badge && <span style={styles.sectionBadge}>{badge}</span>}
    </div>
    <div style={styles.sectionBody}>{children}</div>
  </div>
);

interface DataRowProps {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  warn?: boolean;
}

const DataRow: React.FC<DataRowProps> = ({ label, value, mono, highlight, warn }) => (
  <div style={styles.dataRow}>
    <span style={styles.dataLabel}>{label}</span>
    <span
      style={{
        ...styles.dataValue,
        fontFamily: mono ? theme.fonts.mono : theme.fonts.sans,
        color: warn
          ? theme.colors.danger
          : highlight
            ? theme.colors.text
            : theme.colors.textSecondary,
        fontWeight: highlight ? 600 : 400,
        fontSize: highlight ? theme.fontSize.md : theme.fontSize.sm,
      }}
    >
      {value}
    </span>
  </div>
);

// ----- Styles -----
const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: theme.layout.leftPanelWidth,
    minWidth: theme.layout.leftPanelWidth,
    height: '100%',
    background: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  customerName: {
    fontSize: theme.fontSize.lg,
    fontWeight: 700,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
  },
  riskBadge: {
    fontSize: '9px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: theme.radius.sm,
    fontFamily: theme.fonts.mono,
    letterSpacing: '0.3px',
  },
  section: {
    marginBottom: '4px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: `1px solid ${theme.colors.borderSubtle}`,
    marginBottom: '4px',
  },
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: 700,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  sectionBadge: {
    fontSize: '8px',
    fontWeight: 700,
    color: theme.colors.success,
    background: theme.colors.successDim,
    padding: '1px 5px',
    borderRadius: '3px',
    letterSpacing: '0.3px',
  },
  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  productBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    background: theme.colors.accentBg,
    borderRadius: theme.radius.sm,
    marginBottom: '4px',
    border: `1px solid ${theme.colors.accentBorder}`,
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 4px',
    borderRadius: '3px',
  },
  dataLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
  },
  dataValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.sans,
    textAlign: 'right' as const,
  },
  riskCard: {
    background: `linear-gradient(135deg, rgba(248,113,113,0.08), rgba(251,191,36,0.05))`,
    border: `1px solid rgba(248,113,113,0.2)`,
    borderRadius: theme.radius.md,
    padding: '10px 12px',
    marginTop: '4px',
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  riskTitle: {
    fontSize: '9px',
    fontWeight: 700,
    color: theme.colors.textTertiary,
    letterSpacing: '1px',
  },
  riskLevel: {
    fontSize: theme.fontSize.xs,
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  riskBar: {
    height: '3px',
    background: theme.colors.elevated,
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: `width ${theme.transition.normal}`,
  },
  riskFactors: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  riskFactor: {
    fontSize: '9px',
    fontWeight: 600,
    color: theme.colors.warning,
    background: theme.colors.warningDim,
    padding: '1px 5px',
    borderRadius: '3px',
  },
};

export default CustomerPanel;
