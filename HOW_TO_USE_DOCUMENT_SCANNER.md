# 🚀 How to Use Document Expiry Scanner

## ✅ **What You Have Now**

Your system can now **automatically scan documents** and extract expiry dates using AI!

---

## 📋 **Quick Start Guide**

### **Step 1: Install New Dependencies**

```bash
cd backend
pip install pillow python-dateutil
```

### **Step 2: Restart Backend Server**

Press **CTRL+C** to stop, then:

```bash
python main.py
```

You should see:
```
✅ OpenAI API initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### **Step 3: Test the Scanner**

#### **Method A: Test Script (Easiest)**

```bash
cd backend
python test_document_scan.py path/to/your/document.jpg
```

Example:
```bash
python test_document_scan.py passport.jpg
```

Output:
```
📄 Uploading: passport.jpg
⏳ Scanning document...

==================================================
✅ SUCCESS!
📅 Expiry Date: December 31, 2025
⏱️  Days Until Expiry: 447 days
⚠️  Urgency: LOW
💬 Message: Expiry date found: December 31, 2025

🔔 Reminder should be created!
==================================================
```

#### **Method B: Using curl**

```bash
curl -X POST http://localhost:8000/api/scan-document \
  -F "file=@your_document.jpg" \
  -F "document_type=insurance"
```

#### **Method C: Using Browser (Postman/Insomnia)**

1. Open Postman or similar tool
2. POST request to: `http://localhost:8000/api/scan-document`
3. Body type: `form-data`
4. Add field: `file` (type: File) → Select your document image
5. Add field: `document_type` (type: Text) → "insurance"
6. Send!

---

## 🎯 **What Documents Work?**

### ✅ **Supported:**
- Passports
- Driver's Licenses
- Insurance Policies
- ID Cards
- Vehicle Registration
- Visas
- Certifications
- Membership Cards
- Credit Cards (for expiry)

### 📸 **Image Requirements:**
- Format: JPG, PNG, PDF
- Quality: Clear, readable text
- Size: Under 20MB
- Orientation: Correct (not upside down)

---

## 💰 **Cost per Scan**

| Provider | Cost | Accuracy |
|----------|------|----------|
| OpenAI Vision (Current) | ~$0.01-0.03 | 95-98% |
| Tesseract OCR (Free) | $0 | 60-80% |
| Manual Entry | $0 | 100% |

**With your API key:** ~100 documents = $1-3

---

## 🔧 **Integration Examples**

### **Frontend Example (React/TypeScript):**

```typescript
// Add to your DocumentsPage.tsx

const scanDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', 'insurance');

  try {
    const response = await fetch('http://localhost:8000/api/scan-document', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Use the extracted expiry date
      console.log('Expiry:', result.expiry_date);
      console.log('Days until expiry:', result.days_until_expiry);
      
      // Auto-fill form
      setExpiryDate(result.expiry_date);
      
      // Show success message
      alert(`✅ Found expiry date: ${result.formatted_date}`);
      
      // Create reminder if needed
      if (result.should_create_reminder) {
        createReminder({
          title: `Document expires: ${result.formatted_date}`,
          daysUntil: result.days_until_expiry,
          priority: result.urgency
        });
      }
    } else {
      alert('Could not find expiry date. Please enter manually.');
    }
  } catch (error) {
    console.error('Scan error:', error);
  }
};

// In your upload component
<input 
  type="file" 
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) scanDocument(file);
  }}
/>
```

### **Complete Upload Flow:**

```typescript
const handleDocumentUpload = async (file: File, owner: string) => {
  // Step 1: Scan for expiry date
  const scanResult = await scanDocument(file);
  
  // Step 2: Save document with extracted date
  const document = {
    id: Date.now().toString(),
    name: file.name,
    owner: owner,
    uploadDate: new Date().toISOString(),
    expiryDate: scanResult?.expiry_date || null,
    daysUntilExpiry: scanResult?.days_until_expiry || null,
    urgency: scanResult?.urgency || 'none',
    file: file // or upload to storage
  };
  
  // Step 3: Save to localStorage/database
  const documents = JSON.parse(localStorage.getItem('kutum_documents') || '[]');
  documents.push(document);
  localStorage.setItem('kutum_documents', JSON.stringify(documents));
  
  // Step 4: Create reminder if expiring soon
  if (scanResult?.should_create_reminder) {
    const reminder = {
      id: `doc-${document.id}`,
      title: `${document.name} expires soon`,
      person: owner,
      dueDate: scanResult.expiry_date,
      priority: scanResult.urgency === 'high' ? 'high' : 'medium',
      type: 'document-expiry'
    };
    
    const reminders = JSON.parse(localStorage.getItem('kutum_reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('kutum_reminders', JSON.stringify(reminders));
  }
  
  // Step 5: Show success
  toast.success(`Document uploaded! Expires in ${scanResult?.days_until_expiry} days`);
};
```

---

## 🎨 **UI Components**

### **Scan Button:**

```jsx
<button 
  onClick={() => fileInput.current?.click()}
  className="btn-scan"
>
  📄 Upload & Scan Document
</button>

<input 
  ref={fileInput}
  type="file"
  hidden
  accept="image/*,.pdf"
  onChange={handleFileChange}
/>
```

### **Expiry Badge:**

```jsx
{document.expiryDate && (
  <div className={`expiry-badge ${document.urgency}`}>
    <span>Expires: {document.formattedDate}</span>
    <span>{document.daysUntilExpiry} days</span>
    {document.urgency === 'expired' && 
      <span className="text-red-600">🚨 EXPIRED</span>}
    {document.urgency === 'high' && 
      <span className="text-orange-600">⚠️ SOON</span>}
  </div>
)}
```

### **Expiring Documents Widget:**

```jsx
const ExpiringDocuments = () => {
  const expiringDocs = documents
    .filter(doc => doc.daysUntilExpiry <= 90 && doc.daysUntilExpiry > 0)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  return (
    <div className="widget expiring-docs">
      <h3>📄 Expiring Soon</h3>
      {expiringDocs.map(doc => (
        <div key={doc.id} className="doc-alert">
          <span>{doc.name}</span>
          <span className="days">{doc.daysUntilExpiry} days</span>
        </div>
      ))}
    </div>
  );
};
```

---

## 🧪 **Testing Checklist**

- [ ] Backend server running with OpenAI API key
- [ ] Dependencies installed (`pillow`, `python-dateutil`)
- [ ] Test endpoint: `curl -X POST ...`
- [ ] Upload test document with visible expiry date
- [ ] Verify correct date extraction
- [ ] Check days calculation
- [ ] Confirm urgency level
- [ ] Test reminder creation
- [ ] Try expired document (should show "EXPIRED")
- [ ] Try expiring soon document (should show warning)

---

## 🐛 **Troubleshooting**

### **"OpenAI API not configured"**
- Check `.env` file has `OPENAI_API_KEY`
- Restart backend server

### **"No expiry date found"**
- Document might be unclear/blurry
- Try better quality image
- Make sure expiry date is visible
- Try different angle/lighting

### **"Connection refused"**
- Backend server not running
- Run: `python main.py`

### **Inaccurate dates**
- GPT-4 Vision is 95%+ accurate
- For critical documents, verify manually
- Add manual override option

---

## 📊 **Response Format**

```json
{
  "success": true,
  "expiry_date": "2025-12-31",
  "formatted_date": "December 31, 2025",
  "days_until_expiry": 447,
  "urgency": "low",
  "should_create_reminder": true,
  "message": "Expiry date found: December 31, 2025"
}
```

### **Urgency Levels:**
- `expired`: ≤ 0 days (RED - renew NOW)
- `high`: 1-30 days (ORANGE - renew SOON)
- `medium`: 31-90 days (YELLOW - plan renewal)
- `low`: > 90 days (GREEN - all good)

---

## 🚀 **Next Steps**

1. **Test the scanner** with a sample document
2. **Integrate into Documents page** UI
3. **Add auto-reminder creation**
4. **Show expiring docs on dashboard**
5. **Add notification badges**

---

## 📚 **Complete Documentation**

See `DOCUMENT_EXPIRY_SCANNER.md` for:
- Detailed API reference
- Open source alternatives
- Integration examples
- Cost analysis
- Security considerations

---

**Your AI-powered document scanner is ready! 🎉**

Upload any document and let AI extract the expiry date automatically!

