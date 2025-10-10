# Chatbot Testing Guide

## How to Test the Chatbot

### Step 1: Start Backend Server

Open a **new terminal** and run:

```bash
cd backend
python main.py
```

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Verify Backend is Running

In another terminal, test the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2025-10-10T12:00:00"}
```

Or visit in your browser: `http://localhost:8000/docs`

### Step 3: Start Frontend

In a **separate terminal**:

```bash
bun run dev
```

Visit: `http://localhost:5173`

### Step 4: Test the Chat

1. Navigate to **Family Members** page
2. Click the **chat bubble icon** (bottom-right floating button)
3. The chat panel will slide in from the right

### Step 5: Try These Sample Queries

#### Basic Queries:
- "How many children do I have?"
- "How many family members do I have?"
- "List all family members"

#### Specific Person Queries:
- "Tell me about Rajesh Kumar"
- "Who is Priya Kumar?"
- "Tell me about Arjun"

#### Attribute Queries:
- "What is Rajesh's blood group?"
- "What is Priya's age?"
- "What are everyone's blood groups?"
- "Show me the heights of all members"
- "What is Arjun's weight?"

#### Relationship Queries:
- "Who is my spouse?"
- "Who are my children?"
- "Tell me about my son"
- "Tell me about my daughter"

#### Birthday Queries:
- "When is Rajesh's birthday?"
- "What is Arjun's date of birth?"
- "Show me everyone's birthdays"

#### Count Queries:
- "How many sons do I have?"
- "How many daughters do I have?"
- "Count my children"

### Expected Behavior

**Good Response Example:**
```
User: "How many children do I have?"
Bot: "You have 2 children: Arjun Kumar, Ananya Kumar"
```

**Detailed Response Example:**
```
User: "Tell me about Rajesh Kumar"
Bot: "Here's information about Rajesh Kumar:
Relation: Self
Age: 40 years
Gender: Male
Blood Group: O+
Date of Birth: 15/3/1985
Height: 175 cm
Weight: 70 kg"
```

**Multiple Results Example:**
```
User: "What are everyone's blood groups?"
Bot: "Blood group information:
Rajesh Kumar (Self): O+
Priya Kumar (Spouse): A+
Arjun Kumar (Son): O+
Ananya Kumar (Daughter): A+"
```

### Testing API Directly (Optional)

You can test the API using curl:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How many children do I have?",
    "members": [
      {
        "id": "1",
        "name": "Rajesh Kumar",
        "relation": "Self",
        "age": "40 years",
        "avatar": "🧑🏻",
        "gender": "Male",
        "bloodGroup": "O+"
      },
      {
        "id": "3",
        "name": "Arjun Kumar",
        "relation": "Son",
        "age": "10 years",
        "avatar": "👦🏻",
        "gender": "Male",
        "bloodGroup": "O+"
      },
      {
        "id": "4",
        "name": "Ananya Kumar",
        "relation": "Daughter",
        "age": "7 years",
        "avatar": "👧🏻",
        "gender": "Female",
        "bloodGroup": "A+"
      }
    ]
  }'
```

Expected response:
```json
{
  "response": "You have 2 children: Arjun Kumar, Ananya Kumar",
  "relevant_members": ["Arjun Kumar", "Ananya Kumar"],
  "timestamp": "2025-10-10T12:00:00"
}
```

### Troubleshooting

#### Chat shows connection error
✅ Make sure backend is running: `http://localhost:8000/health`
✅ Check backend terminal for errors
✅ Verify CORS is enabled in backend

#### Backend won't start
✅ Check Python version: `python --version` (need 3.8+)
✅ Install dependencies: `pip install -r requirements.txt`
✅ Try: `python -m uvicorn main:app --reload`

#### Chat not appearing
✅ Refresh the browser page
✅ Check browser console for JavaScript errors (F12)
✅ Verify you're on the Family Members page

### Test Checklist

- [ ] Backend starts successfully
- [ ] Health endpoint returns 200
- [ ] Frontend loads without errors
- [ ] Chat button appears on Family Members page
- [ ] Chat panel opens when clicking button
- [ ] Can type and send messages
- [ ] Bot responds to queries
- [ ] Responses are accurate
- [ ] Can close chat panel
- [ ] Can reopen chat and see history

### Performance Tests

- Response time should be < 500ms
- Chat should handle 100+ messages without lag
- Memory usage should stay below 100MB

### Edge Cases to Test

1. Empty query (button should be disabled)
2. Very long query (should still work)
3. Query with no matching members (graceful error)
4. Special characters in query
5. Multiple rapid queries
6. Closing and reopening chat
7. Adding/deleting members while chatting

---

## Success Criteria

✅ Backend runs without errors
✅ API responds correctly
✅ Frontend chat UI is functional
✅ Chatbot answers questions accurately
✅ No console errors
✅ Good user experience

Enjoy testing! 🚀

