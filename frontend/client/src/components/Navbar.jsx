import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Settings,
  X,
  LogOut,
  Cpu,
  Globe,
  Check,
  LogIn,
} from "lucide-react";
import { fetchConversations, logout as logoutRequest } from "../services/api";
import { useChat } from "../context/Context";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { loadConversation, newChat, selectedModel, setSelectedModel } =
    useChat();
  const { user, setUser } = useAuth();

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Load conversations when sidebar opens
  useEffect(() => {
    if (!isOpen || !user) return;

    const loadConversations = async () => {
      setPage(1);
      setHasMore(true);

      const data = await fetchConversations(1);
      setConversations(data);

      if (data.length < 10) setHasMore(false);
    };

    loadConversations();
  }, [isOpen, user]);

  const handleScroll = async (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <=
      e.target.clientHeight + 50;

    if (bottom && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);

      const data = await fetchConversations(nextPage);
      if (data.length < 10) setHasMore(false);

      setConversations((prev) => [...prev, ...data]);
    }
  };

  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          fixed top-0 left-0 right-0 z-30
          flex items-center justify-between
          px-6 h-16
          bg-neutral-950/60 backdrop-blur-xl
          border-b border-white/[0.06]
        "
      >
        {/* Glow */}
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

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* New Chat */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={newChat}
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
                onClick={() => setIsOpen(true)}
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
            </>
          ) : (
            /* Login Button */
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogin(true)}
              className="
                flex items-center space-x-2
                px-4 py-2 rounded-xl
                bg-red-600/10
                border border-red-500/20
                text-red-400
                hover:bg-red-600/20
                hover:text-red-300
                transition
              "
            >
              <LogIn size={16} />
              <span className="text-sm font-medium">Login</span>
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* SIDEBAR */}
      <AnimatePresence>
        {isOpen && user && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="
                fixed top-0 right-0 z-50
                h-full w-[85%] sm:w-[400px]
                bg-neutral-950
                border-l border-white/[0.06]
                shadow-2xl
                flex flex-col
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="text-white font-semibold tracking-wide">
                  Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/[0.05] transition"
                >
                  <X size={18} className="text-neutral-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Conversation History */}
                <section className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500">
                    Conversation History
                  </h3>

                  <div
                    className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
                    onScroll={handleScroll}
                  >
                    {conversations.map((conv) => (
                      <motion.button
                        key={conv.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          loadConversation(conv.id);
                          setIsOpen(false);
                        }}
                        className="
                          w-full text-left
                          px-4 py-3 rounded-xl
                          bg-white/[0.02]
                          border border-white/[0.06]
                          hover:bg-white/[0.05]
                          transition
                        "
                      >
                        <div className="text-sm text-neutral-200 truncate">
                          {conv.title}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </div>
                      </motion.button>
                    ))}

                    {!hasMore && (
                      <div className="text-xs text-neutral-500 text-center py-2">
                        No more conversations
                      </div>
                    )}
                  </div>
                </section>

                {/* Model Selection */}
                <section className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500">
                    Model Selection
                  </h3>

                  <div className="space-y-2">
                    {[
                      {
                        id: "local",
                        name: "Local Llama",
                        description: "Runs on your machine",
                        icon: Cpu,
                      },
                      {
                        id: "live",
                        name: "Live (Free)",
                        description: "Cloud hosted model",
                        icon: Globe,
                      },
                    ].map((model) => {
                      const Icon = model.icon;
                      const isActive = model.id === selectedModel;

                      return (
                        <motion.button
                          key={model.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedModel(model.id)}
                          className={`
                            w-full flex items-center justify-between
                            px-4 py-3 rounded-xl
                            border transition-all
                            ${
                              isActive
                                ? "bg-red-600/10 border-red-500/30"
                                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                                p-2 rounded-lg
                                ${
                                  isActive
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-white/[0.05] text-neutral-400"
                                }
                              `}
                            >
                              <Icon size={16} />
                            </div>

                            <div className="text-left">
                              <div className="text-sm text-neutral-200">
                                {model.name}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {model.description}
                              </div>
                            </div>
                          </div>

                          {isActive && (
                            <Check size={16} className="text-red-400" />
                          )}
                        </motion.button>
                      );
                    })}

                    <div className="text-xs text-neutral-500 pt-2">
                      Select the AI model used to generate responses.
                    </div>
                  </div>
                </section>

                <div className="border-t border-white/[0.06]" />

                {/* Info Button */}
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl
                    bg-white/[0.02]
                    border border-white/[0.06]
                    text-sm text-neutral-300
                    hover:bg-white/[0.05]
                    transition
                  "
                >
                  App Information
                  <span className="text-neutral-500 text-xs">v1.0</span>
                </motion.button>

                <div className="flex-1" />

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="
                    w-full flex items-center justify-center space-x-2
                    px-4 py-3 rounded-xl
                    bg-red-600/10
                    border border-red-500/20
                    text-red-400
                    hover:bg-red-600/20
                    hover:text-red-300
                    transition
                  "
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Log Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

export default Navbar;