import React, { useState } from 'react'
import { motion } from 'framer-motion'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-[44px] h-[26px] rounded-full relative transition-colors ${
        value ? 'bg-indigo-500' : 'bg-slate-600'
      }`}
    >
      <div
        className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${
          value ? 'left-[21px]' : 'left-[3px]'
        }`}
      />
    </button>
  )
}

interface SettingRowProps {
  icon: string
  label: string
  value?: string
  onPress?: () => void
  toggle?: boolean
  toggleValue?: boolean
  onToggle?: (val: boolean) => void
  danger?: boolean
  isLast?: boolean
}

function SettingRow({ icon, label, value, onPress, toggle, toggleValue, onToggle, danger, isLast }: SettingRowProps) {
  return (
    <button
      onClick={toggle ? undefined : onPress}
      className={`flex justify-between items-center w-full px-4 py-3.5 ${
        !isLast ? 'border-b border-slate-700/30' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className={`text-[15px] font-medium ${danger ? 'text-rose-400' : 'text-white'}`}>
          {label}
        </span>
      </div>
      {toggle && onToggle ? (
        <Toggle value={toggleValue!} onChange={onToggle} />
      ) : value ? (
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[13px]">{value}</span>
          <span className="text-slate-600 text-xl font-light">›</span>
        </div>
      ) : (
        <span className="text-slate-600 text-xl font-light">›</span>
      )}
    </button>
  )
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true)
  const [paymentReminders, setPaymentReminders] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="h-full overflow-y-auto phone-scroll bg-slate-950">
      <div className="pb-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center bg-slate-800/80 m-4 rounded-2xl p-5 border border-slate-700/50"
        >
          <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center mr-3.5">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg font-bold">Alex Johnson</h3>
            <p className="text-slate-400 text-[13px] mt-0.5">alex.johnson@email.com</p>
            <p className="text-slate-500 text-xs mt-0.5">(555) 123-4567</p>
          </div>
          <span className="text-indigo-400 font-semibold text-sm">Edit</span>
        </motion.div>

        {/* Connected Accounts */}
        <p className="text-slate-500 text-xs font-bold tracking-wider mx-5 mt-5 mb-2">
          CONNECTED ACCOUNTS
        </p>
        <div className="mx-4 bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50">
          <div className="flex justify-between items-center p-4 border-b border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-blue-500/10 flex items-center justify-center">
                <span className="text-xl">🏦</span>
              </div>
              <div>
                <p className="text-white text-[15px] font-semibold">Chase Bank</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Connected via Plaid · ****8291</p>
              </div>
            </div>
            <div className="bg-emerald-500/10 rounded-lg px-2.5 py-1">
              <span className="text-emerald-400 text-[11px] font-bold">Connected</span>
            </div>
          </div>
          <button className="w-full py-3.5 text-center">
            <span className="text-indigo-400 font-semibold text-sm">+ Connect Another Account</span>
          </button>
        </div>

        {/* Notifications */}
        <p className="text-slate-500 text-xs font-bold tracking-wider mx-5 mt-5 mb-2">
          NOTIFICATIONS
        </p>
        <div className="mx-4 bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50">
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
            isLast
          />
        </div>

        {/* Appearance */}
        <p className="text-slate-500 text-xs font-bold tracking-wider mx-5 mt-5 mb-2">
          APPEARANCE
        </p>
        <div className="mx-4 bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50">
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            toggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
            isLast
          />
        </div>

        {/* Support */}
        <p className="text-slate-500 text-xs font-bold tracking-wider mx-5 mt-5 mb-2">
          SUPPORT
        </p>
        <div className="mx-4 bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50">
          <SettingRow icon="❓" label="Help & FAQ" onPress={() => {}} />
          <SettingRow icon="💬" label="Contact Support" onPress={() => {}} />
          <SettingRow icon="📄" label="Terms of Service" onPress={() => {}} />
          <SettingRow icon="🔒" label="Privacy Policy" onPress={() => {}} isLast />
        </div>

        {/* Account */}
        <p className="text-slate-500 text-xs font-bold tracking-wider mx-5 mt-5 mb-2">
          ACCOUNT
        </p>
        <div className="mx-4 bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50">
          <SettingRow
            icon="🚪"
            label="Sign Out"
            onPress={() => alert('Are you sure you want to sign out?')}
          />
          <SettingRow
            icon="🗑️"
            label="Delete Account"
            danger
            onPress={() => alert('This action is permanent. All your data will be erased.')}
            isLast
          />
        </div>

        {/* Version */}
        <p className="text-slate-500 text-xs text-center mt-6">HarborAI v1.0.0</p>
      </div>
    </div>
  )
}
