import { createContext, useContext, useState } from "react";
import {
  sendMessage,
  fetchConversationMessages,
} from "../src//services/api";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [currentOptions, setCurrentOptions] = useState({});

  const userId = 1; // replace later with auth

  /* =========================
     LOAD EXISTING CONVERSATION
  ========================= */
  const loadConversation = async (id) => {
    try {
      const data = await fetchConversationMessages(id);
      setConversationId(id);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  /* =========================
     START NEW CHAT
  ========================= */
  const newChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async (userMessage, options) => {
    let assistantIndex;

    setCurrentOptions(options);

    // Add user + assistant placeholder
    setMessages((prev) => {
      const updated = [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: "" },
      ];
      assistantIndex = updated.length - 1;
      return updated;
    });

    await sendMessage(
      userMessage,
      options,
      userId,
      conversationId,
      (chunk, returnedConversationId) => {
        if (!conversationId && returnedConversationId) {
          setConversationId(returnedConversationId);
        }

        setMessages((prev) => {
          const updated = [...prev];

          updated[assistantIndex] = {
            ...updated[assistantIndex],
            content:
              (updated[assistantIndex].content || "") + chunk,
          };

          return updated;
        });
      }
    );
  };

  /* =========================
     RETRY LAST MESSAGE
  ========================= */
  const retryLastMessage = async () => {
    if (!conversationId || messages.length < 2) return;

    const lastMessage = messages[messages.length - 1];
    const previousMessage = messages[messages.length - 2];

    if (lastMessage.role !== "assistant") return;
    if (previousMessage.role !== "user") return;

    setMessages((prev) => prev.slice(0, -1));

    let assistantIndex;

    setMessages((prev) => {
      const updated = [...prev, { role: "assistant", content: "" }];
      assistantIndex = updated.length - 1;
      return updated;
    });

    await sendMessage(
      previousMessage.content,
      currentOptions, // ✅ real stored options
      userId,
      conversationId,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];

          updated[assistantIndex] = {
            ...updated[assistantIndex],
            content:
              (updated[assistantIndex].content || "") + chunk,
          };

          return updated;
        });
      }
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversationId,
        handleSend,
        loadConversation,
        newChat,
        retryLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}