import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import GradientButton from '../components/GradientButton';

interface HomeScreenProps {
  navigation: any;
}

const MOCK_USER = {
  firstName: 'Alex',
  accountNumber: '****4829',
  product: 'Platinum Credit Card',
  balance: '$12,450.00',
  minPayment: '$375.00',
  dpd: 62,
  dueDate: 'Mar 1, 2026',
  activePlan: null as null | {
    type: string;
    nextPayment: string;
    nextDate: string;
    progress: number;
  },
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [user] = useState(MOCK_USER);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDpdColor = () => {
    if (user.dpd === 0) return theme.colors.success;
    if (user.dpd < 30) return theme.colors.warning;
    return theme.colors.error;
  };

  const getDpdLabel = () => {
    if (user.dpd === 0) return 'Current';
    return `${user.dpd} days past due`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            {getGreeting()} 👋
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{user.firstName}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <Text style={styles.profileInitial}>A</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Account Summary Card */}
      <View style={[styles.accountCard, { backgroundColor: theme.colors.surface }, theme.shadow.md as any]}>
        <View style={styles.accountHeader}>
          <View>
            <Text style={[styles.productName, { color: theme.colors.textSecondary }]}>
              {user.product}
            </Text>
            <Text style={[styles.accountNumber, { color: theme.colors.textTertiary }]}>
              {user.accountNumber}
            </Text>
          </View>
          <View
            style={[
              styles.dpdBadge,
              { backgroundColor: getDpdColor() + '18' },
            ]}
          >
            <View style={[styles.dpdDot, { backgroundColor: getDpdColor() }]} />
            <Text style={[styles.dpdText, { color: getDpdColor() }]}>{getDpdLabel()}</Text>
          </View>
        </View>

        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
            Outstanding Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>
            {user.balance}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>
              Min. Payment
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {user.minPayment}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>
              Due Date
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.error }]}>
              {user.dueDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Hardship CTA */}
      <View style={[styles.ctaCard, theme.shadow.lg as any]}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaEmoji}>🌊</Text>
          <Text style={styles.ctaTitle}>Going through a tough time?</Text>
          <Text style={styles.ctaSubtitle}>
            We're here to help. Chat with Easefinancials to explore options that work for your situation.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={[styles.ctaButtonText, { color: theme.colors.indigo }]}>
              Get Help Now  →
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Active Plan Section */}
      {user.activePlan ? (
        <TouchableOpacity
          style={[styles.planCard, { backgroundColor: theme.colors.surface }, theme.shadow.sm as any]}
          onPress={() => navigation.navigate('MyPlan')}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planIcon}>📋</Text>
            <Text style={[styles.planTitle, { color: theme.colors.text }]}>Your Active Plan</Text>
          </View>
          <View style={[styles.planProgress, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <LinearGradient
              colors={[theme.colors.success, '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.planProgressFill, { width: `${user.activePlan.progress}%` }]}
            />
          </View>
          <Text style={[styles.planDetail, { color: theme.colors.textSecondary }]}>
            Next: {user.activePlan.nextPayment} on {user.activePlan.nextDate}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.noPlanCard, { backgroundColor: theme.colors.surface }, theme.shadow.sm as any]}>
          <Text style={styles.noPlanIcon}>💡</Text>
          <Text style={[styles.noPlanTitle, { color: theme.colors.text }]}>
            No active plans yet
          </Text>
          <Text style={[styles.noPlanText, { color: theme.colors.textSecondary }]}>
            Start a chat with Easefinancials to explore settlement and payment options tailored to you.
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {[
          { icon: '💬', label: 'Chat', screen: 'Chat' },
          { icon: '📊', label: 'Offers', screen: 'Offers' },
          { icon: '📅', label: 'My Plan', screen: 'MyPlan' },
          { icon: '⚙️', label: 'Settings', screen: 'Settings' },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[
              styles.quickAction,
              { backgroundColor: theme.colors.surface },
              theme.shadow.sm as any,
            ]}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={[styles.quickActionLabel, { color: theme.colors.textSecondary }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  accountCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
  },
  accountNumber: {
    fontSize: 13,
    marginTop: 2,
  },
  dpdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dpdDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dpdText: {
    fontSize: 12,
    fontWeight: '700',
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  ctaCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center',
  },
  ctaEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  ctaButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  planProgress: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  planProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  planDetail: {
    fontSize: 13,
  },
  noPlanCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  noPlanIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  noPlanTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  noPlanText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '23%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default HomeScreen;
