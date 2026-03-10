// api.js
let conversationId = null; // store current conversation ID

export async function sendMessage(message, options, userId = 1, onChunk = () => {}) {
  try {
    const response = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,           
        message,
        conversationId,    // pass existing conversation if available
        options,
      })
    });

    // Capture conversationId from headers if this is a new conversation
    const newConversationId = response.headers.get("X-Conversation-Id");
    if (newConversationId) {
      conversationId = newConversationId;
      console.log("New conversation ID:", conversationId);
    }

    // Streaming reader
    if (!response.body) throw new Error("No response body for streaming");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        onChunk(chunk); 
      }
    }
  } catch (err) {
    console.error("Error sending message:", err);
    onChunk("\n[Error communicating with server]");
  }
}