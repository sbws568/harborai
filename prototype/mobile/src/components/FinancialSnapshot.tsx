import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface FinancialSnapshotProps {
  monthlyIncome: string;
  monthlyExpenses: string;
  disposableIncome: string;
  debtToIncome: string;
  creditScore?: string;
}

const FinancialSnapshot: React.FC<FinancialSnapshotProps> = ({
  monthlyIncome,
  monthlyExpenses,
  disposableIncome,
  debtToIncome,
  creditScore,
}) => {
  const { theme } = useTheme();

  const getDebtToIncomeColor = () => {
    const ratio = parseFloat(debtToIncome);
    if (ratio < 36) return theme.colors.success;
    if (ratio < 50) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        theme.shadow.md as any,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📊</Text>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Your Financial Snapshot
        </Text>
      </View>

      <View style={styles.grid}>
        <View
          style={[
            styles.metricCard,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Monthly Income
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.success }]}>
            {monthlyIncome}
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Monthly Expenses
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.error }]}>
            {monthlyExpenses}
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Disposable Income
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.indigo }]}>
            {disposableIncome}
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Debt-to-Income
          </Text>
          <Text style={[styles.metricValue, { color: getDebtToIncomeColor() }]}>
            {debtToIncome}%
          </Text>
        </View>
      </View>

      {creditScore && (
        <View
          style={[
            styles.creditScoreBar,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Text style={[styles.creditLabel, { color: theme.colors.textSecondary }]}>
            Estimated Credit Score
          </Text>
          <View style={styles.creditScoreRow}>
            <Text style={[styles.creditValue, { color: theme.colors.warning }]}>
              {creditScore}
            </Text>
            <Text style={[styles.creditRange, { color: theme.colors.textTertiary }]}>
              / 850
            </Text>
          </View>
        </View>
      )}

      <Text style={[styles.disclaimer, { color: theme.colors.textTertiary }]}>
        Based on your connected bank account data. Updated just now.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  metricCard: {
    width: '48%',
    marginHorizontal: '1%',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  creditScoreBar: {
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  creditScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  creditValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  creditRange: {
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default FinancialSnapshot;
