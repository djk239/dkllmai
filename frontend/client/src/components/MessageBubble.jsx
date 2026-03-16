import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { User, Bot, RotateCcw  } from "lucide-react";
import { useChat } from "../context/Context";


/* ======================================
   Code for generating markdown
====================================== */

const heading =
  (Tag, size) =>
  ({ children }) =>
    <Tag className={`${size} font-bold text-white mt-3 mb-2`}>{children}</Tag>;

const Markdown = memo(({ content }) => {
  const clean = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const lang = className?.match(/language-(\w+)/)?.[1];
          const text = String(children).replace(/\n$/, "");

          if (!inline && lang)
            return (
              <div className="my-3 rounded-xl overflow-hidden border border-white/[0.06]">
                <div className="flex justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] text-xs text-neutral-500 font-mono">
                  <span>{lang}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(text)}
                    className="hover:text-red-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter
                  style={tomorrow}
                  language={lang}
                  PreTag="div"
                  customStyle={{ margin: 0, background: "rgba(0,0,0,0.3)", fontSize: "0.85rem" }}
                  {...props}
                >
                  {text}
                </SyntaxHighlighter>
              </div>
            );

          return (
            <code className="bg-white/[0.08] text-red-300 px-1.5 py-0.5 rounded-md text-sm font-mono">
              {children}
            </code>
          );
        },

        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-red-400 hover:text-red-300 underline underline-offset-2 decoration-red-400/30 hover:decoration-red-300/60 transition-colors"
          >
            {children}
          </a>
        ),

        ul: ({ children }) => (
          <ul className="my-2 ml-4 space-y-1 list-disc marker:text-red-500/60 text-neutral-300">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="my-2 ml-4 space-y-1 list-decimal text-neutral-300">
            {children}
          </ol>
        ),

        p: ({ children }) => (
          <p className="my-1.5 leading-relaxed">{children}</p>
        ),

        h1: heading("h1", "text-xl"),
        h2: heading("h2", "text-lg"),
        h3: heading("h3", "text-base"),

        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-red-500/40 pl-4 my-2 text-neutral-400 italic">
            {children}
          </blockquote>
        ),
      }}
    >
      {clean}
    </ReactMarkdown>
  );
});

/* ======================================
   Helper components
====================================== */

const LoadingDots = () => (
  <div className="flex space-x-1.5 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-red-400"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const Avatar = ({ isUser }) => {
  const Icon = isUser ? User : Bot;

  return (
    <div
      className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${
        isUser
          ? "bg-red-500/20 text-red-400 border-red-500/20"
          : "bg-white/[0.05] text-neutral-400 border-white/[0.08]"
      }`}
    >
      <Icon size={16} strokeWidth={1.8} />
    </div>
  );
};

/* ======================================
   Message Bubble function 
====================================== */

export default function MessageBubble({ content, role, isLast }) {
  const { retryLastMessage } = useChat();
  const isUser = role === "user";

  const bubble =
    "px-5 py-3.5 rounded-2xl backdrop-blur-md border text-sm leading-relaxed";

  const variant = isUser
    ? "bg-red-500/[0.12] border-red-500/[0.15] text-neutral-200 rounded-br-md"
    : "bg-white/[0.04] border-white/[0.07] text-neutral-300 rounded-bl-md";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 px-4 md:px-8 mb-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar isUser={isUser} />

      <div className="relative max-w-[75%]">
        <div className={`${bubble} ${variant}`}>
          {content ? <Markdown content={content} /> : <LoadingDots />}
        </div>

        {!isUser && isLast && (
          <button
            onClick={retryLastMessage}
            className="absolute -bottom-5 left-2 text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <RotateCcw size={14} />
            retry
          </button>
        )}
      </div>
    </motion.div>
  );
}