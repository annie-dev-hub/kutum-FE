# 🤖 Family Chatbot Setup Guide

## Overview

This project includes an AI-powered chatbot that can answer questions about your family members using RAG (Retrieval Augmented Generation). The system consists of:

- **Backend**: FastAPI server with RAG implementation
- **Frontend**: React interface integrated into PeoplePage

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed
- **Node.js** (for frontend - already set up)
- **Bun** (your package manager)

### Step 1: Start the Backend

#### On Windows:
```bash
cd backend
start.bat
```

#### On Mac/Linux:
```bash
cd backend
chmod +x start.sh
./start.sh
```

#### Or manually:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will start at `http://localhost:8000`

### Step 2: Start the Frontend

In a **new terminal**:
```bash
bun run dev
```

The frontend will run at `http://localhost:5173`

### Step 3: Use the Chatbot

1. Navigate to **Family Members** page
2. Click the **chat bubble icon** (bottom right)
3. Ask questions about your family members!

---

## 💬 Example Questions

Try asking the chatbot:

- "How many children do I have?"
- "What is Rajesh Kumar's blood group?"
- "Tell me about my spouse"
- "Who has blood group O+?"
- "What is Arjun's age?"
- "List all family members"
- "What are the heights of all members?"

---

## 🏗️ Architecture

### Backend (FastAPI + RAG)

```
backend/
├── main.py              # Main FastAPI server
├── requirements.txt     # Python dependencies
├── start.bat           # Windows startup script
├── start.sh            # Unix startup script
└── README.md           # Backend documentation
```

**Features:**
- **Simple RAG Implementation**: Keyword-based retrieval
- **RESTful API**: Clean endpoints for chat
- **CORS Enabled**: Works seamlessly with React frontend
- **No External LLM**: Rule-based generation (upgradeable)

### Frontend (React)

**Chat Interface:**
- Beautiful sliding chat panel
- Real-time message display
- Loading indicators
- Error handling
- Auto-scroll to latest message

---

## 🔧 API Endpoints

### `POST /api/chat`

Send a chat message with family data.

**Request:**
```json
{
  "message": "How many children do I have?",
  "members": [
    {
      "id": "1",
      "name": "Rajesh Kumar",
      "relation": "Self",
      "age": "40 years",
      ...
    }
  ]
}
```

**Response:**
```json
{
  "response": "You have 2 children: Arjun Kumar, Ananya Kumar",
  "relevant_members": ["Arjun Kumar", "Ananya Kumar"],
  "timestamp": "2025-10-10T12:00:00"
}
```

### `GET /health`

Health check endpoint.

---

## 🎯 How RAG Works

### 1. **Data Preparation**
- Family member data is sent from frontend
- Backend converts each member to searchable text

### 2. **Retrieval**
- User question is analyzed for keywords
- Relevant family members are found using similarity matching

### 3. **Generation**
- Rule-based response generator creates natural language
- Response includes relevant family member information

### Current Implementation:
```
User Query → Keyword Search → Find Members → Generate Response
```

### Future Enhancement:
```
User Query → Vector Embeddings → Semantic Search → LLM Generation
```

---

## 🚀 Upgrading to Advanced RAG

To upgrade to production-ready RAG with LLM:

### 1. Add Vector Embeddings

```bash
pip install sentence-transformers chromadb
```

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
```

### 2. Integrate OpenAI/Anthropic

```bash
pip install openai
```

```python
import openai
openai.api_key = "your-api-key"

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a family assistant."},
        {"role": "user", "content": query}
    ]
)
```

### 3. Add Conversation Memory

Store chat history for context-aware responses.

---

## 🔍 Troubleshooting

### Backend won't start
- Check Python version: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Try different port: `uvicorn main:app --port 8001`

### Chat shows connection error
- Verify backend is running: `http://localhost:8000/health`
- Check CORS settings in `main.py`
- Ensure frontend is on `http://localhost:5173`

### Chat not responding
- Open browser console (F12) for errors
- Check backend logs for exceptions
- Verify family members data is loaded

---

## 📊 Performance

Current implementation:
- ⚡ **Response Time**: ~100-200ms
- 💾 **Memory**: Very lightweight
- 🔌 **No External APIs**: Fully offline

---

## 🔐 Security Notes

- Backend runs locally (localhost only)
- No data sent to external servers
- No API keys required
- Family data stays on your device

---

## 🎨 Customization

### Change Chat Position
Edit `PeoplePage.tsx`:
```tsx
<div className="fixed bottom-24 right-6"> {/* Change position here */}
```

### Modify Response Style
Edit `main.py` → `generate_response()` function

### Add New Question Types
Add conditions in `generate_response()`:
```python
if 'your_keyword' in query_lower:
    # Your custom logic
    return "Your custom response"
```

---

## 📝 Future Enhancements

- [ ] Vector embeddings with sentence-transformers
- [ ] Integration with OpenAI GPT-4 / Anthropic Claude
- [ ] Conversation history and context
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Export chat history
- [ ] Advanced analytics queries
- [ ] Image understanding (profile pictures)

---

## 🤝 Contributing

Feel free to enhance the RAG system:
1. Improve retrieval accuracy
2. Add LLM integration
3. Implement vector search
4. Add more question types

---

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [RAG Overview](https://arxiv.org/abs/2005.11401)
- [Sentence Transformers](https://www.sbert.net/)
- [OpenAI API](https://platform.openai.com/docs/)

---

## ✅ System Status

Run this to check if everything is working:

```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:5173
```

---

Enjoy your AI-powered family assistant! 🎉

