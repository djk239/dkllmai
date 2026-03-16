import { useChat } from "./context/Context";
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