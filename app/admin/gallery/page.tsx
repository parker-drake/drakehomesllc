"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Upload, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Image as ImageIcon,
  Star,
  Eye,
  ImagePlus,
  FolderPlus,
  LayoutGrid
} from 'lucide-react'

interface Gallery {
  id: string
  name: string
  slug: string
  description?: string
  sort_order: number
  is_active: boolean
  image_count?: number
}

interface GalleryImage {
  id: string
  title: string
  description: string
  location: string
  year: string
  gallery_id: string
  gallery?: Gallery
  image_url: string
  image_path: string
  sort_order: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [selectedGallery, setSelectedGallery] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [uploadFormOpen, setUploadFormOpen] = useState(false)
  const [multiUploadFormOpen, setMultiUploadFormOpen] = useState(false)
  const [galleryFormOpen, setGalleryFormOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGalleries()
    fetchImages()
  }, [selectedGallery])

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries')
      if (response.ok) {
        const data = await response.json()
        setGalleries(data)
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    }
  }

  const fetchImages = async () => {
    try {
      let url = '/api/gallery'
      if (selectedGallery !== 'all') {
        url += `?galleryId=${selectedGallery}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    try {
      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      })

      if (response.ok) {
        setGalleryFormOpen(false)
        fetchGalleries()
        e.currentTarget.reset()
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to create gallery')
      }
    } catch (error) {
      setError('Error creating gallery')
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setUploadFormOpen(false)
        fetchImages()
        e.currentTarget.reset()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to upload image')
      }
    } catch (error) {
      setError('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleMultiUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('multiUpload', 'true')
    
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setMultiUploadFormOpen(false)
        fetchImages()
        e.currentTarget.reset()
        
        // Show success message with results
        if (result.failed && result.failed.length > 0) {
          setError(`Uploaded ${result.successful.length} of ${result.total} images. ${result.failed.length} failed.`)
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to upload images')
      }
    } catch (error) {
      setError('Error uploading images')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (id: string, updatedData: Partial<GalleryImage>) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        fetchImages()
        setEditingImage(null)
      }
    } catch (error) {
      console.error('Error updating image:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const filteredImages = selectedGallery === 'all' 
    ? images 
    : images.filter(img => img.gallery_id === selectedGallery)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600 mt-2">Upload and manage your project photos</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <a href="/gallery" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Public Gallery
              </a>
            </Button>
            <Button 
              onClick={() => setGalleryFormOpen(true)}
              variant="outline"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Gallery
            </Button>
            <Button 
              onClick={() => setMultiUploadFormOpen(true)}
              variant="outline"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Multi Upload
            </Button>
            <Button 
              onClick={() => setUploadFormOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>
        </div>

        {/* Gallery Filter */}
        <div className="mb-6">
          <Select value={selectedGallery} onValueChange={setSelectedGallery}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a gallery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  All Galleries
                </div>
              </SelectItem>
              {galleries.map(gallery => (
                <SelectItem key={gallery.id} value={gallery.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{gallery.name}</span>
                    {gallery.image_count !== undefined && (
                      <span className="text-gray-500 text-sm ml-2">({gallery.image_count})</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Images</p>
                  <p className="text-3xl font-bold text-gray-900">{images.length}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Galleries</p>
                  <p className="text-3xl font-bold text-gray-900">{galleries.length}</p>
                </div>
                <FolderPlus className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {images.filter(img => img.is_featured).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Year</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {images.filter(img => img.year === new Date().getFullYear().toString()).length}
                  </p>
                </div>
                <Upload className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={image.image_url} 
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                {image.is_featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                {editingImage === image.id ? (
                  <EditImageForm 
                    image={image}
                    galleries={galleries}
                    onSave={(updatedData) => handleUpdate(image.id, updatedData)}
                    onCancel={() => setEditingImage(null)}
                  />
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {image.gallery?.name || 'Unknown Gallery'}
                      </Badge>
                      <span className="text-sm text-gray-500">{image.year}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{image.location}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{image.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingImage(image.id)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {selectedGallery === 'all' ? 'No images yet' : 'No images in this gallery'}
            </h3>
            <p className="text-gray-500 mb-4">Upload your first gallery image to get started.</p>
            <Button 
              onClick={() => setUploadFormOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Image
            </Button>
          </div>
        )}

        {/* New Gallery Modal */}
        {galleryFormOpen && (
          <CreateGalleryModal
            onClose={() => setGalleryFormOpen(false)}
            onSubmit={handleCreateGallery}
            error={error}
          />
        )}

        {/* Upload Modal */}
        {uploadFormOpen && (
          <UploadImageModal 
            galleries={galleries}
            onClose={() => setUploadFormOpen(false)}
            onSubmit={handleUpload}
            uploading={uploading}
            error={error}
          />
        )}
        
        {/* Multi-Upload Modal */}
        {multiUploadFormOpen && (
          <MultiUploadImageModal 
            galleries={galleries}
            onClose={() => setMultiUploadFormOpen(false)}
            onSubmit={handleMultiUpload}
            uploading={uploading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

// Create Gallery Modal Component
function CreateGalleryModal({ onClose, onSubmit, error }: {
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  error: string
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Gallery</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Name *
            </label>
            <Input 
              name="name" 
              required 
              placeholder="e.g., Custom Kitchens"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              name="description"
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={3}
              placeholder="Brief description of this gallery..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Gallery
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Upload Modal Component
function UploadImageModal({ galleries, onClose, onSubmit, uploading, error }: {
  galleries: Gallery[]
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  uploading: boolean
  error: string
}) {
  const [selectedGallery, setSelectedGallery] = useState('')

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate required fields
    if (!selectedGallery) {
      return // Don't submit if gallery is not selected
    }
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Add the selected gallery to form data
    formData.set('gallery_id', selectedGallery)
    
    // Create a synthetic event to pass to the original handler
    const syntheticEvent = {
      ...e,
      currentTarget: {
        ...form,
        reset: () => {
          form.reset()
          setSelectedGallery('')
        }
      }
    } as React.FormEvent<HTMLFormElement>
    
    onSubmit(syntheticEvent)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload New Image</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image File *
            </label>
            <Input 
              type="file" 
              name="image" 
              accept="image/*" 
              required 
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input 
              name="title" 
              required 
              disabled={uploading}
              placeholder="e.g., Modern Family Kitchen"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gallery *
            </label>
            <Select 
              value={selectedGallery} 
              onValueChange={setSelectedGallery}
            >
              <SelectTrigger disabled={uploading}>
                <SelectValue placeholder="Select gallery" />
              </SelectTrigger>
              <SelectContent>
                {galleries.map(gallery => (
                  <SelectItem key={gallery.id} value={gallery.id}>
                    {gallery.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedGallery && (
              <p className="text-red-500 text-xs mt-1">Gallery is required</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input 
                name="location" 
                disabled={uploading}
                placeholder="e.g., Green Bay, WI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <Input 
                name="year" 
                disabled={uploading}
                placeholder="2024"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              name="description"
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={3}
              disabled={uploading}
              placeholder="Brief description of the project..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="is_featured" 
              id="is_featured"
              disabled={uploading}
            />
            <label htmlFor="is_featured" className="text-sm text-gray-700">
              Feature this image
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={uploading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Multi-Upload Modal Component
function MultiUploadImageModal({ galleries, onClose, onSubmit, uploading, error }: {
  galleries: Gallery[]
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  uploading: boolean
  error: string
}) {
  const [selectedGallery, setSelectedGallery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    
    // Revoke the removed URL to free memory
    URL.revokeObjectURL(previewUrls[index])
    
    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedGallery || selectedFiles.length === 0) {
      return
    }
    
    const form = e.currentTarget
    const formData = new FormData()
    
    // Add files to formData
    selectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file)
    })
    
    // Add form fields
    formData.append('gallery_id', selectedGallery)
    
    // Get other form values
    const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement
    const descriptionInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement
    const locationInput = form.querySelector('input[name="location"]') as HTMLInputElement
    const yearInput = form.querySelector('input[name="year"]') as HTMLInputElement
    const isFeaturedInput = form.querySelector('input[name="is_featured"]') as HTMLInputElement
    
    const title = titleInput?.value || ''
    const description = descriptionInput?.value || ''
    const location = locationInput?.value || ''
    const year = yearInput?.value || ''
    const isFeatured = isFeaturedInput?.checked || false
    
    formData.append('title', title)
    formData.append('description', description)
    formData.append('location', location)
    formData.append('year', year)
    formData.append('is_featured', isFeatured.toString())
    
    // Create synthetic event
    const syntheticEvent = {
      ...e,
      currentTarget: {
        ...form,
        reset: () => {
          form.reset()
          setSelectedGallery('')
          setSelectedFiles([])
          setPreviewUrls([])
        }
      }
    } as React.FormEvent<HTMLFormElement>
    
    onSubmit(syntheticEvent)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Upload Multiple Images</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form id="multi-upload-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Images *
              </label>
              <Input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileSelect}
                required 
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple images at once
              </p>
            </div>

            {/* Image previews */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Images ({selectedFiles.length})
                </p>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={previewUrls[index]} 
                        alt={file.name}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded flex items-center justify-center">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gallery *
              </label>
              <Select 
                value={selectedGallery} 
                onValueChange={setSelectedGallery}
              >
                <SelectTrigger disabled={uploading}>
                  <SelectValue placeholder="Select gallery for all images" />
                </SelectTrigger>
                <SelectContent>
                  {galleries.map(gallery => (
                    <SelectItem key={gallery.id} value={gallery.id}>
                      {gallery.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedGallery && (
                <p className="text-red-500 text-xs mt-1">Gallery is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title Prefix
              </label>
              <Input 
                name="title" 
                disabled={uploading}
                placeholder="e.g., 'Modern Kitchen' (will be numbered)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Images will be titled: "Title Prefix 1", "Title Prefix 2", etc.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input 
                  name="location" 
                  disabled={uploading}
                  placeholder="e.g., Green Bay, WI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <Input 
                  name="year" 
                  disabled={uploading}
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea 
                name="description"
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                disabled={uploading}
                placeholder="Brief description for all images..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="is_featured" 
                id="is_featured_multi"
                disabled={uploading}
              />
              <label htmlFor="is_featured_multi" className="text-sm text-gray-700">
                Feature the first image
              </label>
            </div>
          </form>
        </div>

        <div className="border-t p-6">
          <div className="flex gap-3">
            <Button 
              type="submit" 
              form="multi-upload-form"
              disabled={uploading || selectedFiles.length === 0 || !selectedGallery}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading {selectedFiles.length} images...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {selectedFiles.length || 'All'} Images
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Edit Form Component
function EditImageForm({ image, galleries, onSave, onCancel }: {
  image: GalleryImage
  galleries: Gallery[]
  onSave: (data: Partial<GalleryImage>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: image.title,
    description: image.description,
    location: image.location,
    year: image.year,
    gallery_id: image.gallery_id,
    is_featured: image.is_featured
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input 
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Title"
        className="text-sm"
      />
      
      <Select 
        value={formData.gallery_id} 
        onValueChange={(value) => setFormData({...formData, gallery_id: value})}
      >
        <SelectTrigger className="text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {galleries.map(gallery => (
            <SelectItem key={gallery.id} value={gallery.id}>
              {gallery.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <Input 
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="Location"
          className="text-sm"
        />
        <Input 
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
          placeholder="Year"
          className="text-sm"
        />
      </div>

      <textarea 
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Description"
        className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
        rows={2}
      />

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={formData.is_featured}
          onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
          id={`featured-${image.id}`}
        />
        <label htmlFor={`featured-${image.id}`} className="text-xs text-gray-700">
          Featured
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700">
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 