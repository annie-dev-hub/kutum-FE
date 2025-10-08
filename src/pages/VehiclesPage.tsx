import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Plus, Car, Bike, ShieldCheck, FileText, Calendar, MoreVertical, Gauge, Truck, X, Trash2, Edit2, Share2, Clipboard, ChevronDown, ChevronUp } from 'lucide-react';

// --- Type Definitions ---

type VehicleType = 'car' | 'bike' | 'truck';
type DocumentName = 'Insurance' | 'PUC' | 'Registration Certificate';

type DocumentStatus = {
  name: DocumentName;
  expires: string; // Used for Insurance/PUC
  validUntil?: string; // Used specifically for RC long expiry date
  documentUrl: string; // Stores either a URL or the simulated file name (e.g., 'document.pdf')
};

// Derived status used internally after processing
type ProcessedDocument = DocumentStatus & {
  isExpired: boolean;
  isExpiringSoon: boolean;
};

type Vehicle = {
  id: string;
  type: VehicleType;
  model: string;
  name: string;
  number: string; // Vehicle registration number
  documents: DocumentStatus[];
};

// Vehicle type with processed documents for display
type DisplayVehicle = Omit<Vehicle, 'documents'> & {
  documents: ProcessedDocument[];
};

type StatsCardProps = {
  icon: React.ElementType;
  title: string;
  value: number;
  color: 'blue' | 'red' | 'green';
};

// --- Helper Functions for Data Processing ---

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today for consistent comparisons

/**
 * Checks document status dynamically based on the current date.
 */
const checkDocumentStatus = (doc: DocumentStatus): ProcessedDocument => {
  const expiryDate = doc.expires ? new Date(doc.expires) : null;

  // Set time to end of the day for fairer comparison
  if (expiryDate) expiryDate.setHours(23, 59, 59, 999);

  const isExpired = expiryDate ? expiryDate.getTime() < today.getTime() : false;

  const timeToExpiry = expiryDate ? expiryDate.getTime() - today.getTime() : Infinity;
  const isExpiringSoon = !isExpired && timeToExpiry <= ONE_MONTH_MS;

  return {
    ...doc,
    isExpired,
    isExpiringSoon,
  };
};

/**
 * Processes raw vehicle data to calculate real-time expiry statuses.
 */
const processVehiclesData = (rawVehicles: Vehicle[]): DisplayVehicle[] => {
  return rawVehicles.map(vehicle => ({
    ...vehicle,
    documents: vehicle.documents.map(checkDocumentStatus),
  }));
};

// Default document structure for new vehicles
const defaultDocuments: DocumentStatus[] = [
  { name: 'Insurance', expires: '', validUntil: '', documentUrl: '' },
  { name: 'PUC', expires: '', validUntil: '', documentUrl: '' },
  { name: 'Registration Certificate', expires: '', validUntil: '', documentUrl: '' },
];

const initialVehicle: Vehicle = {
  id: '',
  type: 'car',
  name: '',
  model: '',
  number: '',
  documents: defaultDocuments,
};

// --- Seed Data (Initial load data) ---
const seedVehicles: Vehicle[] = [
  {
    id: 'v1',
    type: 'car',
    name: 'Honda City',
    model: '2020 Model',
    number: 'DL 8C AB 1234',
    documents: [
      { name: 'Insurance', expires: '2025-04-15', validUntil: '', documentUrl: 'insurance_honda.pdf' },
      { name: 'PUC', expires: '2024-12-20', validUntil: '', documentUrl: 'https://docs.example.com/honda-puc' },
      { name: 'Registration Certificate', validUntil: '2035-06-10', expires: '', documentUrl: 'rc_image.jpg' },
    ],
  },
  {
    id: 'v2',
    type: 'bike',
    name: 'Royal Enfield Classic',
    model: '2019 Model',
    number: 'DL 4S CD 5678',
    documents: [
      { name: 'Insurance', expires: '2024-11-30', validUntil: '', documentUrl: 're_insurance.doc' },
      { name: 'PUC', expires: '2024-10-25', validUntil: '', documentUrl: '' },
      { name: 'Registration Certificate', validUntil: '2034-08-22', expires: '', documentUrl: 're_rc.pdf' },
    ],
  },
];

// ----------------------------------------------------
// --- Sub-Components: Helpers and Modals (Defined First) ---
// ----------------------------------------------------

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, color }) => {
  let iconBgClass = '';
  let iconTextClass = '';
  switch (color) {
    case 'blue': iconBgClass = 'bg-blue-100'; iconTextClass = 'text-blue-600'; break;
    case 'red': iconBgClass = 'bg-red-100'; iconTextClass = 'text-red-600'; break;
    case 'green': iconBgClass = 'bg-emerald-100'; iconTextClass = 'text-emerald-600'; break;
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBgClass} ${iconTextClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// New component for Document Inputs (replaces the collapsible)
interface DocumentInputsProps {
    docName: DocumentName;
    doc: DocumentStatus;
    handleDocumentChange: (docName: DocumentName, field: keyof DocumentStatus, value: string) => void;
}

const DocumentInputs: React.FC<DocumentInputsProps> = ({ 
    docName, 
    doc, 
    handleDocumentChange, 
}) => {
    
    // Determine title and date field based on document type
    const dateLabel = docName === 'Registration Certificate' ? 'Valid Until Date' : 'Expiry Date';
    const dateField = docName === 'Registration Certificate' ? 'validUntil' : 'expires';
    const dateValue = docName === 'Registration Certificate' ? doc.validUntil : doc.expires;

    return (
        <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className='flex items-center space-x-3'>
                <FileText className='w-5 h-5 text-blue-600' />
                <h5 className='text-lg font-semibold text-gray-800'>{docName} Details</h5>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{dateLabel}</label>
                    <input
                        type="date"
                        // Ensure we use the correct field for the input value
                        value={dateValue || ''}
                        onChange={(e) => handleDocumentChange(docName, dateField, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        required={docName !== 'Registration Certificate'} // RC is long-term, other two are required
                    />
                </div>

                {/* File Upload / URL Input */}
                <div className='col-span-1'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document (PDF, DOC, IMG or URL)</label>
                    
                    {/* Display current file name if available and not a URL */}
                    {doc.documentUrl && doc.documentUrl.length > 0 && !doc.documentUrl.startsWith('http') && (
                        <p className="text-xs text-gray-600 mb-1 truncate">Current file: <span className="font-semibold">{doc.documentUrl}</span></p>
                    )}
                    
                    {/* File Input */}
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            if (file) {
                                // Simulate successful upload by storing the file name
                                handleDocumentChange(docName, 'documentUrl', file.name);
                                e.target.value = ''; 
                            }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    
                    {/* Fallback for entering a URL directly */}
                    {(!doc.documentUrl || doc.documentUrl.startsWith('http')) && (
                        <input
                            type="url"
                            value={doc.documentUrl || ''}
                            onChange={(e) => handleDocumentChange(docName, 'documentUrl', e.target.value)}
                            placeholder="...or enter an external URL"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};


interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  initialData: Vehicle | null;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [vehicle, setVehicle] = useState<Vehicle>(initialData || initialVehicle);
  // State to manage which document the user wants to edit/view now (from the dropdown)
  const [selectedDocumentName, setSelectedDocumentName] = useState<DocumentName | ''>(''); 
  
  const docNames: DocumentName[] = ['Insurance', 'PUC', 'Registration Certificate'];

  useEffect(() => {
    // Reset form when modal opens or initialData changes
    if (isOpen) {
      if (initialData) {
        setVehicle(initialData);
      } else {
        // Ensure new vehicle has all default document placeholders and a fresh ID
        setVehicle({ ...initialVehicle, id: crypto.randomUUID(), documents: defaultDocuments.map(d => ({ ...d })) });
      }
      // Reset the selected document on open
      setSelectedDocumentName('');
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (docName: DocumentName, field: keyof DocumentStatus, value: string) => {
    const newDocuments = vehicle.documents.map(doc => {
        if (doc.name === docName) {
            // Merge the existing document data with the new field value
            return { ...doc, [field]: value };
        }
        return doc;
    });
    
    // Ensure all three documents are present (for safety, though they should be by default)
    docNames.forEach(name => {
        if (!newDocuments.find(d => d.name === name)) {
            const defaultDoc = defaultDocuments.find(d => d.name === name);
            if(defaultDoc) newDocuments.push({ ...defaultDoc });
        }
    });
    
    setVehicle(prev => ({ ...prev, documents: newDocuments }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle.name || !vehicle.number) return;
    onSave(vehicle);
    onClose();
  };

  // Find the currently selected document status object
  const selectedDoc = selectedDocumentName 
    ? vehicle.documents.find(d => d.name === selectedDocumentName) || defaultDocuments.find(d => d.name === selectedDocumentName)!
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? `Edit ${initialData.name}` : 'Add New Vehicle'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
            <input
              type="text"
              name="name"
              value={vehicle.name}
              onChange={handleChange}
              placeholder="e.g., Honda City"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              name="type"
              value={vehicle.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={vehicle.model}
              onChange={handleChange}
              placeholder="e.g., 2020 Model"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
            <input
              type="text"
              name="number"
              value={vehicle.number}
              onChange={handleChange}
              placeholder="e.g., DL 8C AB 1234"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Documents Section (Dropdown driven) */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800">Document Expiry & Upload</h4>
          
          {/* Document Selector Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Document to Update</label>
            <select
              value={selectedDocumentName}
              onChange={(e) => setSelectedDocumentName(e.target.value as DocumentName | '')}
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose a Document Type --</option>
              {docNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Document Inputs */}
          {selectedDocumentName && selectedDoc && (
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 transition-all duration-300">
                <DocumentInputs
                    docName={selectedDocumentName}
                    doc={selectedDoc}
                    handleDocumentChange={handleDocumentChange}
                />
            </div>
          )}
        </div>


        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            {initialData ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentStatus | null;
  vehicleName: string;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({ isOpen, onClose, document, vehicleName }) => {
  if (!document) return null;

  const docIdentifier = document.documentUrl || 'No document attached.';
  const hasDocument = docIdentifier !== 'No document attached.';
  const isUrl = hasDocument && docIdentifier.startsWith('http');
  const fileExtension = isUrl ? 'URL' : docIdentifier.split('.').pop()?.toUpperCase() || 'N/A';
  const docTypeDisplay = isUrl ? 'External URL' : `Simulated File (${fileExtension})`;

  // Create a simulated, unique share link based on vehicle and document name
  const safeVehicleName = vehicleName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeDocName = document.name.toLowerCase().replace(/\s/g, '-');
  const shareLink = `https://kutum-app.com/share/vehicles/${safeVehicleName}/${safeDocName}`;
  
  // State for copy button feedback
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (copyStatus === 'copied') {
      const timer = setTimeout(() => setCopyStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);
  
  // Link Copy Handler
  const handleCopy = () => {
    // Create a temporary textarea to hold the text to be copied
    const el = document.createElement('textarea');
    el.value = shareLink;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    
    // Use document.execCommand('copy') for better compatibility in embedded environments
    try {
        document.execCommand('copy');
        console.log(`Share Link Copied: ${shareLink}`);
        setCopyStatus('copied');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        setCopyStatus('idle');
    } finally {
        document.body.removeChild(el);
    }
  };
  
  // Web Share API Handler
  const handleNativeShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: `Share Vehicle Document: ${document.name}`,
                  text: `Please find the link for ${document.name} of vehicle ${vehicleName}:`,
                  url: shareLink,
              });
              console.log('Document shared successfully using Web Share API.');
          } catch (error) {
              console.error('Error sharing document:', error);
          }
      } else {
          // Fallback to copy link if native share is not available
          handleCopy();
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Viewing ${document.name} for ${vehicleName}`}>
      <div className="space-y-4">
        {/* Document Identifier */}
        <p className="text-gray-700">
          **Document Identifier ({docTypeDisplay}):** <span className="text-blue-600 break-all font-medium">{docIdentifier}</span>
        </p>
        
        {/* View Document Button/Message */}
        {isUrl ? (
            <a 
                href={docIdentifier} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-full px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-md"
            >
                <FileText className='w-5 h-5 mr-2' /> View Document (External Link)
            </a>
        ) : hasDocument ? (
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg font-medium border border-blue-200">
                <span className="font-bold">{docIdentifier}</span> has been uploaded. <span className="font-normal">In a production application, this file (PDF, DOC, or image) would be available for download or viewing.</span>
            </div>
        ) : (
             <div className="p-3 bg-red-100 text-red-700 rounded-lg font-medium border border-red-200">
                No document or URL is currently attached.
            </div>
        )}
        
        {/* Sharing Section */}
        {hasDocument && (
          <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 flex items-center mb-2">
                  <Share2 className='w-4 h-4 mr-2 text-blue-600' /> Share Document Link
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                  Share this document securely with others via link copy or native share options.
              </p>
              
              <div className="flex items-stretch space-x-2">
                  <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-grow border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 break-all truncate"
                  />
                  
                  {/* Share to Other Apps Button (Native Web Share API) */}
                  {/* This button will trigger the native OS share dialog for apps like WhatsApp/Email if available */}
                  {'share' in navigator && (
                      <button
                          onClick={handleNativeShare}
                          className="px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center justify-center shadow-md w-24"
                          title="Share to other apps (WhatsApp, Email, etc.)"
                      >
                          <Share2 className="w-4 h-4 mr-1" /> Share
                      </button>
                  )}
                  
                  {/* Copy Link Button (Always available fallback) */}
                  <button
                      onClick={handleCopy}
                      className={`px-3 py-2 text-white rounded-lg transition flex items-center justify-center shadow-md w-24 ${copyStatus === 'copied' ? 'bg-indigo-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                      title="Copy link to clipboard"
                  >
                      {copyStatus === 'copied' ? (
                          <><ShieldCheck className="w-4 h-4 mr-1" /> Copied!</>
                      ) : (
                          <><Clipboard className="w-4 h-4 mr-1" /> Copy</>
                      )}
                  </button>
              </div>
          </div>
        )}
      </div>
    </Modal>
  );
};


interface VehicleCardProps {
  vehicle: DisplayVehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onViewDocument: (doc: DocumentStatus, name: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete, onViewDocument }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const CardIcon = vehicle.type === 'car' ? Car : (vehicle.type === 'bike' ? Bike : Truck);

  const needsAttention = vehicle.documents.some(doc => doc.isExpired || doc.isExpiringSoon);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getDocStatusClass = (doc: ProcessedDocument) => {
    if (doc.isExpired) return 'text-rose-600 font-bold';
    if (doc.isExpiringSoon) return 'text-amber-600 font-medium';
    return 'text-emerald-600 font-medium';
  };
  
  // Convert DisplayVehicle back to Vehicle for editing (removing transient processed status)
  const handleEditClick = () => {
    const editableVehicle: Vehicle = {
        ...vehicle,
        documents: vehicle.documents.map(d => ({
            name: d.name,
            expires: d.expires,
            validUntil: d.validUntil,
            documentUrl: d.documentUrl,
        }))
    };
    onEdit(editableVehicle);
    setIsMenuOpen(false);
  };
  
  const handleViewDoc = (docName: DocumentName) => {
      const doc = vehicle.documents.find(d => d.name === docName);
      if (doc) {
          // Pass the raw document data for viewing/sharing
          onViewDocument({
              name: doc.name,
              expires: doc.expires,
              validUntil: doc.validUntil,
              documentUrl: doc.documentUrl
          }, vehicle.name);
      }
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-xl transition duration-300 relative ${needsAttention ? 'border-2 border-red-200' : 'border border-gray-100'}`}>
      {/* Header and Options */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
            <CardIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{vehicle.name}</h3>
            <p className="text-sm text-gray-500">{vehicle.model}</p>
            <p className="text-sm font-medium text-gray-600 mt-0.5">{vehicle.number}</p>
          </div>
        </div>
        
        {/* Action Menu Toggle */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {isMenuOpen && (
            // Close menu when clicking outside
            <div 
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 origin-top-right"
                onBlur={() => setIsMenuOpen(false)}
                tabIndex={-1}
            >
              <button 
                onClick={handleEditClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Details
              </button>
              <button 
                onClick={() => { onDelete(vehicle.id); setIsMenuOpen(false); }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Vehicle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Document Status Grid - Renamed Pollution to PUC */}
      <div className="grid grid-cols-2 gap-4 my-6">
        {vehicle.documents.filter(d => d.name !== 'Registration Certificate').map((doc, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border flex flex-col justify-between ${doc.isExpired ? 'border-rose-300 bg-rose-50' : doc.isExpiringSoon ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{doc.name}</span>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <p className={`text-xs ${getDocStatusClass(doc)}`}>
              {doc.isExpired ? 'Expired' : (doc.isExpiringSoon ? 'Expiring Soon' : 'Active')}
            </p>
            <p className="text-xs text-gray-600 mt-1">
                {doc.isExpired ? `Expired on: ${formatDate(doc.expires)}` : `Expires: ${formatDate(doc.expires)}`}
            </p>
          </div>
        ))}
      </div>

      {/* Registration Certificate (Single row) */}
      <div className="mb-4">
        {vehicle.documents.filter(d => d.name === 'Registration Certificate').map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-700">{doc.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                    Valid until: {formatDate(doc.validUntil || '')}
                </span>
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
            </div>
        ))}
      </div>

      {/* Action Buttons - Renamed Pollution to PUC */}
      <div className="flex flex-wrap gap-2 justify-start my-4 pt-2 border-t border-gray-100">
        {(['Registration Certificate', 'Insurance', 'PUC'] as DocumentName[]).map(label => (
          <button
            key={label}
            onClick={() => handleViewDoc(label)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150 shadow-sm"
          >
            {/* Display RC for Registration Certificate, and the full name for others (PUC, Insurance) */}
            View {label === 'Registration Certificate' ? 'RC' : label}
          </button>
        ))}
      </div>

      {/* Reminder Banner */}
      {needsAttention && (
        <div className="flex items-center p-3 bg-rose-50 text-rose-800 rounded-xl font-medium text-sm mt-3 border border-rose-200">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          Action Required: One or more documents are expired or expiring soon.
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// --- Main Page Component ---
// ----------------------------------------------------

export default function VehiclesPage() {
  const [rawVehicles, setRawVehicles] = useState<Vehicle[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_vehicles');
      return raw ? JSON.parse(raw) : seedVehicles;
    } catch {
      return seedVehicles;
    }
  });

  // State for Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [documentToView, setDocumentToView] = useState<{ doc: DocumentStatus, name: string } | null>(null);
  const [isDocumentViewModalOpen, setIsDocumentViewModalOpen] = useState(false);


  // Derived state (re-processes data whenever rawVehicles changes)
  const vehicles = useMemo(() => processVehiclesData(rawVehicles), [rawVehicles]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kutum_vehicles', JSON.stringify(rawVehicles));
  }, [rawVehicles]);


  // --- CRUD Handlers ---
  const handleSaveVehicle = (vehicleData: Vehicle) => {
    setRawVehicles(prev => {
      if (prev.find(v => v.id === vehicleData.id)) {
        // Edit existing vehicle
        return prev.map(v => (v.id === vehicleData.id ? vehicleData : v));
      } else {
        // Add new vehicle
        // If ID is not set yet (from initialVehicle), generate a new one
        const finalId = vehicleData.id || crypto.randomUUID();
        return [...prev, { ...vehicleData, id: finalId }];
      }
    });
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = useCallback((id: string) => {
    setVehicleToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = () => {
    if (vehicleToDelete) {
      setRawVehicles(prev => prev.filter(v => v.id !== vehicleToDelete));
    }
    setVehicleToDelete(null);
    setIsDeleteModalOpen(false);
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormModalOpen(true);
  };
  
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormModalOpen(true);
  }
  
  const handleViewDocument = (doc: DocumentStatus, name: string) => {
    setDocumentToView({ doc, name });
    setIsDocumentViewModalOpen(true);
  };


  // --- Calculations for Stats Cards ---
  const totalVehicles = vehicles.length;

  const expiringSoonCount = useMemo(() => {
    return vehicles.filter(v =>
      v.documents.some(d => d.isExpired || d.isExpiringSoon)
    ).length;
  }, [vehicles]);

  const validInsurance = useMemo(() => {
    return vehicles.filter(v =>
      v.documents.some(d => d.name === 'Insurance' && !d.isExpired && !d.isExpiringSoon)
    ).length;
  }, [vehicles]);

  const statsData: StatsCardProps[] = [
    { icon: Gauge, title: 'Total Vehicles', value: totalVehicles, color: 'blue' },
    { icon: Calendar, title: 'Action Required', value: expiringSoonCount, color: 'red' },
    { icon: ShieldCheck, title: 'Valid Insurance', value: validInsurance, color: 'green' },
  ];

  // Component for the Add Vehicle Card button
  const AddVehicleCard = () => (
    <button
      onClick={handleAddVehicle}
      className="flex items-center justify-center p-4 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 transition duration-300 cursor-pointer hover:bg-gray-50 hover:border-emerald-400"
    >
      <div className="flex items-center space-x-2">
        <Plus className="w-5 h-5 text-emerald-600" />
        <span className="text-base font-semibold text-emerald-600">Add Vehicle</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Vehicles</h1>
          <p className="text-gray-600">Manage your vehicles and track important renewals and documents</p>
        </div>

        {/* Stats Cards and Add Vehicle Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statsData.map((data, index) => (
            <StatsCard key={index} {...data} />
          ))}
          <AddVehicleCard />
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
                onViewDocument={handleViewDocument}
              />
            ))
          ) : (
            <div className="lg:col-span-2 p-6 text-center bg-white rounded-xl shadow-md border border-gray-200 text-gray-600">
              You haven't added any vehicles yet. Click "Add Vehicle" to get started!
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVehicle}
        initialData={editingVehicle}
      />
      
      {documentToView && (
          <DocumentViewModal 
              isOpen={isDocumentViewModalOpen}
              onClose={() => setIsDocumentViewModalOpen(false)}
              document={documentToView.doc}
              vehicleName={documentToView.name}
          />
      )}

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Deletion"
      >
        <p className="text-gray-700 mb-6">Are you sure you want to delete the vehicle **{vehicles.find(v => v.id === vehicleToDelete)?.name || 'this vehicle'}**? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </Modal>

    </div>
  );
}
