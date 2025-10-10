import React, { useEffect, useMemo, useState } from 'react';
// import TopNav from '@/components/layout/TopNav' // Assuming you have this component
import { Plus, Heart, Pill, ClipboardList, User, FileText, Download, Edit2, MoreVertical, Syringe, Calendar, X } from 'lucide-react';

// --- Type Definitions ---

type Person = {
  id: string;
  name: string;
};

type RecordType = 'Condition' | 'Medication' | 'Procedure' | 'Allergy' | 'Vaccination' | 'Other';
type RecordStatus = 'Ongoing' | 'Resolved' | 'Active'; // For conditions/medications

type HealthRecord = {
  id: string;
  personId: string;
  personName: string;
  type: RecordType;
  title: string;
  description: string;
  date: string; // Date of diagnosis/start/procedure
  status: RecordStatus;
};

type StatsCardProps = {
  icon: React.ElementType; // Lucide icon component
  title: string;
  value: number;
  color: 'red' | 'blue' | 'green';
};

// --- Seed Data ---

const seedPeople: Person[] = [
  { id: 'p1', name: 'Rajesh Kumar' },
  { id: 'p2', name: 'Priya Kumar' },
  { id: 'p3', name: 'Vikram Singh' },
];

const seedRecords: HealthRecord[] = [
  {
    id: 'h1',
    personId: 'p1',
    personName: 'Rajesh Kumar',
    type: 'Condition',
    title: 'Hypertension',
    description: 'Mild hypertension, controlled with medication.',
    date: '2023-06-15',
    status: 'Ongoing',
  },
  {
    id: 'h2',
    personId: 'p1',
    personName: 'Rajesh Kumar',
    type: 'Medication',
    title: 'Amlodipine 5mg',
    description: 'Daily tablet for blood pressure control.',
    date: '2023-06-15',
    status: 'Active',
  },
  {
    id: 'h3',
    personId: 'p2',
    personName: 'Priya Kumar',
    type: 'Vaccination',
    title: 'Influenza Vaccine',
    description: 'Annual flu shot.',
    date: '2024-10-01',
    status: 'Resolved',
  },
  {
    id: 'h4',
    personId: 'p3',
    personName: 'Vikram Singh',
    type: 'Allergy',
    title: 'Pollen',
    description: 'Seasonal allergy, managed with antihistamines.',
    date: '2020-05-10',
    status: 'Ongoing',
  },
];

// --- Helper Components ---

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, color }) => {
  let iconBgClass = '';
  let iconTextClass = '';
  switch (color) {
    case 'red': iconBgClass = 'bg-red-100'; iconTextClass = 'text-red-600'; break;
    case 'blue': iconBgClass = 'bg-blue-100'; iconTextClass = 'text-blue-600'; break;
    case 'green': iconBgClass = 'bg-green-100'; iconTextClass = 'text-green-600'; break;
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

const HealthRecordCard: React.FC<{ record: HealthRecord }> = ({ record }) => {
  const isOngoing = record.status === 'Ongoing' || record.status === 'Active';
  
  let icon: React.ElementType = FileText;
  let iconBgClass = 'bg-gray-100';
  let iconTextClass = 'text-gray-600';

  if (record.type === 'Condition') {
    icon = Heart;
    iconBgClass = 'bg-red-100';
    iconTextClass = 'text-red-600';
  } else if (record.type === 'Medication') {
    icon = Pill;
    iconBgClass = 'bg-blue-100';
    iconTextClass = 'text-blue-600';
  } else if (record.type === 'Vaccination' || record.type === 'Procedure') {
    icon = Syringe;
    iconBgClass = 'bg-emerald-100';
    iconTextClass = 'text-emerald-600';
  }

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg grid place-items-center ${iconBgClass} ${iconTextClass}`}>
        <Heart className="w-6 h-6" /> {/* Always use a general icon for the main card list matching the image */}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
            {isOngoing && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {record.status}
              </span>
            )}
            {!isOngoing && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {record.status}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 mb-2">{record.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{record.personName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(record.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

type ActiveTab = 'all' | 'ongoing' | 'medications';

export default function HealthPage() {
  // 1. Initialize state from localStorage or seed data
  const [people] = useState<Person[]>(seedPeople);
  const [records, setRecords] = useState<HealthRecord[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_health_records');
      return raw ? JSON.parse(raw) : seedRecords;
    } catch {
      return seedRecords;
    }
  });

  // 2. Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kutum_health_records', JSON.stringify(records));
  }, [records]);

  // --- Filtering State ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [personFilter, setPersonFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all'); // RecordType filter
  const [showAddModal, setShowAddModal] = useState(false);

  // Function to dispatch activity
  const dispatchActivity = (action: string, description: string) => {
    window.dispatchEvent(new CustomEvent('activityAdded', {
      detail: { type: 'health', action, description }
    }));
  };

  // --- Calculations for Stats Cards ---
  const ongoingConditions = useMemo(() => 
    records.filter(r => r.type === 'Condition' && r.status === 'Ongoing').length,
    [records]
  );

  const currentMedications = useMemo(() => 
    records.filter(r => r.type === 'Medication' && r.status === 'Active').length,
    [records]
  );

  const totalRecords = records.length;

  const statsData: StatsCardProps[] = [
    { icon: Heart, title: 'Ongoing Conditions', value: ongoingConditions, color: 'red' },
    { icon: Pill, title: 'Current Medications', value: currentMedications, color: 'blue' },
    { icon: ClipboardList, title: 'Total Records', value: totalRecords, color: 'green' },
  ];

  // --- Filtering Logic ---
  const uniqueRecordTypes = useMemo(() => Array.from(new Set(records.map(r => r.type))).sort(), [records]);
  
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // 1. Filter by Active Tab
    if (activeTab === 'ongoing') {
      filtered = filtered.filter(r => r.status === 'Ongoing' || r.status === 'Active');
    } else if (activeTab === 'medications') {
      filtered = filtered.filter(r => r.type === 'Medication' && r.status === 'Active');
    }

    // 2. Filter by Person
    if (personFilter !== 'all') {
      filtered = filtered.filter(r => r.personId === personFilter);
    }

    // 3. Filter by Record Type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter as RecordType);
    }

    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, activeTab, personFilter, typeFilter]);

  // Function for adding a new record
  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSaveRecord = () => {
    // Create a new health record
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      personId: 'p1', // Default person for now
      personName: 'Rajesh Kumar', // Default person name
      type: 'Condition', // Default type
      title: 'New Health Record',
      description: 'Health record added',
      date: new Date().toISOString().split('T')[0],
      status: 'Ongoing'
    };
    
    setRecords(prev => [...prev, newRecord]);
    
    // Dispatch activity
    dispatchActivity('added', `Added health record: ${newRecord.title}`);
    
    setShowAddModal(false);
  };


  const tabClasses = (tab: ActiveTab) => 
    `px-4 py-2 text-sm font-medium transition duration-150 rounded-lg ${
      activeTab === tab
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100'
    }`;


  return (
    <div className="w-full">
      {/* <TopNav role="user" /> */}

      <div>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Health Records</h1>
            <p className="text-gray-600">Track family health conditions, medications, and medical history</p>
          </div>

          {/* Stats Cards and Add Record Button */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statsData.map((data, index) => (
              <StatsCard key={index} {...data} />
            ))}
            <button
              onClick={handleAddRecord}
              className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 transition duration-300 cursor-pointer hover:bg-gray-50 hover:border-emerald-400"
            >
              <Plus className="w-5 h-5 text-emerald-600" />
              <span className="text-base font-semibold text-emerald-600">Add Record</span>
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex space-x-1 p-1 bg-white rounded-xl shadow-sm border border-gray-200">
              <button 
                onClick={() => setActiveTab('all')} 
                className={tabClasses('all')}
              >
                All Records
              </button>
              <button 
                onClick={() => setActiveTab('ongoing')} 
                className={tabClasses('ongoing')}
              >
                Ongoing Conditions
              </button>
              <button 
                onClick={() => setActiveTab('medications')} 
                className={tabClasses('medications')}
              >
                Current Medications
              </button>
            </div>
            
          </div>
          
          {/* Filters and Export */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-start mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Filter by Person</div>
                <select 
                  value={personFilter} 
                  onChange={e => setPersonFilter(e.target.value)} 
                  className="border rounded-lg px-3 py-2 text-gray-700"
                >
                  <option value="all">All Family Members</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Record Type</div>
                <select 
                  value={typeFilter} 
                  onChange={e => setTypeFilter(e.target.value)} 
                  className="border rounded-lg px-3 py-2 text-gray-700"
                >
                  <option value="all">All Record Types</option>
                  {uniqueRecordTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='md:ml-auto pt-5 md:pt-0'>
                <button className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-150 shadow-sm">
                  <Download className="w-4 h-4" />
                  Export Records
                </button>
            </div>
          </div>


          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <HealthRecordCard key={record.id} record={record} />
              ))
            ) : (
              <div className="p-6 text-center bg-white rounded-xl shadow-md border border-gray-200 text-gray-600">
                No health records found matching the current filters.
              </div>
            )}
          </div>

          {/* Add Health Record Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Add Health Record</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Add a new health record for family members.
                  </p>
                  <div className="text-sm text-gray-500">
                    This feature will be implemented in the next update.
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRecord}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Record
                  </button>
                </div>
              </div>
            </div>
          )}
          
      </div>
    </div>
  );
}
