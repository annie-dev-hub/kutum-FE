import { useEffect, useMemo, useState } from 'react'
import { Search, Edit2, Lock, Plus, Trash2, X } from 'lucide-react'
import Pagination from '@/components/common/Pagination'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export const DOCUMENT_TYPES_STORAGE_KEY = 'kutum_document_types'

type DocType = {
  id: number
  name: string
  description: string
  status: 'Active' | 'Inactive'
  isPredefined: boolean
}

const PREDEFINED: DocType[] = [
  { id: 1, name: 'Aadhar', description: 'Default', status: 'Active', isPredefined: true },
  { id: 2, name: 'PAN', description: 'Default', status: 'Active', isPredefined: true },
  { id: 3, name: 'Passport', description: 'Default', status: 'Active', isPredefined: true },
  { id: 4, name: 'Voter ID', description: 'Default', status: 'Active', isPredefined: true },
  { id: 5, name: 'DL', description: 'Default', status: 'Active', isPredefined: true },
  { id: 6, name: 'Vehicle RC', description: 'Default', status: 'Active', isPredefined: true },
  { id: 7, name: 'Insurance', description: 'Default', status: 'Active', isPredefined: true },
  { id: 8, name: 'Birth Certificate', description: 'Default', status: 'Active', isPredefined: true },
]

export default function DocumentTypesPage() {
  const { isAdmin } = useAuth()
  
  // Redirect non-admin users to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<DocType[]>(() => {
    try {
      const stored = localStorage.getItem(DOCUMENT_TYPES_STORAGE_KEY)
      return stored ? JSON.parse(stored) : PREDEFINED
    } catch {
      return PREDEFINED
    }
  })
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const data = rows
    if (!q) return data
    return data.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    )
  }, [query, rows])

  const [page, setPage] = useState(1)
  const pageSize = parseInt(import.meta.env.VITE_PAGE_SIZE) || 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const addNew = () => {
    const name = form.name.trim()
    if (!name) return
    const next: DocType = {
      id: rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
      name,
      description: form.description.trim() || `${name} document`,
      status: 'Active',
      isPredefined: false,
    }
    setRows((r) => [...r, next])
    setForm({ name: '', description: '' })
    setShowForm(false)
  }

  const startEdit = (row: DocType) => {
    setEditingId(row.id)
    setForm({ name: row.name, description: row.description })
    setShowForm(true)
  }

  const saveEdit = () => {
    if (editingId === null) return
    const name = form.name.trim()
    if (!name) return
    setRows((r) => r.map((x) => (x.id === editingId ? { ...x, name, description: form.description.trim() } : x)))
    setEditingId(null)
    setShowForm(false)
    setForm({ name: '', description: '' })
  }

  const remove = (id: number) => setRows((r) => r.filter((x) => x.id !== id))

  // Save to localStorage whenever rows change
  useEffect(() => {
    localStorage.setItem(DOCUMENT_TYPES_STORAGE_KEY, JSON.stringify(rows))
    // Dispatch custom event to update dashboard counts
    window.dispatchEvent(new CustomEvent('dataChanged'))
  }, [rows])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Document Types Management</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 ring-primary" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Lock />
            <span>Predefined items are read-only</span>
          </div>
          <button onClick={() => setShowForm(true)} className="gradient-btn px-4 py-2 flex items-center gap-2">
            <Plus />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600 text-sm">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((g, idx) => (
                <tr key={g.id} className={idx % 2 ? 'bg-slate-50/40' : ''}>
                  <td className="px-6 py-4 text-slate-700">{g.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{g.name}</td>
                  <td className="px-6 py-4 text-slate-600">{g.description}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${g.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${g.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                      {g.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {g.isPredefined ? (
                      <span title="Read-only" className="text-slate-400 inline-flex items-center gap-2">
                        <Lock />
                      </span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button title="Edit" onClick={() => startEdit(g)} className="text-blue-600 inline-flex items-center">
                          <Edit2 />
                        </button>
                        <button title="Delete" onClick={() => remove(g.id)} className="text-rose-600 inline-flex items-center">
                          <Trash2 />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <div className="w-full max-w-lg card p-6 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X />
            </button>
            <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Document Type' : 'Add Document Type'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary" placeholder="e.g. PAN" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary" placeholder="Short description" />
              </div>
              {/* Status removed from input; defaults to Active for new rows */}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700">Cancel</button>
                {editingId ? (
                  <button onClick={saveEdit} className="gradient-btn px-4 py-2">Save Changes</button>
                ) : (
                  <button onClick={addNew} className="gradient-btn px-4 py-2">Save</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


