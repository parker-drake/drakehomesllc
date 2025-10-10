"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Quote,
  Save,
  X,
  Eye,
  EyeOff,
  Check
} from "lucide-react"

interface Testimonial {
  id: string
  customer_name: string
  location: string
  rating: number
  testimonial_text: string
  project_type?: string
  completion_date?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    location: '',
    rating: 5,
    testimonial_text: '',
    project_type: '',
    completion_date: '',
    is_featured: false,
    is_active: true,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      customer_name: '',
      location: '',
      rating: 5,
      testimonial_text: '',
      project_type: '',
      completion_date: '',
      is_featured: false,
      is_active: true,
    })
    setEditingTestimonial(null)
    setShowAddForm(false)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      customer_name: testimonial.customer_name,
      location: testimonial.location,
      rating: testimonial.rating,
      testimonial_text: testimonial.testimonial_text,
      project_type: testimonial.project_type || '',
      completion_date: testimonial.completion_date || '',
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active,
    })
    setEditingTestimonial(testimonial)
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingTestimonial 
        ? `/api/testimonials/${editingTestimonial.id}` 
        : '/api/testimonials'
      const method = editingTestimonial ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTestimonials()
        resetForm()
        alert(editingTestimonial ? 'Testimonial updated!' : 'Testimonial added!')
      } else {
        alert('Error saving testimonial')
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Error saving testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchTestimonials()
        alert('Testimonial deleted!')
      } else {
        alert('Error deleting testimonial')
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Error deleting testimonial')
    }
  }

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !testimonial.is_active }),
      })

      if (response.ok) {
        await fetchTestimonials()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !testimonial.is_featured }),
      })

      if (response.ok) {
        await fetchTestimonials()
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
            <p className="text-gray-600 mt-2">Customer reviews and feedback</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Name *</label>
                    <Input
                      value={formData.customer_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="John & Sarah Smith"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Appleton, WI"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating *</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      required
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Type</label>
                    <Input
                      value={formData.project_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                      placeholder="Custom Home Build"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Completion Date</label>
                    <Input
                      value={formData.completion_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Testimonial Text *</label>
                  <textarea
                    value={formData.testimonial_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, testimonial_text: e.target.value }))}
                    placeholder="Drake Homes exceeded our expectations..."
                    required
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm font-medium">Featured (show on homepage)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm font-medium">Active (visible on site)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving...' : (editingTestimonial ? 'Update' : 'Add')} Testimonial
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Testimonials Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Review</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Rating</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Featured</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{testimonial.customer_name}</p>
                        <p className="text-xs text-gray-500">{testimonial.location}</p>
                        {testimonial.project_type && (
                          <p className="text-xs text-gray-400 mt-1">{testimonial.project_type}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700 line-clamp-2 italic max-w-md">
                        "{testimonial.testimonial_text}"
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(testimonial)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        {testimonial.is_featured ? (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <Star className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(testimonial)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        {testimonial.is_active ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(testimonial)}
                          className="h-7 px-2"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(testimonial.id)}
                          className="h-7 px-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {testimonials.length === 0 && (
              <div className="text-center py-12 bg-white">
                <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No testimonials yet</p>
                <p className="text-gray-400 text-sm mb-4">Add your first customer review</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Testimonial
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

