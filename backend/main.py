"""
FastAPI backend for Family Chatbot with RAG + OpenAI
"""
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import json
import re
import os
import base64
from io import BytesIO
from PIL import Image
from dateutil import parser as date_parser
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client (will use API key from environment)
client = None
USE_OPENAI = False

try:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key and api_key != "your_openai_api_key_here":
        client = OpenAI(api_key=api_key)
        USE_OPENAI = True
        print("✅ OpenAI API initialized successfully")
        print("   Using GPT-3.5-turbo for intelligent responses")
    else:
        print("⚠️  No OpenAI API key found. Using rule-based responses.")
        print("   To enable AI:")
        print("   1. Copy env_example.txt to .env")
        print("   2. Add your OpenAI API key")
        print("   3. Restart the server")
except Exception as e:
    print(f"⚠️  OpenAI initialization failed: {e}")
    print("   Falling back to rule-based responses.")

app = FastAPI(title="Kutum Family Chatbot API")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for family data
family_data_store = []


class Member(BaseModel):
    id: str
    name: str
    relation: str
    age: str
    avatar: str
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    bloodGroup: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None


class ChatMessage(BaseModel):
    message: str
    members: Optional[List[Member]] = None  # For backward compatibility
    allData: Optional[dict] = None  # New: comprehensive data


class ChatResponse(BaseModel):
    response: str
    relevant_members: List[str]
    timestamp: str


def create_member_text(member: Member) -> str:
    """Convert member data to searchable text"""
    text_parts = [
        f"Name: {member.name}",
        f"Relation: {member.relation}",
        f"Age: {member.age}",
    ]
    
    if member.gender:
        text_parts.append(f"Gender: {member.gender}")
    if member.bloodGroup:
        text_parts.append(f"Blood Group: {member.bloodGroup}")
    if member.dateOfBirth:
        text_parts.append(f"Date of Birth: {member.dateOfBirth}")
    if member.height:
        text_parts.append(f"Height: {member.height}")
    if member.weight:
        text_parts.append(f"Weight: {member.weight}")
    
    return " | ".join(text_parts)


def simple_search(query: str, members: List[Member]) -> List[Member]:
    """
    Simple keyword-based search (can be replaced with vector embeddings)
    Returns relevant members based on query keywords
    """
    query_lower = query.lower()
    keywords = query_lower.split()
    
    scored_members = []
    for member in members:
        member_text = create_member_text(member).lower()
        score = 0
        
        # Check for exact name match (high priority)
        if member.name.lower() in query_lower:
            score += 10
        
        # Check for relation keywords
        if member.relation.lower() in query_lower:
            score += 5
        
        # Check for other attributes
        for keyword in keywords:
            if keyword in member_text:
                score += 1
        
        if score > 0:
            scored_members.append((score, member))
    
    # Sort by score and return top members
    scored_members.sort(reverse=True, key=lambda x: x[0])
    return [member for _, member in scored_members[:5]]


def generate_response_with_openai(query: str, all_data: dict = None, relevant_members: List[Member] = None) -> str:
    """
    Generate intelligent responses using OpenAI GPT with comprehensive site data (RAG)
    
    Args:
        query: The user's question
        all_data: Complete site data including family, documents, vehicles, health, reminders
        relevant_members: Specific family members relevant to the query
        
    Returns:
        str: AI-generated natural language response
        
    Process (RAG - Retrieval Augmented Generation):
        1. RETRIEVAL: Gather relevant data from all_data
        2. AUGMENTATION: Build comprehensive context for AI
        3. GENERATION: Send to GPT to generate natural answer
    """
    # Fallback to rule-based if OpenAI not available
    if not client:
        return generate_response_rule_based(query, relevant_members or [])
    
    try:
        # STEP 1: Build comprehensive context from all available data
        context = "Here is all the information about the user's family management system:\n\n"
        
        # Add overall statistics (counts of everything)
        if all_data and 'stats' in all_data:
            stats = all_data['stats']
            context += "=== STATISTICS ===\n"
            context += f"Total Family Members: {stats.get('totalFamily', 0)}\n"
            context += f"Total Documents: {stats.get('totalDocuments', 0)}\n"
            context += f"Total Vehicles: {stats.get('totalVehicles', 0)}\n"
            context += f"Total Reminders: {stats.get('totalReminders', 0)}\n\n"
        
        # STEP 2: Add detailed family member information
        members_list = []
        if all_data and 'familyMembers' in all_data:
            members_list = all_data['familyMembers']  # Use comprehensive data
        elif relevant_members:
            members_list = relevant_members  # Fallback to filtered members
            
        if members_list:
            context += "=== FAMILY MEMBERS ===\n"
            # Loop through each family member and add their details
            for member in members_list:
                if isinstance(member, dict):
                    context += f"- {member.get('name', 'Unknown')} ({member.get('relation', 'Unknown')})\n"
                    context += f"  Age: {member.get('age', 'N/A')}\n"
                    if member.get('gender'):
                        context += f"  Gender: {member.get('gender')}\n"
                    if member.get('bloodGroup'):
                        context += f"  Blood Group: {member.get('bloodGroup')}\n"
                else:
                    context += f"- {member.name} ({member.relation})\n"
                    context += f"  Age: {member.age}\n"
                    if member.gender:
                        context += f"  Gender: {member.gender}\n"
                    if member.bloodGroup:
                        context += f"  Blood Group: {member.bloodGroup}\n"
                context += "\n"
        
        # STEP 3: Add document information (uploaded files)
        if all_data and 'documents' in all_data and all_data['documents']:
            context += "=== DOCUMENTS ===\n"
            docs = all_data['documents']
            context += f"Total documents uploaded: {len(docs)}\n"
            # Include first 10 documents to avoid context size limits
            for doc in docs[:10]:
                if isinstance(doc, dict):
                    context += f"- {doc.get('type', 'Document')}: {doc.get('name', 'Unknown')}"
                    if doc.get('personName'):
                        context += f" (for {doc.get('personName')})"  # Show owner
                    if doc.get('expires'):
                        context += f" - Expires: {doc.get('expires')}"  # Show expiry if available
                    context += "\n"
            # Mention if there are more documents
            if len(docs) > 10:
                context += f"... and {len(docs) - 10} more documents\n"
            context += "\n"
        
        # STEP 4: Add vehicle information
        if all_data and 'vehicles' in all_data and all_data['vehicles']:
            context += "=== VEHICLES ===\n"
            vehicles = all_data['vehicles']
            context += f"Total vehicles: {len(vehicles)}\n"
            # List each vehicle with details
            for vehicle in vehicles:
                if isinstance(vehicle, dict):
                    context += f"- {vehicle.get('make', '')} {vehicle.get('model', '')} ({vehicle.get('year', '')})\n"
                    if vehicle.get('plateNumber'):
                        context += f"  Plate: {vehicle.get('plateNumber')}\n"  # Include plate number if available
            context += "\n"
        
        # STEP 5: Add health records information
        if all_data and 'health' in all_data and all_data['health']:
            context += "=== HEALTH RECORDS ===\n"
            health = all_data['health']
            context += f"Total health records: {len(health)}\n"
            # Include first 5 health records
            for record in health[:5]:
                if isinstance(record, dict):
                    context += f"- {record.get('title', 'Health record')} for {record.get('personName', 'Unknown')}\n"
            context += "\n"
        
        # STEP 6: Add active reminders (things that need attention)
        if all_data and 'reminders' in all_data and all_data['reminders']:
            context += "=== ACTIVE REMINDERS ===\n"
            reminders = all_data['reminders']
            context += f"Total reminders: {len(reminders)}\n"
            # Include first 5 most important reminders
            for reminder in reminders[:5]:
                if isinstance(reminder, dict):
                    context += f"- {reminder.get('title', 'Reminder')}: {reminder.get('person', '')}\n"
            context += "\n"
        
        # STEP 7: Send context + question to OpenAI for intelligent response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Fast and affordable model (can use gpt-4 for better quality)
            messages=[
                {
                    "role": "system",
                    # System prompt: Defines the AI's role and capabilities
                    "content": "You are a helpful family management assistant. You have access to comprehensive information about the user's family, including: family members, documents, vehicles, health records, reminders, and activities. Answer questions accurately based on the provided data. Be friendly, concise, and helpful. If specific information is not available, say so politely. You can answer questions about counts, specifics, relationships, and provide summaries."
                },
                {
                    "role": "user",
                    # Send all the context we built + the user's question
                    "content": f"{context}\n\nQuestion: {query}"
                }
            ],
            temperature=0.7,  # Controls creativity (0.0 = deterministic, 1.0 = creative)
            max_tokens=400  # Maximum length of response
        )
        
        # Extract and return the AI's response text
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Fallback to rule-based
        return generate_response_rule_based(query, relevant_members or [])


def generate_response_rule_based(query: str, relevant_members: List[Member]) -> str:
    """
    Generate response based on query and relevant members
    This is a rule-based system (fallback when OpenAI is not available)
    """
    query_lower = query.lower()
    
    if not relevant_members:
        return "I couldn't find any family members matching your query. Could you please rephrase your question?"
    
    # Handle different types of queries
    
    # Count queries
    if any(word in query_lower for word in ['how many', 'count', 'number of']):
        if 'son' in query_lower:
            sons = [m for m in relevant_members if m.relation == 'Son']
            return f"You have {len(sons)} son(s): {', '.join([m.name for m in sons])}"
        elif 'daughter' in query_lower:
            daughters = [m for m in relevant_members if m.relation == 'Daughter']
            return f"You have {len(daughters)} daughter(s): {', '.join([m.name for m in daughters])}"
        elif 'children' in query_lower or 'kids' in query_lower:
            children = [m for m in relevant_members if m.relation in ['Son', 'Daughter']]
            return f"You have {len(children)} children: {', '.join([m.name for m in children])}"
        else:
            return f"You have {len(relevant_members)} family members in total."
    
    # Blood group queries
    if 'blood' in query_lower or 'blood group' in query_lower:
        responses = []
        for member in relevant_members:
            if member.bloodGroup:
                responses.append(f"{member.name} ({member.relation}): {member.bloodGroup}")
        if responses:
            return "Blood group information:\n" + "\n".join(responses)
        return "No blood group information available for these members."
    
    # Age queries
    if 'age' in query_lower or 'old' in query_lower:
        responses = []
        for member in relevant_members:
            responses.append(f"{member.name} ({member.relation}): {member.age}")
        if responses:
            return "Age information:\n" + "\n".join(responses)
        return "No age information available."
    
    # Height/Weight queries
    if 'height' in query_lower:
        responses = []
        for member in relevant_members:
            if member.height:
                responses.append(f"{member.name} ({member.relation}): {member.height}")
        if responses:
            return "Height information:\n" + "\n".join(responses)
        return "No height information available."
    
    if 'weight' in query_lower:
        responses = []
        for member in relevant_members:
            if member.weight:
                responses.append(f"{member.name} ({member.relation}): {member.weight}")
        if responses:
            return "Weight information:\n" + "\n".join(responses)
        return "No weight information available."
    
    # Birthday queries
    if 'birthday' in query_lower or 'birth' in query_lower or 'born' in query_lower:
        responses = []
        for member in relevant_members:
            if member.dateOfBirth:
                responses.append(f"{member.name} ({member.relation}): {member.dateOfBirth}")
        if responses:
            return "Date of birth information:\n" + "\n".join(responses)
        return "No date of birth information available."
    
    # Gender queries
    if 'gender' in query_lower:
        responses = []
        for member in relevant_members:
            if member.gender:
                responses.append(f"{member.name} ({member.relation}): {member.gender}")
        if responses:
            return "Gender information:\n" + "\n".join(responses)
        return "No gender information available."
    
    # General information about a specific person
    if len(relevant_members) == 1:
        member = relevant_members[0]
        info = [
            f"Here's information about {member.name}:",
            f"Relation: {member.relation}",
            f"Age: {member.age}",
        ]
        if member.gender:
            info.append(f"Gender: {member.gender}")
        if member.bloodGroup:
            info.append(f"Blood Group: {member.bloodGroup}")
        if member.dateOfBirth:
            info.append(f"Date of Birth: {member.dateOfBirth}")
        if member.height:
            info.append(f"Height: {member.height}")
        if member.weight:
            info.append(f"Weight: {member.weight}")
        
        return "\n".join(info)
    
    # List multiple members
    if len(relevant_members) > 1:
        member_list = []
        for member in relevant_members:
            member_list.append(f"• {member.name} ({member.relation}, {member.age})")
        
        return f"I found {len(relevant_members)} family members matching your query:\n" + "\n".join(member_list)
    
    return "I found some information but I'm not sure how to answer your specific question. Could you please be more specific?"


@app.get("/")
def read_root():
    return {
        "message": "Kutum Family Chatbot API",
        "status": "running",
        "openai_enabled": USE_OPENAI,
        "mode": "OpenAI GPT" if USE_OPENAI else "Rule-based"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "openai_enabled": USE_OPENAI
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """
    Main chatbot endpoint - Processes user questions using RAG + OpenAI
    
    Process:
        1. Receives user question + all family management data
        2. Uses RAG (Retrieval Augmented Generation):
           - RETRIEVAL: Finds relevant data (family members, documents, etc.)
           - AUGMENTATION: Adds context to the question
           - GENERATION: Uses GPT to create natural language answer
        3. Returns intelligent response
        
    Supports questions about:
        - Family members (count, details, relationships)
        - Documents (how many uploaded, types, expiry dates)
        - Vehicles (count, details)
        - Health records (summaries)
        - Reminders (what's due, urgency)
        - Overall summaries
    """
    try:
        # Extract the user's question
        query = chat_message.message
        
        # Validate that we have a question
        if not query:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get data from request - supports both old and new formats for backward compatibility
        all_data = chat_message.allData  # New format: all site data
        members = chat_message.members or []  # Old format: just family members
        
        # Extract members from comprehensive data if available
        if all_data and 'familyMembers' in all_data:
            members = all_data['familyMembers']
        
        # RETRIEVAL: Find family members relevant to the query (for keyword-based search)
        relevant_members = []
        if members:
            # Convert dictionary members to Member objects for processing
            member_objects = []
            for m in members:
                if isinstance(m, dict):
                    member_objects.append(Member(**m))  # Convert dict to object
                else:
                    member_objects.append(m)  # Already an object
            # Search for members matching the query keywords
            relevant_members = simple_search(query, member_objects) if member_objects else []
        
        # GENERATION: Choose best method to generate response
        if USE_OPENAI and all_data:
            # Best option: Use OpenAI with ALL site data (documents, vehicles, etc.)
            response_text = generate_response_with_openai(query, all_data=all_data)
        elif USE_OPENAI and relevant_members:
            # Fallback: Use OpenAI with just family members
            response_text = generate_response_with_openai(query, relevant_members=relevant_members)
        else:
            # Last resort: Use rule-based responses (no AI, but still works)
            response_text = generate_response_rule_based(query, relevant_members)
        
        # Return the response to frontend
        return ChatResponse(
            response=response_text,  # The AI-generated or rule-based answer
            relevant_members=[m.name if hasattr(m, 'name') else m.get('name', '') for m in relevant_members],  # Which members were relevant
            timestamp=datetime.now().isoformat()  # When the response was generated
        )
    
    except Exception as e:
        # Log and return error if something goes wrong
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@app.post("/api/update-members")
async def update_members(members: List[Member]):
    """
    Update the family members data in the backend
    This endpoint can be called whenever family data changes
    """
    global family_data_store
    family_data_store = members
    return {"status": "success", "count": len(members)}


def extract_expiry_date_with_vision(image_base64: str) -> dict:
    """
    Extract expiry date from document image using OpenAI Vision API (GPT-4o with vision)
    
    Args:
        image_base64: Base64 encoded string of the document image
        
    Returns:
        dict: Contains expiry date, days until expiry, and whether date was found
        
    Process:
        1. Sends image to OpenAI Vision API
        2. AI reads the document and looks for expiry/expiration/valid until dates
        3. Parses and normalizes the date to YYYY-MM-DD format
        4. Calculates days until expiry
        5. Returns structured result with formatted date and metadata
    """
    # Check if OpenAI client is initialized
    if not client:
        return {"error": "OpenAI not configured", "date": None}
    
    try:
        # Call OpenAI Vision API to analyze the document image
        response = client.chat.completions.create(
            model="gpt-4o",  # Latest GPT-4o model with vision capabilities
            messages=[
                {
                    "role": "system",
                    # Instruct AI to be a document analysis expert
                    "content": "You are a document analysis expert. Extract ONLY the expiry date, expiration date, valid until date, or validity date from documents. Return ONLY the date in YYYY-MM-DD format. If no expiry date is found, return 'NO_DATE_FOUND'."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            # Clear instructions for what to extract
                            "text": "Extract the expiry date, expiration date, or valid until date from this document. Return ONLY the date in YYYY-MM-DD format, nothing else. If there's no expiry date visible, return 'NO_DATE_FOUND'."
                        },
                        {
                            "type": "image_url",
                            # Send the document image as base64 data URL
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=100  # Limit response length (date should be short)
        )
        
        # Get the AI's response (should be a date or "NO_DATE_FOUND")
        extracted_text = response.choices[0].message.content.strip()
        print(f"OpenAI Vision extracted: {extracted_text}")
        
        # Check if AI couldn't find a date
        if "NO_DATE_FOUND" in extracted_text or not extracted_text:
            return {"date": None, "found": False, "raw": extracted_text}
        
        # Try to parse the extracted date string
        try:
            # Clean up any extra text from the AI response
            date_str = extracted_text.replace("Expiry Date:", "").replace("Expiration Date:", "").strip()
            
            # Try direct parsing if already in YYYY-MM-DD format
            if re.match(r'\d{4}-\d{2}-\d{2}', date_str):
                parsed_date = datetime.strptime(date_str, "%Y-%m-%d")
            else:
                # Use dateutil parser for flexible date parsing (handles DD/MM/YYYY, MM-DD-YYYY, etc.)
                parsed_date = date_parser.parse(date_str)
            
            # Calculate how many days until this date (negative if expired)
            days_until_expiry = (parsed_date - datetime.now()).days
            
            # Return structured result with all date information
            return {
                "date": parsed_date.strftime("%Y-%m-%d"),  # ISO format for storage
                "found": True,
                "days_until_expiry": days_until_expiry,  # For urgency calculation
                "formatted_date": parsed_date.strftime("%B %d, %Y"),  # Human-readable format
                "raw": extracted_text  # Original AI response for debugging
            }
        except Exception as parse_error:
            # If date parsing fails, return what we got anyway
            print(f"Date parsing error: {parse_error}")
            return {"date": extracted_text, "found": True, "parse_error": str(parse_error), "raw": extracted_text}
    
    except Exception as e:
        print(f"Vision API error: {e}")
        return {"error": str(e), "date": None, "found": False}


@app.post("/api/scan-document")
async def scan_document(file: UploadFile = File(...), document_type: str = Form(None)):
    """
    API endpoint to scan uploaded documents and extract expiry dates using AI
    
    Args:
        file: Uploaded document file (PDF, JPG, PNG)
        document_type: Type of document (passport, insurance, etc.) - optional
        
    Returns:
        JSON response with:
        - success: Whether extraction was successful
        - expiry_date: Extracted date in YYYY-MM-DD format
        - formatted_date: Human-readable date format
        - days_until_expiry: Number of days until expiry (negative if expired)
        - urgency: Level of urgency (expired, high, medium, low)
        - should_create_reminder: Boolean suggesting if reminder should be created
        
    Process:
        1. Receives uploaded file from frontend
        2. Converts image to base64
        3. Sends to OpenAI Vision API for analysis
        4. Parses extracted date
        5. Calculates urgency based on days until expiry
        6. Returns structured response
    """
    # Check if OpenAI is configured
    if not USE_OPENAI:
        return {
            "success": False,
            "error": "OpenAI API not configured. Please add your API key to .env file.",
            "expiry_date": None
        }
    
    try:
        # Read the uploaded file contents into memory
        contents = await file.read()
        
        # Convert image bytes to base64 string (required for OpenAI Vision API)
        image_base64 = base64.b64encode(contents).decode('utf-8')
        
        # Call the Vision API to extract expiry date from the image
        result = extract_expiry_date_with_vision(image_base64)
        
        # If AI successfully found an expiry date
        if result.get("found"):
            # Build success response with all details
            response = {
                "success": True,
                "expiry_date": result.get("date"),  # YYYY-MM-DD format
                "formatted_date": result.get("formatted_date"),  # "December 31, 2025" format
                "days_until_expiry": result.get("days_until_expiry"),  # Number of days
                "should_create_reminder": result.get("days_until_expiry", 0) > 0 and result.get("days_until_expiry", 0) <= 90,  # Create reminder if expiring within 90 days
                "message": f"Expiry date found: {result.get('formatted_date', result.get('date'))}"
            }
            
            # Determine urgency level based on how many days until expiry
            days = result.get("days_until_expiry", 0)
            if days <= 0:
                # Already expired
                response["urgency"] = "expired"
                response["message"] += " (EXPIRED!)"
            elif days <= 30:
                # Expiring within a month
                response["urgency"] = "high"
                response["message"] += " (Expires soon!)"
            elif days <= 90:
                # Expiring within 3 months
                response["urgency"] = "medium"
            else:
                # Expiring later
                response["urgency"] = "low"
            
            return response
        else:
            # AI couldn't find an expiry date in the document
            return {
                "success": False,
                "error": result.get("error", "No expiry date found in document"),
                "expiry_date": None,
                "message": "Could not find an expiry date in this document. You can add it manually."
            }
    
    except Exception as e:
        print(f"Document scan error: {e}")
        return {
            "success": False,
            "error": str(e),
            "expiry_date": None
        }


@app.get("/api/check-expiring-documents")
async def check_expiring_documents():
    """
    Check for documents expiring soon (for reminder generation)
    This would typically query a database, but for now returns structure
    """
    return {
        "message": "This endpoint will check database for expiring documents",
        "note": "Implement after database integration"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

