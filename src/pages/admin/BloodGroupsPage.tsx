/**
 * Blood Groups Management Page
 * Connected to Backend API for CRUD operations
 */

import Pagination from '@/components/common/Pagination'
import { useAuth } from '@/contexts/AuthContext'
import type { BloodGroupType, CreateBloodGroupDto, UpdateBloodGroupDto } from '@/types/api'
import { bloodGroupService } from '@/utils/api'
import { Edit2, Lock, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

export default function BloodGroupsPage() {
  const { isAdmin } = useAuth()
  
  // Redirect non-admin users to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // State
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<BloodGroupType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 10

  /**
   * Fetch blood groups from backend
   */
  const fetchBloodGroups = async () => {
    try {
      setLoading(true)
      const response = await bloodGroupService.getAll({
        page,
        limit: pageSize,
        search: query || undefined,
        sort_by: 'name',
        sort_order: 'ASC',
      })
      
      setRows(response.items)
      setTotalPages(response.meta.totalPages)
      setTotalItems(response.meta.totalItems)
      setPage(response.meta.currentPage)
    } catch (error) {
      console.error('Error fetching blood groups:', error)
      toast.error('Failed to load blood groups')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when page or search query changes
  useEffect(() => {
    fetchBloodGroups()
  }, [page, query])

  /**
   * Add new blood group
   */
  const addNew = async () => {
    const name = form.name.trim()
    if (!name) {
      toast.error('Please enter a name')
      return
    }

    try {
      setSubmitting(true)
      const data: CreateBloodGroupDto = {
        name,
        description: form.description.trim() || undefined,
        is_active: true,
      }
      
      await bloodGroupService.create(data)
      toast.success('Blood group added successfully')
      
      // Reset form and refresh list
      setForm({ name: '', description: '' })
      setShowForm(false)
      // Reset to page 1 to see the new item
      setPage(1)
      fetchBloodGroups()
    } catch (error) {
      console.error('Error adding blood group:', error)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Start editing a blood group
   */
  const startEdit = (row: BloodGroupType) => {
    setEditingId(row.id)
    setForm({ name: row.name, description: row.description || '' })
    setShowForm(true)
  }

  /**
   * Save edited blood group
   */
  const saveEdit = async () => {
    if (editingId === null) return
    
    const name = form.name.trim()
    if (!name) {
      toast.error('Please enter a name')
      return
    }

    try {
      setSubmitting(true)
      const data: UpdateBloodGroupDto = {
        name,
        description: form.description.trim() || undefined,
      }
      
      await bloodGroupService.update(editingId, data)
      toast.success('Blood group updated successfully')
      
      // Reset form and refresh list
      setEditingId(null)
      setShowForm(false)
      setForm({ name: '', description: '' })
      fetchBloodGroups()
    } catch (error) {
      console.error('Error updating blood group:', error)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Delete blood group (soft delete)
   */
  const remove = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await bloodGroupService.delete(id)
      toast.success('Blood group deleted successfully')
      fetchBloodGroups()
    } catch (error) {
      console.error('Error deleting blood group:', error)
    }
  }

  /**
   * Close form modal
   */
  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', description: '' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Blood Groups Management</h1>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1) // Reset to first page on search
            }}
            placeholder="Search by name or description..."
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm">
            <Lock className="w-4 h-4" />
            <span>Predefined items are read-only</span>
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="gradient-btn px-3 sm:px-4 py-2 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-600 text-sm">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Description</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        {query ? 'No blood groups found matching your search.' : 'No blood groups found. Add one to get started.'}
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                        <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
                          {row.description || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              row.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {row.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {row.is_predefined ? (
                            <span className="flex items-center gap-1 text-slate-500 text-sm">
                              <Lock className="w-3 h-3" />
                              <span>Predefined</span>
                            </span>
                          ) : (
                            <span className="text-slate-600 text-sm">Custom</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(row)}
                              disabled={row.is_predefined}
                              className={`p-2 rounded-lg transition-colors ${
                                row.is_predefined
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title={row.is_predefined ? 'Cannot edit predefined items' : 'Edit'}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => remove(row.id, row.name)}
                              disabled={row.is_predefined}
                              className={`p-2 rounded-lg transition-colors ${
                                row.is_predefined
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={row.is_predefined ? 'Cannot delete predefined items' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Blood Group' : 'Add New Blood Group'}
              </h2>
              <button
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., A+, B-, O+"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter description..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50 rounded-b-2xl">
              <button
                onClick={closeForm}
                disabled={submitting}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? saveEdit : addNew}
                disabled={submitting || !form.name.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <span>{editingId ? 'Update' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
