import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
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
            { backgroundColor: theme.colors.surface },
            theme.shadow.lg as any,
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.icon}>📋</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Credit Report Consent
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            To find you the best hardship relief options, we'd like to check your
            credit report with Experian and CIBIL. This is used only for your
            assessment — it won't affect your credit score.
          </Text>

          <View
            style={[
              styles.infoSection,
              { backgroundColor: theme.colors.surfaceSecondary, borderRadius: theme.borderRadius.md },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              What we'll check:
            </Text>
            {[
              { icon: '📊', text: 'Credit score (Experian & CIBIL)' },
              { icon: '💳', text: 'Outstanding loan & card balances' },
              { icon: '📅', text: 'Payment history (last 12 months)' },
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
              styles.complianceSection,
              { borderColor: theme.colors.success, backgroundColor: theme.colors.successLight },
            ]}
          >
            <Text style={styles.complianceIcon}>🔒</Text>
            <View style={styles.complianceTextContainer}>
              <Text style={[styles.complianceTitle, { color: theme.colors.success }]}>
                RBI-compliant & confidential
              </Text>
              <Text style={[styles.complianceText, { color: theme.colors.textSecondary }]}>
                Your consent is recorded per RBI guidelines. Credit data is used
                solely for this hardship assessment and never shared.
              </Text>
            </View>
          </View>

          <GradientButton
            title="I Consent to Credit Check"
            onPress={onAccept}
            icon="✅"
            size="lg"
            style={{ marginTop: 16 }}
          />

          <TouchableOpacity onPress={onDecline} style={styles.declineButton}>
            <Text style={[styles.declineText, { color: theme.colors.textTertiary }]}>
              Skip for now — I'll proceed without it
            </Text>
          </TouchableOpacity>

          <Text style={[styles.legal, { color: theme.colors.textTertiary }]}>
            By consenting, you authorise Easefinancials to retrieve your credit report
            from Experian India and TransUnion CIBIL for hardship assessment
            purposes only, as permitted under the Credit Information Companies
            (Regulation) Act, 2005.
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
  icon: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  infoSection: { padding: 16, marginBottom: 16 },
  infoTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  infoIcon: { fontSize: 18, marginRight: 10 },
  infoText: { fontSize: 14, flex: 1 },
  complianceSection: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
  },
  complianceIcon: { fontSize: 20, marginRight: 10, marginTop: 2 },
  complianceTextContainer: { flex: 1 },
  complianceTitle: { fontWeight: '700', fontSize: 14, marginBottom: 2 },
  complianceText: { fontSize: 12, lineHeight: 18 },
  declineButton: { alignItems: 'center', marginTop: 14 },
  declineText: { fontSize: 14, fontWeight: '500' },
  legal: { fontSize: 10, textAlign: 'center', marginTop: 16, lineHeight: 15 },
});

export default ConsentModal;
