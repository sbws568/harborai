import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, MessageCircle, Target, ClipboardList, Settings, Wifi, Battery, Signal } from 'lucide-react'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import OffersScreen from './screens/OffersScreen'
import MyPlanScreen from './screens/MyPlanScreen'
import SettingsScreen from './screens/SettingsScreen'

type TabId = 'home' | 'chat' | 'offers' | 'plan' | 'settings'

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'offers', label: 'Offers', icon: Target },
  { id: 'plan', label: 'Plan', icon: ClipboardList },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const headerTitles: Record<TabId, string> = {
  home: 'HarborAI',
  chat: 'Harbor AI Chat',
  offers: 'Your Offers',
  plan: 'My Plan',
  settings: 'Settings',
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-white text-xs font-semibold">
      <span>9:41</span>
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[126px] h-[34px] bg-black rounded-b-[20px]" />
      <div className="flex items-center gap-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
      </div>
    </div>
  )
}

interface PhoneAppProps {
  scale?: number
}

export default function PhoneApp({ scale = 0.65 }: PhoneAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>('home')

  const navigate = (tab: TabId) => setActiveTab(tab)

  // Prevent scroll events inside the phone from bubbling to the page
  const stopScrollPropagation = useCallback((e: React.WheelEvent | React.TouchEvent) => {
    e.stopPropagation()
  }, [])

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen navigate={navigate} />
      case 'chat':
        return <ChatScreen navigate={navigate} />
      case 'offers':
        return <OffersScreen navigate={navigate} />
      case 'plan':
        return <MyPlanScreen navigate={navigate} />
      case 'settings':
        return <SettingsScreen />
      default:
        return <HomeScreen navigate={navigate} />
    }
  }

  return (
    <div className="flex items-center justify-center">
      {/* Scale wrapper */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* iPhone 15 Pro Frame */}
        <div className="relative" style={{ width: 390, height: 844 }}>
          {/* Outer glow */}
          <div className="absolute -inset-2 rounded-[56px] bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-sky-500/20 blur-xl" />

          {/* Phone body */}
          <div
            className="relative w-full h-full rounded-[50px] border-[3px] border-slate-700/80 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Screen area */}
            <div
              className="absolute inset-[3px] rounded-[47px] overflow-hidden bg-slate-950 flex flex-col"
              onWheel={stopScrollPropagation}
              onTouchMove={stopScrollPropagation}
              style={{ overscrollBehavior: 'contain' }}
            >
              <StatusBar />

              {/* Header bar */}
              <div className="flex items-center justify-center px-5 py-3 bg-slate-900 border-b border-slate-800/50">
                <span className={`font-extrabold text-lg ${activeTab === 'home' ? 'text-indigo-400' : 'text-white'}`}>
                  {headerTitles[activeTab]}
                </span>
              </div>

              {/* Screen content */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom tab bar */}
              <div className="bg-slate-900 border-t border-slate-800/50 px-2 pt-2 pb-7 flex justify-around items-center">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex flex-col items-center gap-1 min-w-[52px] transition-all"
                    >
                      <Icon
                        size={isActive ? 24 : 22}
                        className={`transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}
                        strokeWidth={isActive ? 2.5 : 1.5}
                      />
                      <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {tab.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
