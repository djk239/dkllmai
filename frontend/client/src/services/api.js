// src/services/api.js

/* =========================
   SEND MESSAGE (STREAMING)
========================= */
export async function sendMessage(
  message,
  options,
  conversationId,
  onChunk = () => {}
) {
  try {
    const response = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
export async function improvePrompt(prompt, model) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/ai/improve-prompt",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          model, 
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to improve prompt");
    }

    const data = await response.json();
    return data.improved;
  } catch (err) {
    console.error("Error improving prompt:", err);
    return prompt;
  }
}

/* =========================
   FETCH ONE CONVERSATION
========================= */
export async function fetchConversationMessages(conversationId) {
  const res = await fetch(
    `http://localhost:5000/api/ai/conversations/${conversationId}/messages`,
    {
      credentials: "include",
    }
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
    `http://localhost:5000/api/ai/conversations?page=${page}&limit=10`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
}

/* =========================
   Login
========================= */
export async function login(email, password) {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // ✅ REQUIRED
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

/* =========================
   Register
========================= */
export async function register(username, email, password) {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

/* =========================
   Logout
========================= */
export async function logout() {
  await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
}