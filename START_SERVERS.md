# 🚀 How to Start Both Servers

## Quick Start

### Terminal 1: Start Backend
```bash
cd backend
python main.py
```

Wait until you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend  
```bash
bun run dev
```

Then visit: **http://localhost:5173**

---

## ✅ What Now Works

1. **Dashboard "Talk with Us" Button**
   - Click the button on the dashboard
   - Chat panel slides in from the right
   - Ask questions about your family!

2. **Chatbot Features**
   - Works without database (uses localStorage data)
   - OpenAI GPT-3.5 enabled (with your API key)
   - Beautiful chat interface
   - Real-time responses

---

## 💬 Try These Questions

- "How many family members do I have?"
- "Who are my children?"
- "What is everyone's blood group?"
- "Tell me about my family"

---

## 🐛 If Backend Won't Start

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

**That's it! Your chatbot is ready!** 🎉

