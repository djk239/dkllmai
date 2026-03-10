import { motion } from "framer-motion"

// Helper component used to create a togglable button.

function ToggleButton({ active, onToggle, icon: Icon, children }) {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(!active)}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-2
        text-sm font-medium
        px-3 py-1.5
        rounded-lg
        border 
        transition-colors
        ${
          active
            ? "bg-red-600/20 text-red-400 border-red-500/40"
            : "bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.07]"
        }
      `}
    >
      {Icon && <Icon size={14} className="opacity-80" />}
      <span>{children}</span>
    </motion.button>
  )
}

export default ToggleButton