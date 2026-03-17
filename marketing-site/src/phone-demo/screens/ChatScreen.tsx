import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import TypingIndicator from '../components/TypingIndicator'
import FinancialSnapshot from '../components/FinancialSnapshot'
import ConsentModal from '../components/ConsentModal'

type ConversationPhase =
  | 'welcome'
  | 'hardship_reason'
  | 'bank_consent'
  | 'analyzing'
  | 'snapshot'
  | 'offer_preview'
  | 'complete'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp?: string
  component?: 'snapshot' | 'offer_preview'
}

const HARDSHIP_REASONS = [
  { label: '💼 Job loss', value: 'job_loss' },
  { label: '🏥 Medical emergency', value: 'medical' },
  { label: '📉 Reduced income', value: 'reduced_income' },
  { label: '🏠 Unexpected expense', value: 'unexpected_expense' },
  { label: '💔 Divorce/Separation', value: 'divorce' },
  { label: '🌪️ Natural disaster', value: 'disaster' },
]

interface ChatScreenProps {
  navigate: (tab: 'home' | 'chat' | 'offers' | 'plan' | 'settings') => void
}

export default function ChatScreen({ navigate }: ChatScreenProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [phase, setPhase] = useState<ConversationPhase>('welcome')
  const [isTyping, setIsTyping] = useState(false)
  const [showConsent, setShowConsent] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [quickReplies, setQuickReplies] = useState<{ label: string; value: string }[]>([])
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const container = scrollContainerRef.current
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 50)
  }, [])

  const addMessage = useCallback((text: string, isUser: boolean, component?: Message['component']) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      text,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      component,
    }
    setMessages((prev) => [...prev, msg])
    return msg
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const simulateAiResponse = useCallback(
    (text: string, delay: number = 1200, component?: Message['component']) => {
      setIsTyping(true)
      setShowQuickReplies(false)
      setTimeout(() => {
        setIsTyping(false)
        addMessage(text, false, component)
      }, delay)
    },
    [addMessage]
  )

  // Initialize conversation
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage(
        "Hey Alex! 👋 I'm Harbor, your financial wellness assistant. I'm really glad you reached out — it takes courage to ask for help, and I'm here to make this as easy as possible for you.",
        false
      )
      setTimeout(() => {
        addMessage(
          "I can see your account is a bit behind. No judgment here — life happens! 💙 Let's figure out the best path forward together.",
          false
        )
        setTimeout(() => {
          addMessage(
            "First things first — what's been going on? Understanding your situation helps me find the best options for you.",
            false
          )
          setPhase('hardship_reason')
          setShowQuickReplies(true)
          setQuickReplies(HARDSHIP_REASONS)
        }, 1500)
      }, 1200)
    }, 800)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAnalysisComplete = useCallback(() => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage("Got it! Here's a snapshot of what I found 📊", false, 'snapshot')
      setTimeout(() => {
        addMessage(
          "Based on your situation, I've put together some really solid options for you. You could save up to 45% on your balance! 🎉",
          false
        )
        setTimeout(() => {
          addMessage("Ready to see your personalized offers?", false)
          setPhase('offer_preview')
          setShowQuickReplies(true)
          setQuickReplies([
            { label: '🎯 View my offers', value: 'view_offers' },
            { label: '🤔 Need more time', value: 'later' },
          ])
        }, 1500)
      }, 1800)
    }, 2000)
  }, [addMessage])

  const handleQuickReply = useCallback((reply: { label: string; value: string }) => {
    addMessage(reply.label, true)
    setShowQuickReplies(false)

    const currentPhase = phaseRef.current

    switch (currentPhase) {
      case 'hardship_reason':
        simulateAiResponse(
          "I'm sorry you're dealing with that. 😔 You're definitely not alone — many people go through this, and there are real options to help.\n\nTo find the best solution for you, it would really help if I could take a quick look at your finances. I can connect securely to your bank — it takes about 30 seconds.",
          1800
        )
        setTimeout(() => {
          setPhase('bank_consent')
          setShowQuickReplies(true)
          setQuickReplies([
            { label: '🔗 Connect my bank', value: 'connect' },
            { label: '✍️ Enter manually', value: 'manual' },
          ])
        }, 3200)
        break

      case 'bank_consent':
        if (reply.value === 'connect') {
          setShowQuickReplies(false)
          setShowConsent(true)
        } else {
          simulateAiResponse(
            "No worries! I can still help. Let me pull together some options based on your account info. Give me just a moment... ⏳",
            1500
          )
          setTimeout(() => handleAnalysisComplete(), 3000)
        }
        break

      case 'offer_preview':
        if (reply.value === 'view_offers') {
          addMessage("Taking you to your personalized offers! 🎉", false)
          setTimeout(() => navigate('offers'), 800)
        } else {
          simulateAiResponse(
            "Of course! Feel free to come back anytime — your offers will be saved. Take all the time you need. 💙",
            1200
          )
          setPhase('complete')
        }
        break

      default:
        break
    }
  }, [addMessage, simulateAiResponse, handleAnalysisComplete, navigate])

  const handleConsentAccept = useCallback(() => {
    setShowConsent(false)
    addMessage('🔗 Connect my bank', true)
    simulateAiResponse(
      "Awesome! Connecting now... 🔒 Your data is fully encrypted and secure.",
      1200
    )
    setTimeout(() => {
      simulateAiResponse("Connected successfully! ✅ Let me analyze your finances real quick...", 1500)
      setTimeout(() => handleAnalysisComplete(), 3000)
    }, 2500)
  }, [addMessage, simulateAiResponse, handleAnalysisComplete])

  const handleConsentDecline = useCallback(() => {
    setShowConsent(false)
    addMessage("I'll enter info manually", true)
    simulateAiResponse(
      "No problem at all! Let me work with what I have on your account. Give me a sec... ⏳",
      1200
    )
    setTimeout(() => handleAnalysisComplete(), 2800)
  }, [addMessage, simulateAiResponse, handleAnalysisComplete])

  const handleSend = () => {
    if (!inputText.trim()) return
    const text = inputText.trim()
    setInputText('')
    addMessage(text, true)
    simulateAiResponse(
      "Thanks for sharing that. Let me factor that into finding the best options for you. 💙",
      1200
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto phone-scroll px-4 py-4" style={{ overscrollBehavior: 'contain' }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.isUser ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-end mb-2"
                >
                  <div
                    className="max-w-[75%] px-4 py-3 rounded-[20px] rounded-tr-[6px] text-white text-[15px] leading-[22px]"
                    style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-end gap-2 mb-2"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">H</span>
                  </div>
                  <div className="max-w-[75%]">
                    <div className="bg-indigo-950/60 px-4 py-3 rounded-[20px] rounded-tl-[6px] text-white text-[15px] leading-[22px] whitespace-pre-line">
                      {msg.text}
                    </div>
                    {msg.timestamp && (
                      <p className="text-slate-500 text-[11px] mt-1 text-right">{msg.timestamp}</p>
                    )}
                  </div>
                </motion.div>
              )}
              {msg.component === 'snapshot' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-10 mb-2"
                >
                  <FinancialSnapshot
                    monthlyIncome="$4,200"
                    monthlyExpenses="$3,650"
                    disposableIncome="$550"
                    debtToIncome="58"
                    creditScore="612"
                  />
                </motion.div>
              )}
            </div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-end gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <div className="bg-indigo-950/60 px-4 py-3 rounded-[20px] rounded-tl-[6px]">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <AnimatePresence>
        {showQuickReplies && quickReplies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2 px-4 py-2"
          >
            {quickReplies.map((reply) => (
              <button
                key={reply.value}
                onClick={() => handleQuickReply(reply)}
                className="border-[1.5px] border-indigo-500 rounded-full px-4 py-2.5 bg-slate-900 active:bg-indigo-500/20 transition-colors"
              >
                <span className="text-indigo-400 font-semibold text-sm">{reply.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2 px-3 py-2.5 bg-slate-900 border-t border-slate-800/50">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-800 text-white rounded-full px-4 py-2.5 text-[15px] placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-indigo-500/50"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            inputText.trim() ? 'bg-indigo-500' : 'bg-slate-800'
          }`}
        >
          <ArrowUp size={18} className={inputText.trim() ? 'text-white' : 'text-slate-500'} />
        </button>
      </div>

      {/* Consent Modal */}
      <ConsentModal
        visible={showConsent}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
    </div>
  )
}
