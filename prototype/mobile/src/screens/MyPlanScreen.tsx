import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import ProgressTracker from '../components/ProgressTracker';
import GradientButton from '../components/GradientButton';

const MOCK_PLAN = {
  type: '6-Month Payment Plan',
  status: 'active',
  startDate: 'Jan 15, 2026',
  endDate: 'Jul 15, 2026',
  totalAmount: '$9,336',
  paidAmount: '$3,112',
  monthlyPayment: '$1,556',
  nextPaymentDate: 'Apr 15, 2026',
  totalPayments: 6,
  completedPayments: 2,
  payments: [
    { id: '1', date: 'Jan 15, 2026', amount: '$1,556.00', status: 'completed' as const },
    { id: '2', date: 'Feb 15, 2026', amount: '$1,556.00', status: 'completed' as const },
    { id: '3', date: 'Mar 15, 2026', amount: '$1,556.00', status: 'current' as const },
    { id: '4', date: 'Apr 15, 2026', amount: '$1,556.00', status: 'upcoming' as const },
    { id: '5', date: 'May 15, 2026', amount: '$1,556.00', status: 'upcoming' as const },
    { id: '6', date: 'Jun 15, 2026', amount: '$1,556.00', status: 'upcoming' as const },
  ],
};

const MyPlanScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Plan Status Header */}
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statusHeader}
      >
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active Plan</Text>
        </View>
        <Text style={styles.planType}>{MOCK_PLAN.type}</Text>
        <Text style={styles.planDates}>
          {MOCK_PLAN.startDate} — {MOCK_PLAN.endDate}
        </Text>
      </LinearGradient>

      {/* Next Payment Card */}
      <View
        style={[
          styles.nextPaymentCard,
          { backgroundColor: theme.colors.surface },
          theme.shadow.md as any,
        ]}
      >
        <View style={styles.nextPaymentHeader}>
          <Text style={styles.nextPaymentIcon}>📅</Text>
          <Text style={[styles.nextPaymentLabel, { color: theme.colors.textSecondary }]}>
            Next Payment Due
          </Text>
        </View>
        <Text style={[styles.nextPaymentAmount, { color: theme.colors.text }]}>
          {MOCK_PLAN.monthlyPayment}
        </Text>
        <Text style={[styles.nextPaymentDate, { color: theme.colors.indigo }]}>
          {MOCK_PLAN.nextPaymentDate}
        </Text>

        <View style={styles.nextPaymentActions}>
          <GradientButton
            title="Make Payment"
            onPress={() => {}}
            icon="💳"
            style={{ flex: 1, marginRight: 8 }}
          />
          <GradientButton
            title="Autopay"
            onPress={() => {}}
            variant="outline"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <View
          style={[styles.reminderBar, { backgroundColor: theme.colors.warningLight }]}
        >
          <Text style={styles.reminderIcon}>⏰</Text>
          <Text style={[styles.reminderText, { color: theme.colors.warning }]}>
            Payment due in 28 days. Set up autopay to never miss one!
          </Text>
        </View>
      </View>

      {/* Progress Tracker */}
      <View style={{ paddingHorizontal: 16 }}>
        <ProgressTracker
          totalPayments={MOCK_PLAN.totalPayments}
          completedPayments={MOCK_PLAN.completedPayments}
          payments={MOCK_PLAN.payments}
          totalAmount={MOCK_PLAN.totalAmount}
          paidAmount={MOCK_PLAN.paidAmount}
        />
      </View>

      {/* Payment History */}
      <View style={styles.historySection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment History</Text>
        {MOCK_PLAN.payments
          .filter((p) => p.status === 'completed')
          .reverse()
          .map((payment) => (
            <View
              key={payment.id}
              style={[
                styles.historyItem,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <View style={styles.historyLeft}>
                <View
                  style={[styles.historyIcon, { backgroundColor: theme.colors.successLight }]}
                >
                  <Text style={styles.historyCheckmark}>✓</Text>
                </View>
                <View>
                  <Text style={[styles.historyDate, { color: theme.colors.text }]}>
                    {payment.date}
                  </Text>
                  <Text style={[styles.historyStatus, { color: theme.colors.success }]}>
                    Paid
                  </Text>
                </View>
              </View>
              <Text style={[styles.historyAmount, { color: theme.colors.text }]}>
                {payment.amount}
              </Text>
            </View>
          ))}
      </View>

      {/* Help Section */}
      <View
        style={[
          styles.helpCard,
          { backgroundColor: theme.colors.surface },
          theme.shadow.sm as any,
        ]}
      >
        <Text style={styles.helpIcon}>🆘</Text>
        <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
          Need to adjust your plan?
        </Text>
        <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
          If your situation has changed, chat with Harbor AI to explore modifications.
        </Text>
        <TouchableOpacity
          style={[styles.helpButton, { borderColor: theme.colors.indigo }]}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={[styles.helpButtonText, { color: theme.colors.indigo }]}>
            💬 Chat with Harbor AI
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  statusHeader: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  planType: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  planDates: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  nextPaymentCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  nextPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextPaymentIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  nextPaymentLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  nextPaymentAmount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  nextPaymentDate: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  nextPaymentActions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reminderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
  },
  reminderIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  reminderText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  historySection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyCheckmark: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 14,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  helpCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  helpText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  helpButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default MyPlanScreen;
