import TopNav from '@/components/layout/TopNav'
import { useEffect, useMemo, useState } from 'react'
import { Download, Eye, Plus, Shield, IdCard, FileText, Car, X, Upload, Edit2, Trash2, Share2, Copy, Check } from 'lucide-react'

type Person = {
  id: string
  name: string
}

type DocCard = {
  id: string
  personId: string
  personName: string
  type: 'Aadhaar' | 'PAN' | 'Passport' | 'Driving License' | 'Health Insurance' | 'Other'
  number: string
  uploaded: string
  expires?: string
  fileName?: string
  fileData?: string
}

const seedPeople: Person[] = [
  { id: 'p1', name: 'Rajesh Kumar' },
  { id: 'p2', name: 'Priya Kumar' },
]

const seedDocs: DocCard[] = [
  { id: 'd1', personId: 'p1', personName: 'Rajesh Kumar', type: 'Aadhaar', number: '1234 5678 9012', uploaded: '15/1/2024' },
  { id: 'd2', personId: 'p1', personName: 'Rajesh Kumar', type: 'PAN', number: 'ABCDE1234F', uploaded: '16/1/2024' },
  { id: 'd3', personId: 'p1', personName: 'Rajesh Kumar', type: 'Passport', number: 'A1234567', uploaded: '20/1/2024', expires: '15/6/2029' },
  { id: 'd4', personId: 'p2', personName: 'Priya Kumar', type: 'Driving License', number: 'DL1420110012345', uploaded: '1/2/2024', expires: '30/8/2025' },
  { id: 'd5', personId: 'p2', personName: 'Priya Kumar', type: 'Health Insurance', number: 'HI789012345', uploaded: '25/1/2024', expires: '31/3/2025' },
]

function DocIcon({ type }: { type: DocCard['type'] }) {
  const common = 'w-5 h-5'
  switch (type) {
    case 'Aadhaar':
    case 'PAN':
    case 'Passport':
    case 'Other':
      return <FileText className={common} />
    case 'Driving License':
      return <Car className={common} />
    case 'Health Insurance':
      return <Shield className={common} />
  }
}

export default function DocumentsPage() {
  const [people] = useState<Person[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_people')
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) && arr.length > 0 ? arr.map(p => ({ id: p.id, name: p.name })) : seedPeople
    } catch {
      return seedPeople
    }
  })
  
  const [docs, setDocs] = useState<DocCard[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_documents')
      return raw ? JSON.parse(raw) : seedDocs
    } catch {
      return seedDocs
    }
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<DocCard | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  
  const [newDoc, setNewDoc] = useState<Partial<DocCard>>({
    personId: people[0]?.id || 'p1',
    personName: people[0]?.name || 'Rajesh Kumar',
    type: 'Aadhaar',
    number: '',
    uploaded: new Date().toLocaleDateString('en-GB'),
    expires: '',
    fileName: '',
    fileData: ''
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    localStorage.setItem('kutum_documents', JSON.stringify(docs))
    window.dispatchEvent(new CustomEvent('dataChanged'))
  }, [docs])

  const [personFilter, setPersonFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    return docs.filter(d => (personFilter === 'all' || d.personId === personFilter) && (typeFilter === 'all' || d.type === typeFilter as any))
  }, [docs, personFilter, typeFilter])

  const uniqueTypes = useMemo(() => Array.from(new Set(docs.map(d => d.type))), [docs])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB')
        return
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPG, and PNG files are allowed')
        return
      }
      
      setUploadedFile(file)
      
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewDoc({
          ...newDoc,
          fileName: file.name,
          fileData: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddDocument = () => {
    if (!newDoc.number) {
      alert('Please fill in the document number')
      return
    }
    
    const selectedPerson = people.find(p => p.id === newDoc.personId)
    const docToAdd: DocCard = {
      id: Date.now().toString(),
      personId: newDoc.personId || people[0]?.id || 'p1',
      personName: selectedPerson?.name || newDoc.personName || 'Unknown',
      type: newDoc.type as DocCard['type'],
      number: newDoc.number,
      uploaded: newDoc.uploaded || new Date().toLocaleDateString('en-GB'),
      expires: newDoc.expires,
      fileName: newDoc.fileName,
      fileData: newDoc.fileData
    }
    
    setDocs([...docs, docToAdd])
    setShowAddModal(false)
    setUploadedFile(null)
    setNewDoc({
      personId: people[0]?.id || 'p1',
      personName: people[0]?.name || 'Rajesh Kumar',
      type: 'Aadhaar',
      number: '',
      uploaded: new Date().toLocaleDateString('en-GB'),
      expires: '',
      fileName: '',
      fileData: ''
    })
  }

  const handlePersonChange = (personId: string) => {
    const selectedPerson = people.find(p => p.id === personId)
    setNewDoc({
      ...newDoc,
      personId,
      personName: selectedPerson?.name || ''
    })
  }

  const handleViewDocument = (doc: DocCard) => {
    if (doc.fileData) {
      // Open the file in a new tab
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${doc.type} - ${doc.personName}</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f3f4f6;">
              ${doc.fileData.startsWith('data:application/pdf') 
                ? `<iframe src="${doc.fileData}" style="width:100%;height:100vh;border:none;"></iframe>`
                : `<img src="${doc.fileData}" style="max-width:100%;max-height:100vh;object-fit:contain;" />`
              }
            </body>
          </html>
        `)
      }
    } else {
      alert('No file uploaded for this document')
    }
  }

  const handleDownloadDocument = (doc: DocCard) => {
    if (doc.fileData && doc.fileName) {
      const link = document.createElement('a')
      link.href = doc.fileData
      link.download = doc.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('No file available to download')
    }
  }

  const handleEditClick = (doc: DocCard) => {
    setSelectedDoc(doc)
    setNewDoc({
      personId: doc.personId,
      personName: doc.personName,
      type: doc.type,
      number: doc.number,
      uploaded: doc.uploaded,
      expires: doc.expires,
      fileName: doc.fileName,
      fileData: doc.fileData
    })
    setShowEditModal(true)
  }

  const handleUpdateDocument = () => {
    if (!newDoc.number) {
      alert('Please fill in the document number')
      return
    }
    
    if (selectedDoc) {
      const selectedPerson = people.find(p => p.id === newDoc.personId)
      const updatedDoc: DocCard = {
        ...selectedDoc,
        personId: newDoc.personId || selectedDoc.personId,
        personName: selectedPerson?.name || newDoc.personName || selectedDoc.personName,
        type: newDoc.type as DocCard['type'],
        number: newDoc.number,
        uploaded: newDoc.uploaded || selectedDoc.uploaded,
        expires: newDoc.expires,
        fileName: newDoc.fileName || selectedDoc.fileName,
        fileData: newDoc.fileData || selectedDoc.fileData
      }
      
      setDocs(docs.map(d => d.id === selectedDoc.id ? updatedDoc : d))
      setShowEditModal(false)
      setSelectedDoc(null)
      setUploadedFile(null)
      setNewDoc({
        personId: people[0]?.id || 'p1',
        personName: people[0]?.name || 'Rajesh Kumar',
        type: 'Aadhaar',
        number: '',
        uploaded: new Date().toLocaleDateString('en-GB'),
        expires: '',
        fileName: '',
        fileData: ''
      })
    }
  }

  const handleDeleteDocument = (doc: DocCard) => {
    if (confirm(`Are you sure you want to delete ${doc.type} for ${doc.personName}?`)) {
      setDocs(docs.filter(d => d.id !== doc.id))
    }
  }

  const handleShareClick = (doc: DocCard) => {
    setSelectedDoc(doc)
    setShowShareModal(true)
    setCopiedLink(false)
  }

  const handleCopyLink = () => {
    if (selectedDoc) {
      const shareableLink = `${window.location.origin}/documents/${selectedDoc.id}`
      navigator.clipboard.writeText(shareableLink).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      })
    }
  }

  const handleNativeShare = async () => {
    if (selectedDoc && navigator.share) {
      try {
        await navigator.share({
          title: `${selectedDoc.type} - ${selectedDoc.personName}`,
          text: `Document: ${selectedDoc.type}\nNumber: ${selectedDoc.number}\nPerson: ${selectedDoc.personName}`,
          url: `${window.location.origin}/documents/${selectedDoc.id}`
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      alert('Sharing is not supported on this browser')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav role="user" />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Documents</h1>
            <p className="text-gray-600">Manage and organize your family's important documents</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Filter by Person</div>
                <select value={personFilter} onChange={e => setPersonFilter(e.target.value)} className="border rounded-lg px-3 py-2">
                  <option value="all">All Family Members</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Document Type</div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded-lg px-3 py-2">
                  <option value="all">All Documents</option>
                  {uniqueTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(card => (
              <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
                    <DocIcon type={card.type} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{card.type}</div>
                    <div className="text-sm text-gray-600">{card.personName}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-700 mb-3">
                  <div className="flex justify-between"><span className="text-gray-500">Document Number:</span><span className="font-medium">{card.number}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Uploaded:</span><span>{card.uploaded}</span></div>
                  {card.expires && (
                    <div className="flex justify-between"><span className="text-gray-500">Expires:</span><span className="text-rose-600 font-medium">{card.expires}</span></div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewDocument(card)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(card)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditClick(card)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleShareClick(card)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(card)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Document</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Person Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Member *</label>
                <select
                  value={newDoc.personId}
                  onChange={(e) => handlePersonChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {people.map(person => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({...newDoc, type: e.target.value as DocCard['type']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Document Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Number *</label>
                <input
                  type="text"
                  value={newDoc.number}
                  onChange={(e) => setNewDoc({...newDoc, number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter document number"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document File (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG up to 5MB
                    </span>
                  </label>
                </div>
                {uploadedFile && (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-900">{uploadedFile.name}</p>
                        <p className="text-xs text-emerald-600">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null)
                        setNewDoc({...newDoc, fileName: '', fileData: ''})
                      }}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Date and Expiry Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Date</label>
                  <input
                    type="text"
                    value={newDoc.uploaded}
                    onChange={(e) => setNewDoc({...newDoc, uploaded: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                  <input
                    type="text"
                    value={newDoc.expires || ''}
                    onChange={(e) => setNewDoc({...newDoc, expires: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Make sure to keep your documents secure and update expiry dates regularly.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDocument}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {showEditModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Document</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedDoc(null)
                  setUploadedFile(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Person Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Member *</label>
                <select
                  value={newDoc.personId}
                  onChange={(e) => handlePersonChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {people.map(person => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({...newDoc, type: e.target.value as DocCard['type']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Document Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Number *</label>
                <input
                  type="text"
                  value={newDoc.number}
                  onChange={(e) => setNewDoc({...newDoc, number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter document number"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Document File (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload-edit"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload-edit"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploadedFile ? uploadedFile.name : (newDoc.fileName || 'Click to upload or drag and drop')}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG up to 5MB
                    </span>
                  </label>
                </div>
                {uploadedFile && (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-900">{uploadedFile.name}</p>
                        <p className="text-xs text-emerald-600">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null)
                        setNewDoc({...newDoc, fileName: selectedDoc.fileName, fileData: selectedDoc.fileData})
                      }}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Date and Expiry Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Date</label>
                  <input
                    type="text"
                    value={newDoc.uploaded}
                    onChange={(e) => setNewDoc({...newDoc, uploaded: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                  <input
                    type="text"
                    value={newDoc.expires || ''}
                    onChange={(e) => setNewDoc({...newDoc, expires: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedDoc(null)
                  setUploadedFile(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Document Modal */}
      {showShareModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Share Document</h2>
                <button 
                  onClick={() => {
                    setShowShareModal(false)
                    setSelectedDoc(null)
                    setCopiedLink(false)
                  }}
                  className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Document Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center">
                    <DocIcon type={selectedDoc.type} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedDoc.type}</div>
                    <div className="text-sm text-gray-600">{selectedDoc.personName}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Number:</span> {selectedDoc.number}
                </div>
              </div>

              {/* Copy Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/documents/${selectedDoc.id}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      copiedLink 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Native Share */}
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
                >
                  <Share2 className="h-5 w-5" />
                  Share via Apps
                </button>
              )}

              {/* Share Options */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Share this document with family members or healthcare providers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


