"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileUpload, UploadedFile } from "@/components/ui/file-upload"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Home,
  Bed,
  Bath,
  Square,
  Car,
  DollarSign,
  Upload,
  X
} from "lucide-react"

interface Plan {
  id: string
  title: string
  description: string
  square_footage: number
  bedrooms: number
  bathrooms: number
  floors: number
  garage_spaces: number
  style: string
  price: number
  main_image: string
  is_featured: boolean
  plan_features: { feature_name: string }[]
  plan_images: { image_url: string; image_type: string }[]
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    square_footage: '',
    bedrooms: '',
    bathrooms: '',
    floors: '1',
    garage_spaces: '0',
    style: '',
    price: '',
    main_image: '',
    is_featured: false,
    features: [] as string[],
    images: [] as { url: string; type: string; title: string; description: string }[],
    documents: [] as { url: string; type: string; file_type: string; title: string; description: string }[]
  })

  const [newFeature, setNewFeature] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      square_footage: '',
      bedrooms: '',
      bathrooms: '',
      floors: '1',
      garage_spaces: '0',
      style: '',
      price: '',
      main_image: '',
      is_featured: false,
      features: [],
      images: [],
      documents: []
    })
    setNewFeature('')
    setUploadError(null)
    setEditingPlan(null)
    setShowAddForm(false)
  }

  const handleEdit = (plan: Plan) => {
    setFormData({
      title: plan.title,
      description: plan.description,
      square_footage: plan.square_footage?.toString() || '',
      bedrooms: plan.bedrooms?.toString() || '',
      bathrooms: plan.bathrooms?.toString() || '',
      floors: plan.floors?.toString() || '1',
      garage_spaces: plan.garage_spaces?.toString() || '0',
      style: plan.style || '',
      price: plan.price?.toString() || '',
      main_image: plan.main_image || '',
      is_featured: plan.is_featured || false,
      features: plan.plan_features?.map(f => f.feature_name) || [],
      images: plan.plan_images?.map(img => ({
        url: img.image_url,
        type: img.image_type,
        title: '',
        description: ''
      })) || [],
      documents: (plan as any).plan_documents?.map((doc: any) => ({
        url: doc.document_url,
        type: doc.document_type,
        file_type: doc.file_type,
        title: doc.title || '',
        description: doc.description || ''
      })) || []
    })
    setEditingPlan(plan)
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingPlan ? `/api/plans/${editingPlan.id}` : '/api/plans'
      const method = editingPlan ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchPlans()
        resetForm()
        alert(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!')
      } else {
        alert('Error saving plan. Please try again.')
      }
    } catch (error) {
      console.error('Error saving plan:', error)
      alert('Error saving plan. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPlans()
        alert('Plan deleted successfully!')
      } else {
        alert('Error deleting plan. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Error deleting plan. Please try again.')
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = (url: string, fileName: string, type: string = 'photo') => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url, type, title: fileName, description: '' }]
    }))
    setUploadError(null)
  }

  const handleDocumentUpload = (url: string, fileName: string, type: string = 'floor_plan', fileType: string = 'pdf') => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { url, type, file_type: fileType, title: fileName, description: '' }]
    }))
    setUploadError(null)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Plans</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage your house plans</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/plans">View Public Page</Link>
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Plan
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., The Madison"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Style *</label>
                    <Input
                      value={formData.style}
                      onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                      placeholder="e.g., Ranch, Colonial, Modern"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Square Footage *</label>
                    <Input
                      type="number"
                      value={formData.square_footage}
                      onChange={(e) => setFormData(prev => ({ ...prev, square_footage: e.target.value }))}
                      placeholder="e.g., 1850"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., 189900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms *</label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                      placeholder="e.g., 3"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms *</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                      placeholder="e.g., 2.5"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Floors</label>
                    <Input
                      type="number"
                      value={formData.floors}
                      onChange={(e) => setFormData(prev => ({ ...prev, floors: e.target.value }))}
                      placeholder="e.g., 2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Garage Spaces</label>
                    <Input
                      type="number"
                      value={formData.garage_spaces}
                      onChange={(e) => setFormData(prev => ({ ...prev, garage_spaces: e.target.value }))}
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the plan's key features and appeal..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Main Image</label>
                  {formData.main_image ? (
                    <UploadedFile
                      fileName="Main Image"
                      url={formData.main_image}
                      type="image"
                      onRemove={() => setFormData(prev => ({ ...prev, main_image: '' }))}
                    />
                  ) : (
                    <FileUpload
                      type="image"
                      onUploadComplete={(url, fileName) => setFormData(prev => ({ ...prev, main_image: url }))}
                      onUploadError={handleUploadError}
                      maxSizeMB={5}
                    />
                  )}
                </div>
                
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Floor Plan Documents */}
                <div>
                  <label className="block text-sm font-medium mb-2">Floor Plan Documents</label>
                  <div className="space-y-4">
                    <FileUpload
                      type="document"
                      onUploadComplete={(url, fileName) => {
                        // Determine document type based on filename
                        const lowerName = fileName.toLowerCase()
                        let docType = 'floor_plan'
                        if (lowerName.includes('elevation')) docType = 'elevation'
                        else if (lowerName.includes('site')) docType = 'site_plan'
                        else if (lowerName.includes('spec')) docType = 'specification'
                        
                        // Determine file type based on extension
                        const extension = fileName.split('.').pop()?.toLowerCase() || 'pdf'
                        let fileType = extension
                        if (extension === 'jpg' || extension === 'jpeg') fileType = 'jpg'
                        
                        handleDocumentUpload(url, fileName, docType, fileType)
                      }}
                      onUploadError={handleUploadError}
                      maxSizeMB={10}
                      className="mb-4"
                    />
                    
                    {formData.documents.length > 0 && (
                      <div className="space-y-2">
                        {formData.documents.map((document, index) => (
                          <UploadedFile
                            key={index}
                            fileName={document.title || 'Document'}
                            url={document.url}
                            type="document"
                            onRemove={() => removeDocument(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Images</label>
                  <div className="space-y-4">
                    <FileUpload
                      type="image"
                      onUploadComplete={(url, fileName) => {
                        // Determine image type based on filename
                        const lowerName = fileName.toLowerCase()
                        let imageType = 'photo'
                        if (lowerName.includes('floor') || lowerName.includes('plan')) imageType = 'floor_plan'
                        else if (lowerName.includes('elevation')) imageType = 'elevation'
                        else if (lowerName.includes('interior')) imageType = 'interior'
                        
                        handleImageUpload(url, fileName, imageType)
                      }}
                      onUploadError={handleUploadError}
                      maxSizeMB={5}
                      className="mb-4"
                    />
                    
                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        {formData.images.map((image, index) => (
                          <UploadedFile
                            key={index}
                            fileName={image.title || 'Image'}
                            url={image.url}
                            type="image"
                            onRemove={() => removeImage(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium">Featured Plan</label>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                    {isSubmitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Plans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {plan.is_featured && (
                  <Badge className="absolute top-2 left-2 z-10 bg-red-600">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                
                {plan.main_image ? (
                  <Image
                    src={plan.main_image}
                    alt={plan.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Home className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.title}</h3>
                  <Badge variant="outline" className="text-xs">{plan.style}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Square className="w-3 h-3 text-red-600" />
                    <span>{plan.square_footage?.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3 text-red-600" />
                    <span>{plan.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3 h-3 text-red-600" />
                    <span>{plan.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-red-600" />
                    <span>${plan.price?.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(plan)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {plans.length === 0 && (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No plans yet</h3>
            <p className="text-gray-600 mb-4">Add your first house plan to get started.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 