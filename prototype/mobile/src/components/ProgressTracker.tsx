import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface Payment {
  id: string;
  date: string;
  amount: string;
  status: 'completed' | 'upcoming' | 'overdue' | 'current';
}

interface ProgressTrackerProps {
  totalPayments: number;
  completedPayments: number;
  payments: Payment[];
  totalAmount: string;
  paidAmount: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalPayments,
  completedPayments,
  payments,
  totalAmount,
  paidAmount,
}) => {
  const { theme } = useTheme();
  const progress = totalPayments > 0 ? completedPayments / totalPayments : 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.shadow.md as any]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Payment Progress</Text>

      {/* Progress bar */}
      <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>

      <View style={styles.progressLabels}>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          {completedPayments} of {totalPayments} payments
        </Text>
        <Text style={[styles.progressPercent, { color: theme.colors.indigo }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <View style={styles.amountRow}>
        <View style={styles.amountItem}>
          <Text style={[styles.amountLabel, { color: theme.colors.textTertiary }]}>Paid</Text>
          <Text style={[styles.amountValue, { color: theme.colors.success }]}>{paidAmount}</Text>
        </View>
        <View style={[styles.amountDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.amountItem}>
          <Text style={[styles.amountLabel, { color: theme.colors.textTertiary }]}>Total</Text>
          <Text style={[styles.amountValue, { color: theme.colors.text }]}>{totalAmount}</Text>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        {payments.map((payment, index) => {
          const isLast = index === payments.length - 1;
          const dotColor =
            payment.status === 'completed'
              ? theme.colors.success
              : payment.status === 'current'
              ? theme.colors.indigo
              : payment.status === 'overdue'
              ? theme.colors.error
              : theme.colors.border;

          return (
            <View key={payment.id} style={styles.timelineItem}>
              <View style={styles.timelineDotColumn}>
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: dotColor },
                    payment.status === 'current' && styles.timelineDotCurrent,
                  ]}
                >
                  {payment.status === 'completed' && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor:
                          payment.status === 'completed'
                            ? theme.colors.success
                            : theme.colors.border,
                      },
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineDate, { color: theme.colors.textSecondary }]}>
                  {payment.date}
                </Text>
                <Text style={[styles.timelineAmount, { color: theme.colors.text }]}>
                  {payment.amount}
                </Text>
                {payment.status === 'current' && (
                  <View
                    style={[
                      styles.currentBadge,
                      { backgroundColor: theme.colors.primaryLight },
                    ]}
                  >
                    <Text style={[styles.currentBadgeText, { color: theme.colors.indigo }]}>
                      Next up
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  amountDivider: {
    width: 1,
    height: 40,
  },
  timeline: {
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineDotColumn: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCurrent: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 12,
  },
  timelineDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  timelineAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ProgressTracker;
