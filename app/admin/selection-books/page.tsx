"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Download,
  Calendar,
  User,
  Home,
  MapPin,
  Phone,
  Mail,
  Filter,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

interface SelectionBook {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  job_address: string
  house_plan: string
  house_plan_id: string
  selections: any
  notes: string
  total_upgrades_price: number
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

export default function SelectionBooksPage() {
  const [selectionBooks, setSelectionBooks] = useState<SelectionBook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBook, setSelectedBook] = useState<SelectionBook | null>(null)

  useEffect(() => {
    fetchSelectionBooks()
  }, [])

  const fetchSelectionBooks = async () => {
    try {
      const response = await fetch('/api/selection-books')
      if (response.ok) {
        const data = await response.json()
        setSelectionBooks(data)
      }
    } catch (error) {
      console.error('Error fetching selection books:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/selection-books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        fetchSelectionBooks()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this selection book?')) return
    
    try {
      const response = await fetch(`/api/selection-books/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchSelectionBooks()
        setSelectedBook(null)
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />
      case 'submitted': return <Clock className="w-4 h-4" />
      case 'in_progress': return <Edit className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredBooks = selectionBooks
    .filter(book => {
      if (statusFilter !== 'all' && book.status !== statusFilter) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          book.customer_name?.toLowerCase().includes(search) ||
          book.job_address?.toLowerCase().includes(search) ||
          book.house_plan?.toLowerCase().includes(search) ||
          book.customer_email?.toLowerCase().includes(search)
        )
      }
      return true
    })

  const countSelections = (selections: any) => {
    if (!selections || typeof selections !== 'object') return 0
    let count = 0
    Object.values(selections).forEach((category: any) => {
      if (category?.groups) {
        category.groups.forEach((group: any) => {
          group.options?.forEach((opt: any) => {
            if (opt.checked) count++
          })
        })
      }
    })
    return count
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading selection books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selection Books</h1>
          <p className="text-gray-600 mt-1">Manage customer home customization selections</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/selection-wizard">
            <Plus className="w-4 h-4 mr-2" />
            New Selection Book
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by customer, address, or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'bg-red-600' : ''}
          >
            All ({selectionBooks.length})
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('draft')}
            className={statusFilter === 'draft' ? 'bg-red-600' : ''}
          >
            Draft ({selectionBooks.filter(b => b.status === 'draft').length})
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('in_progress')}
            className={statusFilter === 'in_progress' ? 'bg-red-600' : ''}
          >
            In Progress ({selectionBooks.filter(b => b.status === 'in_progress').length})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
            className={statusFilter === 'completed' ? 'bg-red-600' : ''}
          >
            Completed ({selectionBooks.filter(b => b.status === 'completed').length})
          </Button>
        </div>
      </div>

      {/* Selection Books Grid */}
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No selection books found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first selection book to get started'}
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/selection-wizard">
                <Plus className="w-4 h-4 mr-2" />
                Create Selection Book
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {book.customer_name || 'Unnamed Customer'}
                    </h3>
                    {book.house_plan && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Home className="w-3 h-3 mr-1" />
                        {book.house_plan}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(book.status)}>
                    {getStatusIcon(book.status)}
                    <span className="ml-1 capitalize">{book.status.replace('_', ' ')}</span>
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {book.job_address && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{book.job_address}</span>
                    </div>
                  )}
                  {book.customer_phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {book.customer_phone}
                    </div>
                  )}
                  {book.customer_email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{book.customer_email}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center py-3 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">Selections:</span>
                    <span className="font-medium ml-1">{countSelections(book.selections)}</span>
                  </div>
                  {book.total_upgrades_price > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-500">Upgrades:</span>
                      <span className="font-medium text-amber-600 ml-1">
                        ${book.total_upgrades_price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDate(book.updated_at)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBook(book)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link href={`/admin/selection-wizard?id=${book.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBook(book.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedBook.customer_name || 'Unnamed Customer'}
                  </h2>
                  <p className="text-gray-600">{selectedBook.house_plan}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/selection-wizard?id=${selectedBook.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBook(null)}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedBook.customer_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedBook.customer_phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedBook.customer_email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedBook.job_address || '-'}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex gap-2">
                  {['draft', 'in_progress', 'completed'].map(status => (
                    <Button
                      key={status}
                      variant={selectedBook.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateStatus(selectedBook.id, status)
                        setSelectedBook({ ...selectedBook, status })
                      }}
                      className={selectedBook.status === status ? 'bg-red-600' : ''}
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selections Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Selections</h3>
                {selectedBook.selections && Object.entries(selectedBook.selections).map(([catId, category]: [string, any]) => {
                  const selectedItems: string[] = []
                  category.groups?.forEach((group: any) => {
                    group.options?.forEach((opt: any) => {
                      if (opt.checked) {
                        selectedItems.push(`${group.title}: ${opt.label}${opt.textValue ? ` (${opt.textValue})` : ''}${opt.isUpgrade ? ' [UPGRADE]' : ''}`)
                      }
                    })
                    if (group.textValue) {
                      selectedItems.push(`${group.title}: ${group.textValue}`)
                    }
                  })
                  
                  if (selectedItems.length === 0) return null
                  
                  return (
                    <div key={catId} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Badge variant="outline" className="mr-2">{category.section}</Badge>
                        {category.name}
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedItems.map((item, i) => (
                          <li key={i} className={item.includes('[UPGRADE]') ? 'text-amber-700' : ''}>
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>

              {/* Notes */}
              {selectedBook.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedBook.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                <div>
                  Created: {formatDate(selectedBook.created_at)}
                  {selectedBook.created_by && ` by ${selectedBook.created_by}`}
                </div>
                <div>
                  Last updated: {formatDate(selectedBook.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

