import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  value,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  danger,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: theme.colors.borderLight }]}
      onPress={onPress}
      disabled={toggle}
      activeOpacity={0.6}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <Text
          style={[
            styles.rowLabel,
            { color: danger ? theme.colors.error : theme.colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
      {toggle && onToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.indigo + '60' }}
          thumbColor={toggleValue ? theme.colors.indigo : theme.colors.textTertiary}
        />
      ) : value ? (
        <View style={styles.rowRight}>
          <Text style={[styles.rowValue, { color: theme.colors.textSecondary }]}>{value}</Text>
          <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
        </View>
      ) : (
        <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }, theme.shadow.sm as any]}>
        <View style={[styles.profileAvatar, { backgroundColor: theme.colors.indigo }]}>
          <Text style={styles.profileInitial}>A</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>Alex Johnson</Text>
          <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
            alex.johnson@email.com
          </Text>
          <Text style={[styles.profilePhone, { color: theme.colors.textTertiary }]}>
            (555) 123-4567
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.editButton, { color: theme.colors.indigo }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Connected Accounts */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        CONNECTED ACCOUNTS
      </Text>
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.connectedAccount, { borderBottomColor: theme.colors.borderLight }]}>
          <View style={styles.connectedLeft}>
            <View style={[styles.bankIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.bankEmoji}>🏦</Text>
            </View>
            <View>
              <Text style={[styles.bankName, { color: theme.colors.text }]}>Chase Bank</Text>
              <Text style={[styles.bankDetail, { color: theme.colors.textTertiary }]}>
                Connected via Plaid · ****8291
              </Text>
            </View>
          </View>
          <View style={[styles.connectedBadge, { backgroundColor: theme.colors.successLight }]}>
            <Text style={[styles.connectedBadgeText, { color: theme.colors.success }]}>
              Connected
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addAccountRow}>
          <Text style={[styles.addAccountText, { color: theme.colors.indigo }]}>
            + Connect Another Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        NOTIFICATIONS
      </Text>
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <SettingRow
          icon="🔔"
          label="Push Notifications"
          toggle
          toggleValue={notifications}
          onToggle={setNotifications}
        />
        <SettingRow
          icon="📅"
          label="Payment Reminders"
          toggle
          toggleValue={paymentReminders}
          onToggle={setPaymentReminders}
        />
        <SettingRow
          icon="📧"
          label="Email Updates"
          value="Weekly"
          onPress={() => {}}
        />
      </View>

      {/* Appearance */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        APPEARANCE
      </Text>
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <SettingRow
          icon="🌙"
          label="Dark Mode"
          toggle
          toggleValue={isDark}
          onToggle={toggleTheme}
        />
      </View>

      {/* Support */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        SUPPORT
      </Text>
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <SettingRow icon="❓" label="Help & FAQ" onPress={() => {}} />
        <SettingRow icon="💬" label="Contact Support" onPress={() => {}} />
        <SettingRow icon="📄" label="Terms of Service" onPress={() => {}} />
        <SettingRow icon="🔒" label="Privacy Policy" onPress={() => {}} />
      </View>

      {/* Danger Zone */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        ACCOUNT
      </Text>
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <SettingRow
          icon="🚪"
          label="Sign Out"
          onPress={() =>
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive' },
            ])
          }
        />
        <SettingRow
          icon="🗑️"
          label="Delete Account"
          danger
          onPress={() =>
            Alert.alert(
              'Delete Account',
              'This action is permanent. All your data will be erased.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive' },
              ]
            )
          }
        />
      </View>

      {/* Version */}
      <Text style={[styles.version, { color: theme.colors.textTertiary }]}>
        Easefinancials v1.0.0
      </Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 12,
    marginTop: 1,
  },
  editButton: {
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 13,
    marginRight: 6,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
  connectedAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
  },
  connectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankEmoji: {
    fontSize: 20,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '600',
  },
  bankDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  connectedBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  connectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  addAccountRow: {
    padding: 14,
    alignItems: 'center',
  },
  addAccountText: {
    fontWeight: '600',
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default SettingsScreen;
