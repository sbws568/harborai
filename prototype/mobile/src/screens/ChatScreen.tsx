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
import GradientButton from '../components/GradientButton';

type ConversationPhase =
  | 'welcome'
  | 'hardship_reason'
  | 'bank_consent'
  | 'analyzing'
  | 'snapshot'
  | 'offer_preview'
  | 'complete';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  timestamp?: string;
  component?: 'snapshot' | 'offer_preview';
}

const HARDSHIP_REASONS = [
  { label: '💼 Job loss', value: 'job_loss' },
  { label: '🏥 Medical emergency', value: 'medical' },
  { label: '📉 Reduced income', value: 'reduced_income' },
  { label: '🏠 Unexpected expense', value: 'unexpected_expense' },
  { label: '💔 Divorce/Separation', value: 'divorce' },
  { label: '🌪️ Natural disaster', value: 'disaster' },
];

const ChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [phase, setPhase] = useState<ConversationPhase>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [quickReplies, setQuickReplies] = useState<{ label: string; value: string }[]>([]);

  const addMessage = useCallback((text: string, isUser: boolean, component?: Message['component']) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      text,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      component,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const simulateAiResponse = useCallback(
    (text: string, delay: number = 1200, component?: Message['component']) => {
      setIsTyping(true);
      setShowQuickReplies(false);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(text, false, component);
      }, delay);
    },
    [addMessage]
  );

  // Initialize conversation
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage(
        "Hey Alex! 👋 I'm Harbor, your financial wellness assistant. I'm really glad you reached out — it takes courage to ask for help, and I'm here to make this as easy as possible for you.",
        false
      );
      setTimeout(() => {
        addMessage(
          "I can see your account is a bit behind. No judgment here — life happens! 💙 Let's figure out the best path forward together.",
          false
        );
        setTimeout(() => {
          addMessage(
            "First things first — what's been going on? Understanding your situation helps me find the best options for you.",
            false
          );
          setPhase('hardship_reason');
          setShowQuickReplies(true);
          setQuickReplies(HARDSHIP_REASONS);
        }, 1500);
      }, 1200);
    }, 800);

    return () => clearTimeout(timer);
  }, [addMessage]);

  const handleQuickReply = (reply: { label: string; value: string }) => {
    addMessage(reply.label, true);
    setShowQuickReplies(false);

    switch (phase) {
      case 'hardship_reason':
        simulateAiResponse(
          "I'm sorry you're dealing with that. 😔 You're definitely not alone — many people go through this, and there are real options to help.\n\nTo find the best solution for you, it would really help if I could take a quick look at your finances. I can connect securely to your bank — it takes about 30 seconds.",
          1800
        );
        setTimeout(() => {
          setPhase('bank_consent');
          setShowQuickReplies(true);
          setQuickReplies([
            { label: '🔗 Connect my bank', value: 'connect' },
            { label: '✍️ Enter manually', value: 'manual' },
          ]);
        }, 3200);
        break;

      case 'bank_consent':
        if (reply.value === 'connect') {
          setShowQuickReplies(false);
          setShowConsent(true);
        } else {
          simulateAiResponse(
            "No worries! I can still help. Let me pull together some options based on your account info. Give me just a moment... ⏳",
            1500
          );
          setTimeout(() => handleAnalysisComplete(), 3000);
        }
        break;

      case 'offer_preview':
        if (reply.value === 'view_offers') {
          addMessage("Taking you to your personalized offers! 🎉", false);
          setTimeout(() => navigation.navigate('Offers'), 800);
        } else {
          simulateAiResponse(
            "Of course! Feel free to come back anytime — your offers will be saved. Take all the time you need. 💙",
            1200
          );
          setPhase('complete');
        }
        break;

      default:
        break;
    }
  };

  const handleAnalysisComplete = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(
        "Got it! Here's a snapshot of what I found 📊",
        false,
        'snapshot'
      );
      setTimeout(() => {
        addMessage(
          "Based on your situation, I've put together some really solid options for you. You could save up to 45% on your balance! 🎉",
          false
        );
        setTimeout(() => {
          addMessage(
            "Ready to see your personalized offers?",
            false
          );
          setPhase('offer_preview');
          setShowQuickReplies(true);
          setQuickReplies([
            { label: '🎯 View my offers', value: 'view_offers' },
            { label: '🤔 Need more time', value: 'later' },
          ]);
        }, 1500);
      }, 1800);
    }, 2000);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    addMessage('🔗 Connect my bank', true);
    simulateAiResponse(
      "Awesome! Connecting now... 🔒 Your data is fully encrypted and secure.",
      1200
    );
    setTimeout(() => {
      simulateAiResponse("Connected successfully! ✅ Let me analyze your finances real quick...", 1500);
      setTimeout(() => handleAnalysisComplete(), 3000);
    }, 2500);
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
    addMessage("I'll enter info manually", true);
    simulateAiResponse(
      "No problem at all! Let me work with what I have on your account. Give me a sec... ⏳",
      1200
    );
    setTimeout(() => handleAnalysisComplete(), 2800);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    addMessage(text, true);

    // Generic response for free-text input
    simulateAiResponse(
      "Thanks for sharing that. Let me factor that into finding the best options for you. 💙",
      1200
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.component === 'snapshot') {
      return (
        <View style={styles.componentMessage}>
          <ChatBubble message={item.text} isUser={false} />
          <View style={styles.snapshotContainer}>
            <FinancialSnapshot
              monthlyIncome="$4,200"
              monthlyExpenses="$3,650"
              disposableIncome="$550"
              debtToIncome="58"
              creditScore="612"
            />
          </View>
        </View>
      );
    }

    return <ChatBubble message={item.text} isUser={item.isUser} timestamp={item.timestamp} />;
  };

  const renderFooter = () => {
    if (isTyping) {
      return <ChatBubble message="" isUser={false} isTyping />;
    }
    return null;
  };

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

      {/* Quick replies */}
      {showQuickReplies && quickReplies.length > 0 && (
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
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim()
                ? theme.colors.indigo
                : theme.colors.surfaceSecondary,
            },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text
            style={[
              styles.sendIcon,
              { color: inputText.trim() ? '#FFFFFF' : theme.colors.textTertiary },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
  },
  componentMessage: {
    marginVertical: 4,
  },
  snapshotContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
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
  quickReplyText: {
    fontWeight: '600',
    fontSize: 14,
  },
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
  sendIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
});

export default ChatScreen;
