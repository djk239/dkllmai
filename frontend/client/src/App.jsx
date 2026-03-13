import { useChat } from "./context";
import ChatWindow from "./components/ChatWindow";

function App() {
  const { messages, handleSend } = useChat();

  return (
    <ChatWindow
      messages={messages}
      onSend={handleSend}
    />
  );
}

export default App;