// src/services/api.js

/* =========================
   SEND MESSAGE (STREAMING)
========================= */
export async function sendMessage(
  message,
  options,
  userId,
  conversationId,
  onChunk = () => {}
) {
  try {
    const response = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        message,
        conversationId,
        options,
      }),
    });

    const returnedConversationId =
      response.headers.get("X-Conversation-Id");

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value) {
        const chunk = decoder.decode(value);
        onChunk(chunk, returnedConversationId);
      }
    }
  } catch (err) {
    console.error("Error sending message:", err);
    onChunk("\n[Error communicating with server]");
  }
}

/* =========================
   IMPROVE PROMPT
========================= */
export async function improvePrompt(prompt) {
  try {
    const response = await fetch("http://localhost:5000/api/ai/improve-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to improve prompt");
    }

    const data = await response.json();
    return data.improved;
  } catch (err) {
    console.error("Error improving prompt:", err);
    return prompt; // Fall back to the original prompt if improvement fails
  }
}

/* =========================
   FETCH ONE CONVERSATION
========================= */
export async function fetchConversationMessages(conversationId) {
  const res = await fetch(
    `http://localhost:5000/api/ai/conversations/${conversationId}/messages`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
}

/* =========================
   FETCH ALL CONVERSATIONS
========================= */
export async function fetchConversations(page = 1) {
  const res = await fetch(
    `http://localhost:5000/api/ai/conversations/1?page=${page}&limit=10`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
}