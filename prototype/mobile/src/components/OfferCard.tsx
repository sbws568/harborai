import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface OfferCardProps {
  title: string;
  type: 'settlement' | 'payment_plan' | 'counseling';
  amount?: string;
  savings?: string;
  timeline?: string;
  bulletPoints: string[];
  recommended?: boolean;
  onAccept?: () => void;
  onLearnMore?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  title,
  type,
  amount,
  savings,
  timeline,
  bulletPoints,
  recommended = false,
  onAccept,
  onLearnMore,
}) => {
  const { theme } = useTheme();

  const getTypeIcon = () => {
    switch (type) {
      case 'settlement': return '💰';
      case 'payment_plan': return '📅';
      case 'counseling': return '🤝';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'settlement': return theme.colors.success;
      case 'payment_plan': return theme.colors.indigo;
      case 'counseling': return theme.colors.warning;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: recommended ? theme.colors.indigo : theme.colors.border,
          borderWidth: recommended ? 2 : 1,
        },
        theme.shadow.md as any,
      ]}
    >
      {recommended && (
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.recommendedBadge}
        >
          <Text style={styles.recommendedText}>⭐ Recommended for you</Text>
        </LinearGradient>
      )}

      <View style={styles.header}>
        <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          {timeline && (
            <Text style={[styles.timeline, { color: theme.colors.textSecondary }]}>
              {timeline}
            </Text>
          )}
        </View>
      </View>

      {(amount || savings) && (
        <View
          style={[
            styles.amountSection,
            { backgroundColor: theme.colors.surfaceSecondary, borderRadius: theme.borderRadius.md },
          ]}
        >
          {amount && (
            <View style={styles.amountRow}>
              <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
                Amount
              </Text>
              <Text style={[styles.amountValue, { color: theme.colors.text }]}>{amount}</Text>
            </View>
          )}
          {savings && (
            <View style={styles.amountRow}>
              <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
                You save
              </Text>
              <Text style={[styles.savingsValue, { color: theme.colors.success }]}>{savings}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.bulletSection}>
        {bulletPoints.map((point, index) => (
          <View key={index} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: getTypeColor() }]} />
            <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
              {point}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {onAccept && (
          <TouchableOpacity onPress={onAccept} activeOpacity={0.8}>
            <LinearGradient
              colors={
                recommended
                  ? [theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]
                  : [getTypeColor(), getTypeColor()]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.acceptButton}
            >
              <Text style={styles.acceptText}>Accept This Offer</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {onLearnMore && (
          <TouchableOpacity onPress={onLearnMore} style={styles.learnMore}>
            <Text style={[styles.learnMoreText, { color: theme.colors.indigo }]}>
              Learn more
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    alignItems: 'center',
  },
  recommendedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  timeline: {
    fontSize: 13,
    marginTop: 2,
  },
  amountSection: {
    padding: 16,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  amountLabel: {
    fontSize: 14,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  savingsValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  bulletSection: {
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  actions: {
    marginTop: 4,
  },
  acceptButton: {
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  learnMore: {
    alignItems: 'center',
    marginTop: 12,
  },
  learnMoreText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default OfferCard;
