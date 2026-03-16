import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import OfferCard from '../components/OfferCard';

const OffersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = (offerType: string) => {
    Alert.alert(
      'Accept Offer',
      `Are you sure you want to accept the ${offerType}? This will start your hardship program.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setAccepted(true);
            Alert.alert(
              'You\'re all set! 🎉',
              'Your hardship plan is now active. Head to My Plan to track your progress.',
              [
                {
                  text: 'View My Plan',
                  onPress: () => navigation.navigate('MyPlan'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerEmoji}>🎯</Text>
        <Text style={styles.headerTitle}>Your Personalized Offers</Text>
        <Text style={styles.headerSubtitle}>
          Based on your financial situation, here are the best options we've found for you.
        </Text>
      </LinearGradient>

      {/* Savings highlight */}
      <View
        style={[
          styles.savingsBar,
          { backgroundColor: theme.colors.successLight, borderColor: theme.colors.success },
        ]}
      >
        <Text style={styles.savingsIcon}>💰</Text>
        <Text style={[styles.savingsText, { color: theme.colors.success }]}>
          You could save up to <Text style={styles.savingsBold}>$5,602</Text> on your balance!
        </Text>
      </View>

      {/* Recommended: Settlement */}
      <OfferCard
        title="One-Time Settlement"
        type="settlement"
        recommended
        amount="$6,847"
        savings="$5,603 (45%)"
        timeline="Pay within 60 days"
        bulletPoints={[
          'Biggest savings — nearly half off your balance',
          'Account resolved in one payment',
          'Reported as "settled" to credit bureaus',
          'No more collection calls or late fees',
        ]}
        onAccept={() => handleAccept('settlement offer')}
        onLearnMore={() => {}}
      />

      {/* Alternative: Payment Plan */}
      <OfferCard
        title="6-Month Payment Plan"
        type="payment_plan"
        amount="$1,556/mo"
        savings="$3,114 (25%)"
        timeline="6 monthly payments"
        bulletPoints={[
          'Spread payments over 6 months',
          'Fixed monthly amount — no surprises',
          '0% interest during the plan',
          'Account marked as "in hardship program"',
        ]}
        onAccept={() => handleAccept('payment plan')}
        onLearnMore={() => {}}
      />

      {/* Credit Counseling */}
      <OfferCard
        title="Credit Counseling Referral"
        type="counseling"
        timeline="Free consultation"
        bulletPoints={[
          'Speak with a certified credit counselor',
          'Get a comprehensive debt management plan',
          'May help negotiate with all your creditors',
          'Free and confidential — no obligation',
        ]}
        onLearnMore={() => {
          Alert.alert(
            'Credit Counseling',
            'We partner with NFCC-certified counselors who can help you create a holistic debt management plan. Would you like us to schedule a call?',
            [
              { text: 'Not now', style: 'cancel' },
              { text: 'Schedule Call', onPress: () => {} },
            ]
          );
        }}
      />

      {/* Disclaimer */}
      <View
        style={[
          styles.disclaimerCard,
          { backgroundColor: theme.colors.surfaceSecondary, borderRadius: theme.borderRadius.md },
        ]}
      >
        <Text style={[styles.disclaimerTitle, { color: theme.colors.textSecondary }]}>
          ℹ️ Important Information
        </Text>
        <Text style={[styles.disclaimerText, { color: theme.colors.textTertiary }]}>
          Settlement offers may impact your credit score. Forgiven debt over $600 may be reported as
          taxable income (1099-C). We recommend consulting a tax professional. Offers are valid for 14
          days from today.
        </Text>
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
  header: {
    padding: 28,
    paddingTop: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  savingsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  savingsIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  savingsBold: {
    fontWeight: '800',
    fontSize: 16,
  },
  disclaimerCard: {
    marginHorizontal: 16,
    padding: 16,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default OffersScreen;
