import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus } from "lucide-react";
import {
  login as loginRequest,
  register as registerRequest,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function LoginModal({ isOpen, onClose }) {
  const { setUser } = useAuth();

  const [tab, setTab] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const switchTab = (newTab) => {
    resetForm();
    setTab(newTab);
  };

  const fetchUser = async () => {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    return res.json();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginRequest(email, password);

      const userData = await fetchUser();
      setUser(userData);

      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerRequest(username, email, password);

      const userData = await fetchUser();
      setUser(userData);

      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (tab === "login") handleLogin();
    else handleRegister();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="
              fixed z-50
              top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-[90%] max-w-md
              bg-neutral-950
              border border-white/[0.06]
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >
            {/* Red glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-72 h-32 bg-red-600/10 blur-3xl opacity-40" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 select-none">
                  <span className="text-xl font-black tracking-tight text-white">
                    D
                  </span>
                  <span className="text-xl font-black tracking-tight text-red-500">
                    K
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-white/[0.08]" />
                <h2 className="text-white font-semibold tracking-wide">
                  {tab === "login" ? "Welcome Back" : "Create Account"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/[0.05] transition"
              >
                <X size={18} className="text-neutral-400" />
              </button>
            </div>

            {/* Body */}
            <div className="relative p-6 space-y-6">
              <div className="flex gap-2">
                {[
                  { id: "login", label: "Login", icon: LogIn },
                  { id: "register", label: "Register", icon: UserPlus },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = tab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => switchTab(item.id)}
                      className={`
                        flex-1 flex items-center justify-center space-x-2
                        py-3 rounded-xl
                        border text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-red-600/10 border-red-500/30 text-red-400"
                            : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200"
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tab === "login" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500">
                    {tab === "login" ? "Your Credentials" : "Account Details"}
                  </h3>

                  {tab === "register" && (
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-white/[0.02]
                        border border-white/[0.06]
                        text-sm text-neutral-200
                        placeholder-neutral-500
                        outline-none
                        focus:bg-white/[0.05]
                        focus:border-red-500/30
                        transition-all
                      "
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/[0.02]
                      border border-white/[0.06]
                      text-sm text-neutral-200
                      placeholder-neutral-500
                      outline-none
                      focus:bg-white/[0.05]
                      focus:border-red-500/30
                      transition-all
                    "
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/[0.02]
                      border border-white/[0.06]
                      text-sm text-neutral-200
                      placeholder-neutral-500
                      outline-none
                      focus:bg-white/[0.05]
                      focus:border-red-500/30
                      transition-all
                    "
                  />

                  {tab === "register" && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-white/[0.02]
                        border border-white/[0.06]
                        text-sm text-neutral-200
                        placeholder-neutral-500
                        outline-none
                        focus:bg-white/[0.05]
                        focus:border-red-500/30
                        transition-all
                      "
                    />
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="
                        flex items-center px-4 py-3 rounded-xl
                        bg-red-600/10
                        border border-red-500/20
                        text-red-400 text-sm
                      "
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-white/[0.06]" />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`
                      w-full flex items-center justify-center space-x-2
                      py-3 rounded-xl
                      border text-sm font-medium
                      transition-all
                      ${
                        loading
                          ? "bg-red-600/10 border-red-500/20 text-red-400/50 cursor-not-allowed"
                          : "bg-red-600/10 border-red-500/20 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                      }
                    `}
                  >
                    {tab === "login" ? (
                      <LogIn size={16} />
                    ) : (
                      <UserPlus size={16} />
                    )}
                    <span>
                      {loading
                        ? tab === "login"
                          ? "Logging in..."
                          : "Creating account..."
                        : tab === "login"
                        ? "Login"
                        : "Create Account"}
                    </span>
                  </motion.button>

                  <p className="text-center text-xs text-neutral-500 pt-1">
                    {tab === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <span
                          onClick={() => switchTab("register")}
                          className="text-red-400 cursor-pointer hover:text-red-300 transition"
                        >
                          Register
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <span
                          onClick={() => switchTab("login")}
                          className="text-red-400 cursor-pointer hover:text-red-300 transition"
                        >
                          Login
                        </span>
                      </>
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;