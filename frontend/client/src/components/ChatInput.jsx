import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { Hash, ShieldCheck, FlaskConical   } from "lucide-react";
import ToggleButton from "./ToggleButton";

export default function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  const [options, setOptions] = useState({
    comments: false,
    errorHandling: false,
    includeTests: false,
  });

  const toggleOption = (key) => {
  setOptions((prev) => ({
    ...prev,
    [key]: !prev[key],
  }))
}

  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSend(input, options);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleResize = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center px-4"
    >
      <div className="relative w-full max-w-3xl">
        {/* Glow background */}
        <div className="absolute inset-0 rounded-2xl bg-red-600/10 blur-xl opacity-40 pointer-events-none" />

        <div
          className="
            relative
            flex
            flex-col
            bg-zinc-900/80
            backdrop-blur-xl
            border
            border-zinc-700
            rounded-2xl
            shadow-xl
            px-4
            py-3
            transition
            focus-within:border-red-500
            focus-within:ring-2
            focus-within:ring-red-500/40
          "
        >
          {/* Option buttons */}
          <div className="flex gap-2">
            <ToggleButton
              active={options.comments}
              onToggle={() => toggleOption("comments")}
              icon={Hash}
            >
              Comments
            </ToggleButton>

            <ToggleButton
              active={options.errorHandling}
              onToggle={() => toggleOption("errorHandling")}
              icon={ShieldCheck}
            >
              Error Handling
            </ToggleButton>

            <ToggleButton
              active={options.includeTests}
              onToggle={() => toggleOption("includeTests")}
              icon={FlaskConical}
            >
              Include Tests
            </ToggleButton>
          </div>

          {/* Input and Send */}
          <div className="flex items-end w-full">

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleResize}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="
              flex-1
              resize-none
              bg-transparent
              text-zinc-100
              placeholder-zinc-500
              focus:outline-none
              max-h-40
              pr-3
              "
              />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!input.trim() || loading}
              className={`
                flex items-center justify-center
                h-10 w-10
                rounded-xl
                transition-all
                ${
                  input.trim() && !loading
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }
                `}
                >
              <SendHorizonal size={18} />
            </motion.button>
            </div>
        </div>
      </div>
    </form>
  );
}