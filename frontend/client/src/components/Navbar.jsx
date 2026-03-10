import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Settings } from 'lucide-react'

function Navbar({ onNewChat }) {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="
        fixed top-0 left-0 right-0 z-30
        flex items-center justify-between
        px-6 h-16
        bg-neutral-950/60 backdrop-blur-xl
        border-b border-white/[0.06]
      "
    >
      {/* Red Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 w-72 h-24 bg-red-600/10 blur-3xl opacity-40" />
      </div>

      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative flex items-center space-x-1 cursor-pointer select-none"
      >
        <span className="text-xl font-black tracking-tight text-white">
          D
        </span>
        <span className="text-xl font-black tracking-tight text-red-500">
          K
        </span>
      </motion.div>

      {/* Title */}
      <div className="text-xs tracking-widest uppercase text-neutral-500 font-medium">
        
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* New Chat */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
          className="
            flex items-center justify-center
            w-9 h-9 rounded-xl
            bg-white/[0.03]
            border border-white/[0.08]
            hover:bg-white/[0.06]
            transition-colors
          "
        >
          <Plus size={18} className="text-neutral-300" />
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 45 }}
          whileTap={{ scale: 0.95 }}
          className="
            flex items-center justify-center
            w-9 h-9 rounded-xl
            bg-white/[0.03]
            border border-white/[0.08]
            hover:bg-white/[0.06]
            transition-colors
          "
        >
          <Settings size={18} className="text-neutral-400" />
        </motion.button>
      </div>
    </motion.nav>
  )
}

export default Navbar