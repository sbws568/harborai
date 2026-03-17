import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors group"
            >
              <span className="text-sm mr-2 opacity-0 group-hover:opacity-100 transition-opacity">ESC</span>
              <X className="w-6 h-6 inline" />
            </button>

            {/* Video container */}
            <div className="rounded-2xl overflow-hidden glass glow-indigo">
              <div className="bg-slate-900/90 p-1">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl">
                  <div className="flex gap-1.5">
                    <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-white/5 text-xs text-slate-500 font-mono">
                      HarborAI — Product Demo
                    </div>
                  </div>
                </div>

                {/* Video */}
                <video
                  src="/demo.mp4"
                  controls
                  autoPlay
                  className="w-full rounded-b-xl"
                  style={{ maxHeight: '80vh' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
