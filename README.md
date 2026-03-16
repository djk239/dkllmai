![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?style=for-the-badge&logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-000?style=for-the-badge&logo=javascript)

---

# DKLLM AI 🚀

An AI-powered coding assistant built specifically for developers.  
Supports **local LLMs (Ollama + Qwen Coder 2.5)** and **cloud-based models (OpenRouter)** with full authentication, persistent conversations, and productivity-enhancing coding tools.

🔗 **Repository:** https://github.com/djk239/dkllmai

---

## ✨ Features

### 🤖 AI Chat
- Built for **Ollama**
- Optimized for **Qwen Coder 2.5**
- Optional **cloud model support via OpenRouter**
- Retry model responses if output is insufficient
- Strong coding-focused system prompt

---

### 👨‍💻 Developer Productivity Tools
Quick option buttons to automatically:
- ✅ Include comments in generated code
- 🛡 Add error handling
- 🧪 Generate test cases

Additional tools:
- ✨ One-click **Prompt Improver**
- Structured outputs optimized for coding
- Easy command-style enhancements

---

### 💬 Conversation Management
- Persistent chat history
- View previous conversations
- Reload and continue past chats
- Retry responses within conversations

---

### 🔐 Authentication
- Full authentication system implemented
- JWT-based authentication
- Secure cookie storage
- Protected backend routes

---

### 🎨 Frontend
- Modern **dark glassmorphism UI**
- Clean developer-focused layout
- Smooth chat interface

---

### 🛠 Backend
- Node.js backend
- Handles:
  - Authentication
  - Model routing (Local + Cloud)
  - Conversation storage
  - Retry logic
  - Prompt enhancement

---

## 🏗 Tech Stack

**Frontend**
- JavaScript frontend (see repo for full stack details)
- Dark glass UI styling

**Backend**
- Node.js
- JWT Authentication
- Cookie-based sessions

**AI Integration**
- Ollama (local inference)
- Qwen Coder 2.5
- OpenRouter (cloud models)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/djk239/dkllmai.git
cd dkllmai
```

---

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

### 3. Environment Variables

Create a `.env` file inside the backend folder:

```env
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key
OLLAMA_BASE_URL=http://localhost:11434
```

Adjust values as needed.

---

### 4. Install & Run Ollama (Local Model)

Install Ollama:  
https://ollama.com

Pull Qwen Coder 2.5:

```bash
ollama pull qwen:2.5-coder
```

Start Ollama:

```bash
ollama run qwen:2.5-coder
```

---

### 5. Run the Application

#### Start Backend
```bash
node index.js
```

#### Start Frontend
```bash
npm run dev
```

---

## 🔄 Model Switching

Easily switch between:

- 🖥 Local Model (Ollama + Qwen Coder 2.5)
- ☁️ Cloud Model (OpenRouter)

This provides flexibility between private/local inference and powerful hosted models.

---

Unlike generic AI chat apps, DKLLM AI is:

- Built specifically for coders
- Focused on structured, reliable code output
- Designed with developer productivity in mind
- Equipped with persistent conversation management
- Flexible between local and cloud LLMs

---

## 🚀 Future Improvements

- Project/workspace context
- Code execution sandbox

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository  
2. Create a feature branch  
3. Submit a pull request  

---

## 👤 Author

Created by **@djk239**
