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
  Trees,
  MapPin,
  Ruler,
  DollarSign,
  X,
  Star
} from "lucide-react"

interface Lot {
  id: string
  lot_number: string
  address: string
  city: string
  state: string
  zip_code: string
  subdivision: string
  lot_size: number
  price: number
  status: string
  latitude: number
  longitude: number
  description: string
  main_image: string
  utilities_status: string
  hoa_fees: number
  school_district: string
  is_featured: boolean
  lot_features: { feature_name: string }[]
  lot_images: { image_url: string; image_type: string }[]
}

export default function AdminLotsPage() {
  const [lots, setLots] = useState<Lot[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLot, setEditingLot] = useState<Lot | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    lot_number: '',
    address: '',
    city: 'Appleton',
    state: 'Wisconsin',
    zip_code: '54913',
    subdivision: '',
    lot_size: '',
    price: '',
    status: 'available',
    latitude: '',
    longitude: '',
    description: '',
    main_image: '',
    utilities_status: '',
    hoa_fees: '',
    school_district: '',
    is_featured: false,
    features: [] as string[],
    images: [] as { url: string; type: string; title: string; description: string }[]
  })

  const [newFeature, setNewFeature] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    fetchLots()
  }, [])

  const fetchLots = async () => {
    try {
      const response = await fetch('/api/lots')
      if (response.ok) {
        const data = await response.json()
        setLots(data)
      }
    } catch (error) {
      console.error('Error fetching lots:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      lot_number: '',
      address: '',
      city: 'Appleton',
      state: 'Wisconsin',
      zip_code: '54913',
      subdivision: '',
      lot_size: '',
      price: '',
      status: 'available',
      latitude: '',
      longitude: '',
      description: '',
      main_image: '',
      utilities_status: '',
      hoa_fees: '',
      school_district: '',
      is_featured: false,
      features: [],
      images: []
    })
    setNewFeature('')
    setUploadError(null)
    setEditingLot(null)
    setShowAddForm(false)
  }

  const handleEdit = (lot: Lot) => {
    setFormData({
      lot_number: lot.lot_number,
      address: lot.address || '',
      city: lot.city || 'Appleton',
      state: lot.state || 'Wisconsin',
      zip_code: lot.zip_code || '54913',
      subdivision: lot.subdivision || '',
      lot_size: lot.lot_size?.toString() || '',
      price: lot.price?.toString() || '',
      status: lot.status || 'available',
      latitude: lot.latitude?.toString() || '',
      longitude: lot.longitude?.toString() || '',
      description: lot.description || '',
      main_image: lot.main_image || '',
      utilities_status: lot.utilities_status || '',
      hoa_fees: lot.hoa_fees?.toString() || '',
      school_district: lot.school_district || '',
      is_featured: lot.is_featured || false,
      features: lot.lot_features?.map(f => f.feature_name) || [],
      images: lot.lot_images?.map(img => ({
        url: img.image_url,
        type: img.image_type,
        title: '',
        description: ''
      })) || []
    })
    setEditingLot(lot)
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingLot ? `/api/lots/${editingLot.id}` : '/api/lots'
      const method = editingLot ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchLots()
        resetForm()
        alert(editingLot ? 'Lot updated successfully!' : 'Lot created successfully!')
      } else {
        alert('Error saving lot. Please try again.')
      }
    } catch (error) {
      console.error('Error saving lot:', error)
      alert('Error saving lot. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (lotId: string) => {
    if (!confirm('Are you sure you want to delete this lot?')) return

    try {
      const response = await fetch(`/api/lots/${lotId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchLots()
        alert('Lot deleted successfully!')
      } else {
        alert('Error deleting lot. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting lot:', error)
      alert('Error deleting lot. Please try again.')
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
    const lowerName = fileName.toLowerCase()
    let imageType = 'photo'
    
    if (lowerName.includes('survey')) imageType = 'survey'
    else if (lowerName.includes('aerial')) imageType = 'aerial'
    else if (lowerName.includes('plat')) imageType = 'plat'
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url, type: imageType, title: fileName, description: '' }]
    }))
    setUploadError(null)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-600">Available</Badge>
      case 'reserved':
        return <Badge className="bg-yellow-600">Reserved</Badge>
      case 'sold':
        return <Badge className="bg-gray-600">Sold</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lots...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Lots</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage available lots</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/lots">View Public Page</Link>
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Lot
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">{editingLot ? 'Edit Lot' : 'Add New Lot'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Lot Number *</label>
                    <Input
                      value={formData.lot_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, lot_number: e.target.value }))}
                      placeholder="e.g., Lot 15"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subdivision *</label>
                    <Input
                      value={formData.subdivision}
                      onChange={(e) => setFormData(prev => ({ ...prev, subdivision: e.target.value }))}
                      placeholder="e.g., Meadowbrook Estates"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="e.g., 1234 Meadowbrook Lane"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g., Appleton"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="e.g., Wisconsin"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <Input
                      value={formData.zip_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                      placeholder="e.g., 54913"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Lot Size (acres) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.lot_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, lot_size: e.target.value }))}
                      placeholder="e.g., 0.52"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., 75000"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">School District</label>
                    <Input
                      value={formData.school_district}
                      onChange={(e) => setFormData(prev => ({ ...prev, school_district: e.target.value }))}
                      placeholder="e.g., Appleton Area School District"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Latitude</label>
                    <Input
                      type="number"
                      step="0.00000001"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="e.g., 44.2619"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Longitude</label>
                    <Input
                      type="number"
                      step="0.00000001"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="e.g., -88.4154"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">HOA Fees (monthly)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.hoa_fees}
                      onChange={(e) => setFormData(prev => ({ ...prev, hoa_fees: e.target.value }))}
                      placeholder="e.g., 150"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Utilities Status</label>
                    <Input
                      value={formData.utilities_status}
                      onChange={(e) => setFormData(prev => ({ ...prev, utilities_status: e.target.value }))}
                      placeholder="e.g., All utilities available at street"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the lot's key features and benefits..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium">
                    Feature this lot
                  </label>
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
                  <label className="block text-sm font-medium mb-2">Lot Features</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature (e.g., Corner lot, Mature trees)..."
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

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Images</label>
                  <div className="space-y-4">
                    <FileUpload
                      type="image"
                      onUploadComplete={(url, fileName) => handleImageUpload(url, fileName)}
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
                  <div className="text-red-600 text-sm">{uploadError}</div>
                )}
                
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting ? 'Saving...' : (editingLot ? 'Update Lot' : 'Create Lot')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot) => (
            <Card key={lot.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {lot.is_featured && (
                  <Badge className="absolute top-2 left-2 z-10 bg-red-600">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                {getStatusBadge(lot.status) && (
                  <div className="absolute top-2 right-2 z-10">
                    {getStatusBadge(lot.status)}
                  </div>
                )}
                {lot.main_image ? (
                  <Image
                    src={lot.main_image}
                    alt={lot.lot_number}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Trees className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{lot.lot_number}</h3>
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {lot.subdivision}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4 text-gray-500" />
                    <span>{lot.lot_size} acres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>${lot.price?.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(lot)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(lot.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {lots.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <Trees className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lots yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first lot.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Lot
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 