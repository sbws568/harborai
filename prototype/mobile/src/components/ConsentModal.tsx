import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import GradientButton from './GradientButton';

interface ConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ visible, onAccept, onDecline }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: theme.colors.surface,
            },
            theme.shadow.lg as any,
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.icon}>🏦</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Connect Your Bank Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            To find the best hardship options for you, we need to take a quick peek at your finances.
          </Text>

          <View
            style={[
              styles.infoSection,
              { backgroundColor: theme.colors.surfaceSecondary, borderRadius: theme.borderRadius.md },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              What we'll access:
            </Text>
            {[
              { icon: '💵', text: 'Income verification (last 3 months)' },
              { icon: '📊', text: 'Monthly spending patterns' },
              { icon: '💳', text: 'Existing debt obligations' },
            ].map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoIcon}>{item.icon}</Text>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.securitySection,
              { borderColor: theme.colors.success, backgroundColor: theme.colors.successLight },
            ]}
          >
            <Text style={styles.securityIcon}>🔒</Text>
            <View style={styles.securityTextContainer}>
              <Text style={[styles.securityTitle, { color: theme.colors.success }]}>
                Bank-level security
              </Text>
              <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
                Powered by Plaid. We never store your login credentials. Your data is encrypted end-to-end.
              </Text>
            </View>
          </View>

          <GradientButton
            title="Connect My Bank"
            onPress={onAccept}
            icon="🔗"
            size="lg"
            style={{ marginTop: 16 }}
          />

          <TouchableOpacity onPress={onDecline} style={styles.declineButton}>
            <Text style={[styles.declineText, { color: theme.colors.textTertiary }]}>
              Not now, I'll enter info manually
            </Text>
          </TouchableOpacity>

          <Text style={[styles.legal, { color: theme.colors.textTertiary }]}>
            By connecting, you agree to our Privacy Policy and authorize HarborAI to retrieve your financial data for hardship assessment purposes only.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoSection: {
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  securitySection: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  securityText: {
    fontSize: 12,
    lineHeight: 18,
  },
  declineButton: {
    alignItems: 'center',
    marginTop: 14,
  },
  declineText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legal: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 15,
  },
});

export default ConsentModal;
