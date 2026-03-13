import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

function ChatWindow({ messages, onSend }) {
  const hasMessages = messages && messages.length > 0

  return (
    <div className="relative flex flex-col h-screen w-full bg-neutral-950 overflow-hidden">
      {/* Background logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            // Full logo (no messages)
            <motion.div
              key="full-logo"
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              transition={{
                type: 'spring',
                stiffness: 50,
                damping: 14,
                duration: 1.4,
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 80,
                  damping: 12,
                }}
                className="relative flex flex-col items-center justify-center 
                           px-16 py-12 rounded-3xl
                           bg-white/[0.03] backdrop-blur-xl
                           border border-white/[0.08]
                           shadow-[0_8px_60px_-12px_rgba(220,38,38,0.15)]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.12 }}
                    transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                    className="w-48 h-48 rounded-full bg-red-600 blur-[80px]"
                  />
                </div>

                {/* Letters */}
                <motion.h1
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 10,
                    delay: 0.4,
                  }}
                  className="relative text-9xl font-black tracking-tighter select-none leading-none"
                >
                  <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                    D
                  </span>
                  <span className="bg-gradient-to-b from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">
                    K
                  </span>
                </motion.h1>

                {/* Red line */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: 'easeOut' }}
                  className="mt-4 h-[2px] w-24 rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent origin-center"
                />

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.4, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="mt-4 text-sm text-neutral-400 font-medium tracking-widest uppercase"
                >
                  Start a conversation
                </motion.p>
              </motion.div>

              {/* Reflection */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.06 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-[-1px] w-48 h-12 rounded-b-3xl bg-red-500 blur-2xl"
              />
            </motion.div>
          ) : (
            // Logo (with messages)
            <motion.div
              key="watermark-logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Red glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-red-600/[0.04] blur-[60px]" />
              </div>

              <h1 className="relative text-[12rem] font-black tracking-tighter select-none leading-none opacity-[0.04]">
                <span className="text-white">D</span>
                <span className="text-red-500">K</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message area */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-40 pt-8">
        <MessageList messages={messages} />
      </div>

      {/* Chat input */}
      <div className="relative z-20 shrink-0">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  )
}

export default ChatWindow