import { useState } from "react";
import { sendMessage } from "./services/api";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [messages, setMessages] = useState([]);

  const handleSend = async (userMessage, options) => {
    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Append empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // Stream assistant response
    let assistantIndex = messages.length + 1; // index of last assistant message

    await sendMessage(userMessage, options, 1, (chunk) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantIndex] = {
          ...newMessages[assistantIndex],
          content: (newMessages[assistantIndex].content || "") + chunk
        };
        return newMessages;
      });
    });
  };

  return (
    <div >
      <ChatWindow messages={messages} onSend={handleSend} />
    </div>
  );
}

export default App;