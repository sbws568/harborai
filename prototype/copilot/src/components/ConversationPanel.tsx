import React, { useState } from 'react';
import { theme } from '../styles/theme';
import SuggestedResponse from './SuggestedResponse';

// ----- Mock Data -----
interface Message {
  id: string;
  sender: 'agent' | 'customer';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'agent',
    text: "Thank you for calling Harbor Financial, my name is Maria. How can I help you today?",
    timestamp: '10:23:14',
    sentiment: 'neutral',
  },
  {
    id: '2',
    sender: 'customer',
    text: "Hi Maria, I'm calling because I've been having trouble making my auto loan payments. I lost my full-time job about two months ago and I'm only working part-time now.",
    timestamp: '10:23:32',
    sentiment: 'negative',
  },
  {
    id: '3',
    sender: 'agent',
    text: "I'm sorry to hear about your situation, Mr. Patterson. I want you to know we have several options that might help. Can I first verify some information with you?",
    timestamp: '10:23:58',
    sentiment: 'neutral',
  },
  {
    id: '4',
    sender: 'customer',
    text: "Yes, of course. I really don't want to lose my car -- it's my only way to get to work.",
    timestamp: '10:24:15',
    sentiment: 'negative',
  },
  {
    id: '5',
    sender: 'agent',
    text: "I completely understand, and we'll do our best to find a solution. I can see your account here. You're currently 62 days past due with a balance of $18,420. Is that consistent with your understanding?",
    timestamp: '10:24:38',
    sentiment: 'neutral',
  },
  {
    id: '6',
    sender: 'customer',
    text: "Yes, that sounds right. I was able to make a partial payment last month but couldn't cover the full amount. My income dropped from about $4,800 to around $2,900 with part-time work.",
    timestamp: '10:25:02',
    sentiment: 'negative',
  },
];

const mockSuggestion = {
  text: "Based on what you've shared, Mr. Patterson, I'd like to discuss our hardship assistance program. Given your income change, you may qualify for a temporary payment reduction. This could lower your monthly payment to around $290 for the next 6 months while you transition back to full-time employment. Would you like me to walk you through the details?",
  confidence: 87,
};

// Sentiment color helper
const sentimentConfig = {
  positive: { color: theme.colors.success, label: 'Positive', icon: '+' },
  neutral: { color: theme.colors.textTertiary, label: 'Neutral', icon: '~' },
  negative: { color: theme.colors.danger, label: 'Distressed', icon: '!' },
};

const ConversationPanel: React.FC = () => {
  const [notes, setNotes] = useState('Customer reports job loss 2 months ago. Now part-time. Concerned about vehicle repossession.');
  const currentSentiment = 'negative';
  const sentInfo = sentimentConfig[currentSentiment];

  return (
    <div style={styles.panel}>
      {/* Header bar */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerTitle}>Live Conversation</span>
          <span style={styles.msgCount}>{mockMessages.length} messages</span>
        </div>
        <div style={styles.headerRight}>
          {/* Sentiment indicator */}
          <div style={{ ...styles.sentimentBadge, background: `${sentInfo.color}15`, border: `1px solid ${sentInfo.color}30` }}>
            <span style={{ ...styles.sentimentDot, background: sentInfo.color, boxShadow: `0 0 6px ${sentInfo.color}60` }} />
            <span style={{ color: sentInfo.color, fontSize: theme.fontSize.xs, fontWeight: 600 }}>
              {sentInfo.label}
            </span>
          </div>
          {/* Quick actions */}
          <div style={styles.quickActions}>
            <QuickBtn icon="mic" label="Mute" />
            <QuickBtn icon="pause" label="Hold" />
            <QuickBtn icon="arrow" label="Transfer" />
            <QuickBtn icon="x" label="End" danger />
          </div>
        </div>
      </div>

      {/* Message list */}
      <div style={styles.messageList}>
        {mockMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* AI Suggestion */}
        <div style={styles.suggestionArea}>
          <SuggestedResponse
            text={mockSuggestion.text}
            confidence={mockSuggestion.confidence}
            onUse={() => console.log('Use suggestion')}
            onEdit={() => console.log('Edit suggestion')}
            onSkip={() => console.log('Skip suggestion')}
          />
        </div>
      </div>

      {/* Notes area */}
      <div style={styles.notesArea}>
        <div style={styles.notesHeader}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textTertiary} strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span style={styles.notesLabel}>Agent Notes</span>
        </div>
        <textarea
          style={styles.notesInput}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add call notes..."
        />
      </div>
    </div>
  );
};

// ----- Sub-components -----

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isAgent = message.sender === 'agent';
  const sentColor = message.sentiment ? sentimentConfig[message.sentiment].color : theme.colors.textTertiary;

  return (
    <div style={{ ...styles.msgRow, justifyContent: isAgent ? 'flex-start' : 'flex-end' }}>
      <div
        style={{
          ...styles.msgBubble,
          background: isAgent ? theme.colors.agentMsg : theme.colors.customerMsg,
          borderLeft: isAgent ? `2px solid ${theme.colors.accent}` : 'none',
          borderRight: !isAgent ? `2px solid ${theme.colors.info}` : 'none',
          maxWidth: '75%',
        }}
      >
        <div style={styles.msgHeader}>
          <span style={{ ...styles.msgSender, color: isAgent ? theme.colors.accent : theme.colors.info }}>
            {isAgent ? 'Agent (Maria)' : 'Customer (Patterson)'}
          </span>
          <div style={styles.msgMeta}>
            {message.sentiment && (
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: sentColor,
                  display: 'inline-block',
                  boxShadow: `0 0 4px ${sentColor}60`,
                }}
              />
            )}
            <span style={styles.msgTime}>{message.timestamp}</span>
          </div>
        </div>
        <p style={styles.msgText}>{message.text}</p>
      </div>
    </div>
  );
};

const QuickBtn: React.FC<{ icon: string; label: string; danger?: boolean }> = ({ icon, label, danger }) => {
  const iconSvgs: Record<string, React.ReactNode> = {
    mic: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
      </svg>
    ),
    pause: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
    ),
    arrow: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 3 21 3 21 9" />
        <path d="M21 3l-7 7" />
        <path d="M11 13H3v8h8v-8z" />
      </svg>
    ),
    x: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  return (
    <button
      style={{
        ...styles.quickBtn,
        color: danger ? theme.colors.danger : theme.colors.textSecondary,
        borderColor: danger ? `${theme.colors.danger}30` : theme.colors.borderSubtle,
      }}
      title={label}
    >
      {iconSvgs[icon]}
      <span style={{ fontSize: '9px' }}>{label}</span>
    </button>
  );
};

// ----- Styles -----
const styles: Record<string, React.CSSProperties> = {
  panel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: theme.colors.bg,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 600,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
  },
  msgCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    background: theme.colors.elevated,
    padding: '1px 6px',
    borderRadius: theme.radius.sm,
    fontFamily: theme.fonts.mono,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sentimentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: theme.radius.full,
  },
  sentimentDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  quickActions: {
    display: 'flex',
    gap: '4px',
  },
  quickBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1px',
    padding: '4px 8px',
    background: 'transparent',
    border: `1px solid ${theme.colors.borderSubtle}`,
    borderRadius: theme.radius.sm,
    cursor: 'pointer',
    fontFamily: theme.fonts.sans,
    transition: `all ${theme.transition.fast}`,
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  msgRow: {
    display: 'flex',
    width: '100%',
  },
  msgBubble: {
    borderRadius: theme.radius.md,
    padding: '8px 12px',
  },
  msgHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
    gap: '12px',
  },
  msgSender: {
    fontSize: theme.fontSize.xs,
    fontWeight: 700,
    letterSpacing: '0.2px',
  },
  msgMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  msgTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.mono,
  },
  msgText: {
    margin: 0,
    fontSize: theme.fontSize.md,
    lineHeight: '1.5',
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
  },
  suggestionArea: {
    marginTop: '8px',
    paddingLeft: '0',
  },
  notesArea: {
    borderTop: `1px solid ${theme.colors.border}`,
    padding: '8px 16px',
    background: theme.colors.surface,
    flexShrink: 0,
  },
  notesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  notesLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: 600,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  notesInput: {
    width: '100%',
    minHeight: '48px',
    maxHeight: '80px',
    background: theme.colors.bg,
    border: `1px solid ${theme.colors.borderSubtle}`,
    borderRadius: theme.radius.sm,
    padding: '6px 8px',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.sans,
    lineHeight: '1.4',
    resize: 'vertical' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
};

export default ConversationPanel;
