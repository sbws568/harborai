import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ChatBubble from '../components/ChatBubble';
import FinancialSnapshot from '../components/FinancialSnapshot';
import ConsentModal from '../components/ConsentModal';
import { harborApi, TreatmentRecommendation } from '../services/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LocalMessage {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  timestamp?: string;
  component?: 'snapshot';
}

type QuickReply = { label: string; value: string };

// Phase → quick reply mapping
const PHASE_QUICK_REPLIES: Record<string, QuickReply[]> = {
  hardship_reason: [
    { label: '💼 Job loss', value: 'I lost my job recently' },
    { label: '🏥 Medical emergency', value: 'I had a medical emergency' },
    { label: '📉 Reduced income', value: 'My income has reduced significantly' },
    { label: '🏠 Unexpected expense', value: 'I had a large unexpected expense' },
    { label: '💔 Divorce/Separation', value: 'Going through a divorce or separation' },
    { label: '🌪️ Natural disaster', value: 'I was affected by a natural disaster' },
  ],
  product_selection: [
    { label: '💳 Credit Card', value: 'credit card' },
    { label: '🏠 Home Loan', value: 'home loan' },
    { label: '💰 Personal Loan', value: 'personal loan' },
    { label: '🚗 Auto Loan', value: 'auto loan' },
    { label: '🏢 Business Loan', value: 'business loan' },
  ],
  disaster_check: [
    { label: '✅ Yes, I was affected', value: 'Yes, I was affected by a natural disaster' },
    { label: '❌ No, it is not related', value: 'No, this is not related to a disaster' },
  ],
  intent_assessment: [
    { label: '💪 I want to repay', value: 'Yes, I absolutely want to repay my dues' },
    { label: '🤝 Need support first', value: 'I want to repay but need some support to get back on track' },
  ],
  duration_assessment: [
    { label: '⏱️ 1–3 months', value: 'About 1 to 3 months' },
    { label: '📅 4–6 months', value: 'Around 4 to 6 months' },
    { label: '📆 6+ months', value: 'More than 6 months' },
    { label: '❓ Not sure', value: "I'm not sure how long this situation will last" },
  ],
  income_verification: [
    { label: '💼 Salaried', value: 'I am salaried' },
    { label: '🏪 Self-employed', value: 'I am self-employed' },
    { label: '❌ No income right now', value: 'I currently have no income' },
    { label: '👨‍👩‍👧 Family support', value: 'I am supported by family' },
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [apiPhase, setApiPhase] = useState<string>('init');
  const [isTyping, setIsTyping] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [treatment, setTreatment] = useState<TreatmentRecommendation | null>(null);
  const [initError, setInitError] = useState(false);

  const quickReplies = PHASE_QUICK_REPLIES[apiPhase] ?? [];

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const addMessage = useCallback(
    (text: string, isUser: boolean, component?: LocalMessage['component']): LocalMessage => {
      const msg: LocalMessage = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text,
        isUser,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        component,
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Session init
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setIsTyping(true);
      try {
        const session = await harborApi.createSession();
        if (cancelled) return;

        setSessionId(session.session_id);
        setApiPhase(session.phase);

        // Display welcome message(s) from the API
        for (const msg of session.messages) {
          if (msg.role === 'assistant') {
            addMessage(msg.content, false);
          }
        }

        if (session.treatment) setTreatment(session.treatment);
      } catch (err) {
        if (cancelled) return;
        setInitError(true);
        addMessage(
          "Sorry, I'm having trouble connecting right now. Please check your connection and try again.",
          false
        );
      } finally {
        if (!cancelled) setIsTyping(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, [addMessage]);

  // Auto-show consent modal when the AI reaches the consent phase
  useEffect(() => {
    if (apiPhase === 'consent') {
      const timer = setTimeout(() => setShowConsent(true), 600);
      return () => clearTimeout(timer);
    }
  }, [apiPhase]);

  // ---------------------------------------------------------------------------
  // Message sending
  // ---------------------------------------------------------------------------

  const dispatchMessage = useCallback(
    async (content: string) => {
      if (!sessionId || isTyping) return;

      addMessage(content, true);
      setIsTyping(true);

      try {
        const resp = await harborApi.sendMessage(sessionId, content);
        addMessage(resp.message.content, false);

        if (resp.phase_changed) {
          setApiPhase(resp.phase);
        }

        // Fetch treatment when we reach the recommendation phase
        if (
          resp.phase === 'treatment_recommendation' ||
          resp.phase === 'complete'
        ) {
          try {
            const t = await harborApi.getTreatment(sessionId);
            setTreatment(t);
          } catch {
            // Not ready yet — that is fine
          }
        }
      } catch (err) {
        addMessage(
          "I had trouble processing that. Could you try again? 💙",
          false
        );
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId, isTyping, addMessage]
  );

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    dispatchMessage(text);
  };

  const handleQuickReply = (reply: QuickReply) => {
    dispatchMessage(reply.value);
  };

  // ---------------------------------------------------------------------------
  // Consent handlers
  // ---------------------------------------------------------------------------

  const handleConsentAccept = useCallback(async () => {
    setShowConsent(false);
    if (!sessionId) return;

    try {
      await harborApi.grantConsent(sessionId, { bureau_consent: true });
    } catch (err) {
      // Non-fatal — the conversation can continue
    }

    dispatchMessage('Yes, I consent to the credit bureau check');
  }, [sessionId, dispatchMessage]);

  const handleConsentDecline = useCallback(() => {
    setShowConsent(false);
    dispatchMessage("I'd prefer not to share my credit report right now");
  }, [dispatchMessage]);

  // ---------------------------------------------------------------------------
  // Treatment CTA
  // ---------------------------------------------------------------------------

  const handleViewOffers = () => {
    if (treatment) {
      navigation.navigate('Offers', { treatment });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const renderMessage = ({ item }: { item: LocalMessage }) => {
    if (item.component === 'snapshot') {
      return (
        <View style={styles.componentMessage}>
          <ChatBubble message={item.text} isUser={false} />
          <View style={styles.snapshotContainer}>
            <FinancialSnapshot
              monthlyIncome="₹42,000"
              monthlyExpenses="₹31,000"
              disposableIncome="₹11,000"
              debtToIncome="74"
              creditScore="642"
            />
          </View>
        </View>
      );
    }
    return (
      <ChatBubble message={item.text} isUser={item.isUser} timestamp={item.timestamp} />
    );
  };

  const renderFooter = () => {
    if (isTyping) return <ChatBubble message="" isUser={false} isTyping />;
    return null;
  };

  const showTreatmentCta =
    treatment &&
    (apiPhase === 'treatment_recommendation' || apiPhase === 'complete');

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Treatment CTA */}
      {showTreatmentCta && (
        <View
          style={[
            styles.treatmentBanner,
            { backgroundColor: theme.colors.indigo, borderColor: theme.colors.indigo },
          ]}
        >
          <Text style={styles.treatmentBannerText}>
            🎯 {treatment!.headline}
          </Text>
          <TouchableOpacity
            style={[styles.treatmentButton, { backgroundColor: '#FFFFFF' }]}
            onPress={handleViewOffers}
          >
            <Text style={[styles.treatmentButtonText, { color: theme.colors.indigo }]}>
              View Offer
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick replies */}
      {!showTreatmentCta && quickReplies.length > 0 && (
        <View style={styles.quickRepliesContainer}>
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.value}
              style={[
                styles.quickReply,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.indigo,
                },
              ]}
              onPress={() => handleQuickReply(reply)}
              activeOpacity={0.7}
              disabled={isTyping}
            >
              <Text style={[styles.quickReplyText, { color: theme.colors.indigo }]}>
                {reply.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Text input */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.borderLight,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surfaceSecondary,
              color: theme.colors.text,
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!initError}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                inputText.trim() && !isTyping
                  ? theme.colors.indigo
                  : theme.colors.surfaceSecondary,
            },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <Text
            style={[
              styles.sendIcon,
              {
                color:
                  inputText.trim() && !isTyping
                    ? '#FFFFFF'
                    : theme.colors.textTertiary,
              },
            ]}
          >
            ↑
          </Text>
        </TouchableOpacity>
      </View>

      <ConsentModal
        visible={showConsent}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
    </KeyboardAvoidingView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesList: { paddingVertical: 16 },
  componentMessage: { marginVertical: 4 },
  snapshotContainer: { paddingHorizontal: 16, marginTop: 8 },
  treatmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  treatmentBannerText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  treatmentButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  treatmentButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  quickReply: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  quickReplyText: { fontWeight: '600', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendIcon: { fontSize: 18, fontWeight: '800' },
});

export default ChatScreen;
