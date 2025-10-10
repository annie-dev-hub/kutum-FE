# 🗄️ Database Setup Guide

This guide shows you how to connect a database to your chatbot for production use.

---

## Why Add a Database?

**Without Database (Current):**
- ❌ All data in browser localStorage
- ❌ Sending all family data with every request (inefficient)
- ❌ No multi-device sync
- ❌ Not scalable to multiple users
- ❌ Chat history lost on page refresh

**With Database:**
- ✅ Server-side data storage
- ✅ Efficient queries (send user_id, not all data)
- ✅ Multi-device sync
- ✅ Supports unlimited users
- ✅ Persistent chat history
- ✅ Production-ready

---

## Option 1: SQLite (Easiest - For Development)

### Step 1: Install Dependencies
```bash
pip install sqlalchemy
```

### Step 2: Create Database Models

Create `backend/database.py`:

```python
from sqlalchemy import create_engine, Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Database URL
DATABASE_URL = "sqlite:///./kutum.db"

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    family_members = relationship("FamilyMember", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")


class FamilyMember(Base):
    __tablename__ = "family_members"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, index=True)
    relation = Column(String)
    age = Column(String)
    avatar = Column(String)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    height = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="family_members")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(String)  # 'user' or 'assistant'
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="chat_messages")


# Create tables
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 3: Update main.py

Add database queries:

```python
from database import get_db, User, FamilyMember, ChatMessage
from sqlalchemy.orm import Session
from fastapi import Depends

@app.post("/api/chat")
async def chat(
    message: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    # Get family members from database
    members = db.query(FamilyMember).filter(
        FamilyMember.user_id == user_id
    ).all()
    
    # Save user message
    user_msg = ChatMessage(
        user_id=user_id,
        role="user",
        content=message
    )
    db.add(user_msg)
    
    # Generate response
    response = generate_response(message, members)
    
    # Save assistant message
    assistant_msg = ChatMessage(
        user_id=user_id,
        role="assistant",
        content=response
    )
    db.add(assistant_msg)
    db.commit()
    
    return {"response": response}
```

### Step 4: Update Frontend

```typescript
// Send user_id instead of all members
const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: chatInput,
        user_id: currentUserId  // From auth context
    })
})
```

---

## Option 2: PostgreSQL (Recommended for Production)

### Step 1: Install PostgreSQL

**Windows:**
Download from: https://www.postgresql.org/download/windows/

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kutum_db;

# Create user
CREATE USER kutum_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kutum_db TO kutum_user;

# Exit
\q
```

### Step 3: Install Python Driver

```bash
pip install psycopg2-binary
```

### Step 4: Update .env

```env
DATABASE_URL=postgresql://kutum_user:your_secure_password@localhost:5432/kutum_db
```

### Step 5: Update database.py

```python
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kutum.db")
engine = create_engine(DATABASE_URL)
```

---

## Option 3: MongoDB (NoSQL Alternative)

### Step 1: Install MongoDB

Download from: https://www.mongodb.com/try/download/community

### Step 2: Install Python Driver

```bash
pip install pymongo motor
```

### Step 3: Create Database Connection

Create `backend/mongodb.py`:

```python
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.kutum_db

# Collections
users_collection = db.users
family_members_collection = db.family_members
chat_messages_collection = db.chat_messages
```

### Step 4: Update Endpoints

```python
@app.post("/api/chat")
async def chat(message: str, user_id: str):
    # Get family members
    members = await family_members_collection.find(
        {"user_id": user_id}
    ).to_list(length=100)
    
    # Generate response
    response = generate_response(message, members)
    
    # Save chat
    await chat_messages_collection.insert_one({
        "user_id": user_id,
        "role": "user",
        "content": message,
        "timestamp": datetime.utcnow()
    })
    
    await chat_messages_collection.insert_one({
        "user_id": user_id,
        "role": "assistant",
        "content": response,
        "timestamp": datetime.utcnow()
    })
    
    return {"response": response}
```

---

## Migration Steps (From Current to DB)

### 1. Keep Current API Working

```python
@app.post("/api/chat")
async def chat(chat_message: ChatMessage, db: Session = Depends(get_db)):
    # Check if user_id is provided
    if hasattr(chat_message, 'user_id') and chat_message.user_id:
        # USE DATABASE (new way)
        members = db.query(FamilyMember).filter(
            FamilyMember.user_id == chat_message.user_id
        ).all()
    else:
        # USE REQUEST DATA (old way - backward compatible)
        members = chat_message.members
    
    # Rest of the code...
```

### 2. Sync localStorage to Database

Add migration endpoint:

```python
@app.post("/api/migrate")
async def migrate_data(
    user_id: str,
    members: List[Member],
    db: Session = Depends(get_db)
):
    # Create user if not exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, email=f"{user_id}@kutum.app")
        db.add(user)
    
    # Add all family members
    for member in members:
        db_member = FamilyMember(
            id=member.id,
            user_id=user_id,
            name=member.name,
            relation=member.relation,
            age=member.age,
            avatar=member.avatar,
            # ... other fields
        )
        db.add(db_member)
    
    db.commit()
    return {"status": "success", "migrated": len(members)}
```

### 3. Update Frontend to Call Migration

```typescript
// One-time migration on first login
const migrateToDatabase = async () => {
    const members = JSON.parse(localStorage.getItem('kutum_people') || '[]')
    
    await fetch('http://localhost:8000/api/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUserId,
            members: members
        })
    })
    
    localStorage.setItem('migrated_to_db', 'true')
}
```

---

## Testing Database Connection

### Test SQLite:

```python
# test_db.py
from database import engine, User, Base
from sqlalchemy.orm import sessionmaker

# Create tables
Base.metadata.create_all(bind=engine)

# Test insert
Session = sessionmaker(bind=engine)
session = Session()

user = User(id="test123", email="test@example.com", name="Test User")
session.add(user)
session.commit()

# Test query
users = session.query(User).all()
print(f"Found {len(users)} users")
```

Run:
```bash
python test_db.py
```

---

## Performance Optimization

### Add Indexes:

```python
# In database.py models
class FamilyMember(Base):
    __tablename__ = "family_members"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)  # Index!
    name = Column(String, index=True)  # Index!
```

### Add Caching:

```bash
pip install redis
```

```python
import redis

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

@app.get("/api/family/{user_id}")
async def get_family(user_id: str):
    # Try cache first
    cached = redis_client.get(f"family:{user_id}")
    if cached:
        return json.loads(cached)
    
    # Query database
    members = db.query(FamilyMember).filter(
        FamilyMember.user_id == user_id
    ).all()
    
    # Cache for 5 minutes
    redis_client.setex(
        f"family:{user_id}",
        300,
        json.dumps(members)
    )
    
    return members
```

---

## Summary

| Database | Best For | Difficulty | Cost |
|----------|----------|------------|------|
| SQLite | Development | Easy | Free |
| PostgreSQL | Production | Medium | Free |
| MongoDB | NoSQL needs | Medium | Free |
| MySQL | Traditional apps | Medium | Free |

**Recommended Path:**
1. **Start**: SQLite (5 minutes setup)
2. **Production**: PostgreSQL (30 minutes setup)
3. **Scale**: Add Redis caching

---

## Next Steps

After connecting database:
- [ ] Add user authentication (JWT tokens)
- [ ] Implement data encryption
- [ ] Add backup/restore
- [ ] Set up migrations (Alembic)
- [ ] Add connection pooling
- [ ] Implement soft deletes
- [ ] Add audit logging

**Ready to connect a database? Pick an option and I'll help you implement it!** 🚀

