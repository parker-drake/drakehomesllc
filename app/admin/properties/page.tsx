"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Star, StarOff, ArrowLeft, Search, Filter, SlidersHorizontal, RotateCcw, Check, CheckSquare, Square, Users, Edit2, Trash, MapPin, Bed, Bath, Home } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"

interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  is_main: boolean
  display_order: number
  alt_text?: string
}

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  main_image?: string
  status: string
  availability_status?: string
  description: string
  features: string[]
  completion_date: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
  images?: PropertyImage[]
  // Property Information fields
  lot_size?: string
  year_built?: number
  property_type?: string
  garage_spaces?: number
  heating_cooling?: string
  flooring_type?: string
  school_district?: string
  hoa_fee?: string
  utilities_included?: string
  exterior_materials?: string
}

const statusOptions = [
  "Move-In Ready",
  "Under Construction", 
  "Nearly Complete",
  "Pre-Construction"
]

const availabilityStatusOptions = [
  "Available",
  "Under Contract",
  "Coming Soon",
  "Sold"
]

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([])
  
  // Plan Template States
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [availablePlans, setAvailablePlans] = useState<any[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000])
  const [bedroomFilter, setBedroomFilter] = useState<string>('all')
  const [bathroomFilter, setBathroomFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Bulk Operations States
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkStatus, setBulkStatus] = useState<string>('')

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    beds: 0,
    baths: 0,
    sqft: '',
    main_image: '',
    status: 'Pre-Construction',
    availability_status: 'Available',
    description: '',
    features: [] as string[],
    completion_date: '',
    latitude: 0,
    longitude: 0,
    // Property Information fields
    lot_size: '',
    year_built: 0,
    property_type: 'Single Family Home',
    garage_spaces: 0,
    heating_cooling: '',
    flooring_type: '',
    school_district: '',
    hoa_fee: '',
    utilities_included: '',
    exterior_materials: ''
  })

  useEffect(() => {
    fetchProperties()
    fetchPlans()
  }, [])

  useEffect(() => {
    filterAndSortProperties()
  }, [properties, searchTerm, statusFilter, priceRange, bedroomFilter, bathroomFilter, sortBy])

  // Keyboard shortcut for opening add property modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault()
        startAddNew()
      }
      if (event.key === 'Escape' && showAddModal) {
        resetForm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAddModal])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        // Ensure features is always an array and never undefined
        const cleanedData = data.map((property: any) => ({
          ...property,
          features: Array.isArray(property.features) ? property.features : [],
          latitude: property.latitude || 0,
          longitude: property.longitude || 0
        }))
        setProperties(cleanedData)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true)
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setAvailablePlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoadingPlans(false)
    }
  }

  const filterAndSortProperties = () => {
    let filtered = properties.filter(property => {
      // Search term filter
      const searchMatch = searchTerm === '' || 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const statusMatch = statusFilter === 'all' || property.status === statusFilter

      // Price range filter
      const price = parseFloat(property.price.replace(/[$,]/g, ''))
      const priceMatch = price >= priceRange[0] && price <= priceRange[1]

      // Bedroom filter
      const bedroomMatch = bedroomFilter === 'all' || property.beds.toString() === bedroomFilter

      // Bathroom filter
      const bathroomMatch = bathroomFilter === 'all' || property.baths.toString() === bathroomFilter

      return searchMatch && statusMatch && priceMatch && bedroomMatch && bathroomMatch
    })

    // Sort properties
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, ''))
        case 'price-high':
          return parseFloat(b.price.replace(/[$,]/g, '')) - parseFloat(a.price.replace(/[$,]/g, ''))
        case 'title':
          return a.title.localeCompare(b.title)
        case 'location':
          return a.location.localeCompare(b.location)
        case 'completion':
          return new Date(a.completion_date).getTime() - new Date(b.completion_date).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProperties(filtered)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPriceRange([0, 2000000])
    setBedroomFilter('all')
    setBathroomFilter('all')
    setSortBy('newest')
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (searchTerm !== '') count++
    if (statusFilter !== 'all') count++
    if (priceRange[0] !== 0 || priceRange[1] !== 2000000) count++
    if (bedroomFilter !== 'all') count++
    if (bathroomFilter !== 'all') count++
    return count
  }

  // Bulk Operations Functions
  const togglePropertySelection = (propertyId: string) => {
    const newSelected = new Set(selectedProperties)
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId)
    } else {
      newSelected.add(propertyId)
    }
    setSelectedProperties(newSelected)
    setShowBulkActions(newSelected.size > 0)
  }

  const selectAllProperties = () => {
    const allIds = new Set(filteredProperties.map(p => p.id))
    setSelectedProperties(allIds)
    setShowBulkActions(allIds.size > 0)
  }

  const clearSelection = () => {
    setSelectedProperties(new Set())
    setShowBulkActions(false)
  }

  const bulkUpdateStatus = async () => {
    if (!bulkStatus || selectedProperties.size === 0) return

    const confirmMessage = `Update ${selectedProperties.size} properties to "${bulkStatus}" status?`
    if (!confirm(confirmMessage)) return

    try {
      const updatePromises = Array.from(selectedProperties).map(async (propertyId) => {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            ...properties.find(p => p.id === propertyId),
            status: bulkStatus 
          }),
        })
        return response.ok
      })

      const results = await Promise.all(updatePromises)
      const successCount = results.filter(Boolean).length

      if (successCount === selectedProperties.size) {
        alert(`Successfully updated ${successCount} properties`)
        fetchProperties()
        clearSelection()
        setBulkStatus('')
      } else {
        alert(`Updated ${successCount} of ${selectedProperties.size} properties`)
        fetchProperties()
      }
    } catch (error) {
      console.error('Error updating properties:', error)
      alert('Error updating properties')
    }
  }

  const bulkDeleteProperties = async () => {
    if (selectedProperties.size === 0) return

    const confirmMessage = `Are you sure you want to delete ${selectedProperties.size} properties? This action cannot be undone.`
    if (!confirm(confirmMessage)) return

    try {
      const deletePromises = Array.from(selectedProperties).map(async (propertyId) => {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
        })
        return response.ok
      })

      const results = await Promise.all(deletePromises)
      const successCount = results.filter(Boolean).length

      if (successCount === selectedProperties.size) {
        alert(`Successfully deleted ${successCount} properties`)
        fetchProperties()
        clearSelection()
      } else {
        alert(`Deleted ${successCount} of ${selectedProperties.size} properties`)
        fetchProperties()
      }
    } catch (error) {
      console.error('Error deleting properties:', error)
      alert('Error deleting properties')
    }
  }

  const fetchPropertyImages = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order')

      if (error) throw error
      setPropertyImages(data || [])
    } catch (error) {
      console.error('Error fetching property images:', error)
      setPropertyImages([])
    }
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.price || !formData.location) {
        alert('Please fill in all required fields: Title, Price, and Location')
        return
      }

      const url = editingProperty ? `/api/properties/${editingProperty.id}` : '/api/properties'
      const method = editingProperty ? 'PUT' : 'POST'
      
      console.log('Saving property:', formData)
      
      // Prepare data to send, including template images if this is a new property
      const dataToSend = {
        ...formData,
        ...(isAddingNew && propertyImages.length > 0 && {
          template_images: propertyImages
        })
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        fetchProperties()
        resetForm()
        alert('Property saved successfully!')
      } else {
        try {
          const errorData = await response.json()
          console.error('Server error:', errorData)
          const errorMessage = errorData.details || errorData.error || 'Unknown server error'
          alert(`Error saving property: ${errorMessage}`)
        } catch (parseError) {
          const errorText = await response.text()
          console.error('Server error:', errorText)
          alert(`Error saving property: ${errorText || 'Unknown server error'}`)
        }
      }
    } catch (error) {
      console.error('Error saving property:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Network error saving property: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await fetch(`/api/properties/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchProperties()
        } else {
          alert('Error deleting property')
        }
      } catch (error) {
        console.error('Error deleting property:', error)
        alert('Error deleting property')
      }
    }
  }

  const startEdit = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title,
      price: property.price,
      location: property.location,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      main_image: property.main_image || '',
      status: property.status,
      availability_status: property.availability_status || 'Available',
      description: property.description,
      features: Array.isArray(property.features) ? property.features : [],
      completion_date: property.completion_date,
      latitude: property.latitude || 0,
      longitude: property.longitude || 0,
      // Property Information fields
      lot_size: property.lot_size || '',
      year_built: property.year_built || 0,
      property_type: property.property_type || 'Single Family Home',
      garage_spaces: property.garage_spaces || 0,
      heating_cooling: property.heating_cooling || '',
      flooring_type: property.flooring_type || '',
      school_district: property.school_district || '',
      hoa_fee: property.hoa_fee || '',
      utilities_included: property.utilities_included || '',
      exterior_materials: property.exterior_materials || ''
    })
    setIsAddingNew(false)
    if (property.id) {
      fetchPropertyImages(property.id)
    }
  }

  const startAddNew = () => {
    setIsAddingNew(true)
    setEditingProperty(null)
    setPropertyImages([])
    setShowAddModal(true)
    resetFormDataOnly()
  }

  const startAddNewFromPlan = () => {
    setShowPlanSelector(true)
  }

  const selectPlanAsTemplate = (plan: any) => {
    // Map plan data to property form
    setFormData({
      title: `${plan.title} - `, // Leave space for location to be added
      price: plan.price ? plan.price.toString() : '',
      location: '', // Leave empty for user to fill
      beds: plan.bedrooms || 0,
      baths: plan.bathrooms || 0,
      sqft: plan.square_footage ? plan.square_footage.toString() : '',
      main_image: plan.main_image || '',
      status: 'Pre-Construction',
      availability_status: 'Available',
      description: plan.description || '',
      features: plan.plan_features?.map((f: any) => f.feature_name) || [],
      completion_date: '',
      latitude: 0,
      longitude: 0,
      // Property Information fields
      lot_size: '',
      year_built: 0,
      property_type: 'Single Family Home',
      garage_spaces: plan.garage_spaces || 0,
      heating_cooling: '',
      flooring_type: '',
      school_district: '',
      hoa_fee: '',
      utilities_included: '',
      exterior_materials: ''
    })

    // Set property images from plan images
    if (plan.plan_images && plan.plan_images.length > 0) {
      const mappedImages = plan.plan_images.map((img: any, index: number) => ({
        id: uuidv4(),
        property_id: '', // Will be set when property is saved
        image_url: img.image_url,
        is_main: index === 0, // First image becomes main
        display_order: index,
        alt_text: img.title || `${plan.title} - Image ${index + 1}`
      }))
      setPropertyImages(mappedImages)
    }

    setIsAddingNew(true)
    setEditingProperty(null)
    setShowPlanSelector(false)
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      location: '',
      beds: 0,
      baths: 0,
      sqft: '',
      main_image: '',
      status: 'Pre-Construction',
      availability_status: 'Available',
      description: '',
      features: [],
      completion_date: '',
      latitude: 0,
      longitude: 0,
      // Property Information fields
      lot_size: '',
      year_built: 0,
      property_type: 'Single Family Home',
      garage_spaces: 0,
      heating_cooling: '',
      flooring_type: '',
      school_district: '',
      hoa_fee: '',
      utilities_included: '',
      exterior_materials: ''
    })
    setEditingProperty(null)
    setIsAddingNew(false)
    setShowAddModal(false)
    setShowPlanSelector(false)
    setPropertyImages([])
  }

  const resetFormDataOnly = () => {
    setFormData({
      title: '',
      price: '',
      location: '',
      beds: 0,
      baths: 0,
      sqft: '',
      main_image: '',
      status: 'Pre-Construction',
      availability_status: 'Available',
      description: '',
      features: [],
      completion_date: '',
      latitude: 0,
      longitude: 0,
      // Property Information fields
      lot_size: '',
      year_built: 0,
      property_type: 'Single Family Home',
      garage_spaces: 0,
      heating_cooling: '',
      flooring_type: '',
      school_district: '',
      hoa_fee: '',
      utilities_included: '',
      exterior_materials: ''
    })
  }

  const addFeature = () => {
    const feature = prompt('Enter feature:')
    if (feature) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      
      // Check if file is valid
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return null
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)

      if (error) {
        console.error('Upload error:', error)
        console.log('Error details:', error.message)
        
        // Better error messaging
        if (error.message.includes('bucket')) {
          alert('Storage bucket not found. Please create "property-images" bucket in Supabase Storage.')
        } else if (error.message.includes('policy')) {
          alert('Storage policy error. Please check your Supabase Storage policies.')
        } else {
          alert(`Upload error: ${error.message}`)
        }
        return null
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image. Check console for details.')
      return null
    } finally {
      setUploading(false)
    }
  }

  const addPropertyImage = async (imageUrl: string, isMain: boolean = false) => {
    if (!editingProperty?.id) {
      alert('Please save the property first before adding images')
      return
    }

    try {
      const { data, error } = await supabase
        .from('property_images')
        .insert({
          property_id: editingProperty.id,
          image_url: imageUrl,
          is_main: isMain,
          display_order: propertyImages.length,
          alt_text: formData.title
        })
        .select()
        .single()

      if (error) throw error

      await fetchPropertyImages(editingProperty.id)
    } catch (error) {
      console.error('Error adding property image:', error)
      alert('Error adding image to property')
    }
  }

  const setMainImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('property_images')
        .update({ is_main: true })
        .eq('id', imageId)

      if (error) throw error

      if (editingProperty?.id) {
        await fetchPropertyImages(editingProperty.id)
      }
    } catch (error) {
      console.error('Error setting main image:', error)
      alert('Error setting main image')
    }
  }

  const deletePropertyImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId)

      if (error) throw error

      if (editingProperty?.id) {
        await fetchPropertyImages(editingProperty.id)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // For new properties, only allow single file
    if (!editingProperty?.id && files.length > 1) {
      alert('Please save the property first to upload multiple images')
      return
    }

    // Validate all files before uploading
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not an image file`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" must be smaller than 5MB`)
        return
      }
    }

    setUploading(true)
    
    if (!editingProperty?.id) {
      // Single file for new property
      const imageUrl = await uploadImage(files[0])
      if (imageUrl) {
        setFormData(prev => ({ ...prev, main_image: imageUrl }))
      }
    } else {
      // Multiple files for existing property
      await uploadMultipleImages(Array.from(files))
    }
    
    setUploading(false)
    // Clear the input
    e.target.value = ''
  }

  const uploadMultipleImages = async (files: File[]) => {
    const totalFiles = files.length
    let successCount = 0
    
    // Reset progress
    setUploadProgress({})
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = `${file.name}-${i}`
      
      try {
        // Update progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        const imageUrl = await uploadImage(file)
        
        if (imageUrl && editingProperty?.id) {
          await addPropertyImage(imageUrl, propertyImages.length === 0 && i === 0)
          successCount++
          
          // Update progress to complete
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
        } else {
          setUploadProgress(prev => ({ ...prev, [fileId]: -1 })) // Error state
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        setUploadProgress(prev => ({ ...prev, [fileId]: -1 })) // Error state
      }
    }
    
    // Clear progress after delay
    setTimeout(() => {
      setUploadProgress({})
    }, 2000)
    
    if (successCount > 0) {
      alert(`Successfully uploaded ${successCount} of ${totalFiles} images`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Button onClick={startAddNew} className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-5 h-5 mr-2" />
                Add New Property
              </Button>
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500">Ctrl+N</div>
            </div>
            <Button onClick={startAddNewFromPlan} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
              <Home className="w-5 h-5 mr-2" />
              Use Plan as Template
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {properties.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-3">
              <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </div>
            <div className="bg-white rounded-lg border p-3">
              <div className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.status === 'Move-In Ready').length}
              </div>
              <div className="text-sm text-gray-600">Move-In Ready</div>
            </div>
            <div className="bg-white rounded-lg border p-3">
              <div className="text-2xl font-bold text-orange-600">
                {properties.filter(p => p.status === 'Under Construction').length}
              </div>
              <div className="text-sm text-gray-600">Under Construction</div>
            </div>
            <div className="bg-white rounded-lg border p-3">
              <div className="text-2xl font-bold text-purple-600">
                {properties.filter(p => p.status === 'Pre-Construction').length}
              </div>
              <div className="text-sm text-gray-600">Pre-Construction</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {properties.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              {/* Search Bar and Quick Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search properties by title, location, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md text-sm bg-background"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="title">Title A-Z</option>
                    <option value="location">Location A-Z</option>
                    <option value="completion">Completion Date</option>
                  </select>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                      >
                        <option value="all">All Status</option>
                        <option value="Move-In Ready">Move-In Ready</option>
                        <option value="Nearly Complete">Nearly Complete</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Pre-Construction">Pre-Construction</option>
                      </select>
                    </div>

                    {/* Bedrooms Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
                      <select
                        value={bedroomFilter}
                        onChange={(e) => setBedroomFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                      >
                        <option value="all">Any Bedrooms</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    {/* Bathrooms Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Bathrooms</label>
                      <select
                        value={bathroomFilter}
                        onChange={(e) => setBathroomFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                      >
                        <option value="all">Any Bathrooms</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="2000000"
                          step="50000"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="2000000"
                          step="50000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex justify-between items-center text-sm text-gray-600 mt-4 pt-4 border-t">
                <span>
                  Showing {filteredProperties.length} of {properties.length} properties
                </span>
                {searchTerm && (
                  <span>
                    Search results for "{searchTerm}"
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Selection Controls */}
        {properties.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => filteredProperties.length === selectedProperties.size ? clearSelection() : selectAllProperties()}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {filteredProperties.length === selectedProperties.size && selectedProperties.size > 0 ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {selectedProperties.size > 0 ? 'Deselect All' : 'Select All'}
              </button>
              {selectedProperties.size > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedProperties.size} property{selectedProperties.size !== 1 ? 'ies' : ''} selected
                </span>
              )}
            </div>
            {selectedProperties.size > 0 && (
              <Button
                variant="outline"
                onClick={clearSelection}
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Selection
              </Button>
            )}
          </div>
        )}

        {/* Edit Form (inline for existing properties) */}
        {editingProperty && !showAddModal && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Property</h2>
                <Button variant="ghost" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Property Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  placeholder="Price (e.g., $850,000)"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                <Input
                  placeholder="Square Feet"
                  value={formData.sqft}
                  onChange={(e) => setFormData(prev => ({ ...prev, sqft: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Bedrooms"
                  value={formData.beds}
                  onChange={(e) => setFormData(prev => ({ ...prev, beds: parseInt(e.target.value) || 0 }))}
                />
                <Input
                  type="number"
                  placeholder="Bathrooms"
                  value={formData.baths}
                  onChange={(e) => setFormData(prev => ({ ...prev, baths: parseInt(e.target.value) || 0 }))}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.availability_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability_status: e.target.value }))}
                >
                  {availabilityStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <Input
                  placeholder="Completion Date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                />
                <div className="space-y-2">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Latitude (e.g., 44.2623)"
                    value={formData.latitude === 0 ? '' : formData.latitude}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({ 
                        ...prev, 
                        latitude: value === '' ? 0 : parseFloat(value) 
                      }))
                    }}
                  />
                  <p className="text-xs text-gray-500">North = positive, South = negative</p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Longitude (e.g., -88.4071)"
                    value={formData.longitude === 0 ? '' : formData.longitude}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({ 
                        ...prev, 
                        longitude: value === '' ? 0 : parseFloat(value) 
                      }))
                    }}
                  />
                  <p className="text-xs text-gray-500">West = negative, East = positive</p>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Lot Size</label>
                    <Input
                      placeholder="e.g., 0.25 acres, 8,500 sq ft"
                      value={formData.lot_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, lot_size: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Year Built</label>
                    <Input
                      type="number"
                      placeholder="e.g., 2024"
                      value={formData.year_built || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) || 0 }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.property_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                    >
                      <option value="Single Family Home">Single Family Home</option>
                      <option value="Townhome">Townhome</option>
                      <option value="Condo">Condo</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Custom Home">Custom Home</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Garage Spaces</label>
                    <Input
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.garage_spaces || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, garage_spaces: parseInt(e.target.value) || 0 }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Heating & Cooling</label>
                    <Input
                      placeholder="e.g., Central Air, Heat Pump"
                      value={formData.heating_cooling}
                      onChange={(e) => setFormData(prev => ({ ...prev, heating_cooling: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Flooring Type</label>
                    <Input
                      placeholder="e.g., Hardwood, Carpet, Tile"
                      value={formData.flooring_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, flooring_type: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">School District</label>
                    <Input
                      placeholder="e.g., Appleton Area School District"
                      value={formData.school_district}
                      onChange={(e) => setFormData(prev => ({ ...prev, school_district: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">HOA Fee</label>
                    <Input
                      placeholder="e.g., $150/month, None"
                      value={formData.hoa_fee}
                      onChange={(e) => setFormData(prev => ({ ...prev, hoa_fee: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Utilities Included</label>
                    <Input
                      placeholder="e.g., Water, Sewer, Electric"
                      value={formData.utilities_included}
                      onChange={(e) => setFormData(prev => ({ ...prev, utilities_included: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Exterior Materials</label>
                    <Input
                      placeholder="e.g., Brick, Vinyl Siding, Stone"
                      value={formData.exterior_materials}
                      onChange={(e) => setFormData(prev => ({ ...prev, exterior_materials: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Image Management Section */}
              <div className="mt-6">
                <label className="text-sm font-medium mb-4 block">Property Images</label>
                
                {editingProperty ? (
                  // Existing property - show gallery management
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload Images'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('single-image-upload')?.click()}
                          disabled={uploading}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Single Image
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        Upload multiple images at once • PNG, JPG, GIF up to 5MB each
                      </p>
                      
                      {/* Upload Progress */}
                      {Object.keys(uploadProgress).length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Upload Progress:</p>
                          {Object.entries(uploadProgress).map(([fileId, progress]) => {
                            const fileName = fileId.split('-')[0]
                            return (
                              <div key={fileId} className="flex items-center gap-2 text-sm">
                                <span className="truncate max-w-[200px]">{fileName}</span>
                                {progress === -1 ? (
                                  <span className="text-red-500">Failed</span>
                                ) : progress === 100 ? (
                                  <span className="text-green-500">Complete</span>
                                ) : (
                                  <span className="text-blue-500">Uploading...</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Images Gallery */}
                    {propertyImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {propertyImages.map((image, index) => (
                          <div key={image.id} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                              <Image
                                src={image.image_url}
                                alt={image.alt_text || `Property image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {image.is_main && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded">
                                  <Star className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-white text-black hover:bg-gray-100"
                                  onClick={() => setMainImage(image.id)}
                                  disabled={image.is_main}
                                >
                                  {image.is_main ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-white text-red-600 hover:bg-red-50"
                                  onClick={() => deletePropertyImage(image.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // New property - single main image upload
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.main_image ? (
                      <div className="space-y-4">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={formData.main_image}
                            alt="Property preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, main_image: '' }))}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove Image
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={uploading}
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            {uploading ? 'Uploading...' : 'Change Image'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={uploading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload Main Image'}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Start with a main image, add more after saving
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <input
                  id="single-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <textarea
                className="w-full mt-4 min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Property Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Features</label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Feature
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeFeature(index)}
                    >
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Property
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Property</h2>
                    <p className="text-red-100 mt-1">Create a new property listing for your portfolio</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetForm}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Property Title *</label>
                      <Input
                        placeholder="e.g., Modern Family Home - Willowbrook"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Price *</label>
                      <Input
                        placeholder="e.g., $850,000"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Location *</label>
                      <Input
                        placeholder="e.g., Willowbrook Subdivision, TX"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Square Feet *</label>
                      <Input
                        placeholder="e.g., 2,650"
                        value={formData.sqft}
                        onChange={(e) => setFormData(prev => ({ ...prev, sqft: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms *</label>
                        <Input
                          type="number"
                          placeholder="4"
                          value={formData.beds}
                          onChange={(e) => setFormData(prev => ({ ...prev, beds: parseInt(e.target.value) || 0 }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Bathrooms *</label>
                        <Input
                          type="number"
                          placeholder="3"
                          value={formData.baths}
                          onChange={(e) => setFormData(prev => ({ ...prev, baths: parseInt(e.target.value) || 0 }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status *</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Availability Status *</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.availability_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability_status: e.target.value }))}
                      >
                        {availabilityStatusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Completion Date *</label>
                      <Input
                        placeholder="e.g., March 2025"
                        value={formData.completion_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                                  </div>

                {/* Property Information Section */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Lot Size</label>
                      <Input
                        placeholder="e.g., 0.25 acres, 8,500 sq ft"
                        value={formData.lot_size}
                        onChange={(e) => setFormData(prev => ({ ...prev, lot_size: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Year Built</label>
                      <Input
                        type="number"
                        placeholder="e.g., 2024"
                        value={formData.year_built || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) || 0 }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.property_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                      >
                        <option value="Single Family Home">Single Family Home</option>
                        <option value="Townhome">Townhome</option>
                        <option value="Condo">Condo</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Custom Home">Custom Home</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Garage Spaces</label>
                      <Input
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.garage_spaces || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, garage_spaces: parseInt(e.target.value) || 0 }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Heating & Cooling</label>
                      <Input
                        placeholder="e.g., Central Air, Heat Pump"
                        value={formData.heating_cooling}
                        onChange={(e) => setFormData(prev => ({ ...prev, heating_cooling: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Flooring Type</label>
                      <Input
                        placeholder="e.g., Hardwood, Carpet, Tile"
                        value={formData.flooring_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, flooring_type: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">School District</label>
                      <Input
                        placeholder="e.g., Appleton Area School District"
                        value={formData.school_district}
                        onChange={(e) => setFormData(prev => ({ ...prev, school_district: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">HOA Fee</label>
                      <Input
                        placeholder="e.g., $150/month, None"
                        value={formData.hoa_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, hoa_fee: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Utilities Included</label>
                      <Input
                        placeholder="e.g., Water, Sewer, Electric"
                        value={formData.utilities_included}
                        onChange={(e) => setFormData(prev => ({ ...prev, utilities_included: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Exterior Materials</label>
                      <Input
                        placeholder="e.g., Brick, Vinyl Siding, Stone"
                        value={formData.exterior_materials}
                        onChange={(e) => setFormData(prev => ({ ...prev, exterior_materials: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Image Upload */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 mb-4 block">Property Main Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    {formData.main_image ? (
                      <div className="space-y-4">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden mx-auto max-w-md">
                          <Image
                            src={formData.main_image}
                            alt="Property preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex gap-3 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, main_image: '' }))}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove Image
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('modal-image-upload')?.click()}
                            disabled={uploading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Change Image'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('modal-image-upload')?.click()}
                            disabled={uploading}
                            className="bg-white"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload Main Image'}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Upload a high-quality main image for your property<br />
                          PNG, JPG, GIF up to 5MB • You can add more images after creating the property
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="modal-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Property Description *</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your property's key features, location benefits, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Features */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">Property Features</label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-input rounded-md bg-gray-50">
                    {formData.features.length > 0 ? (
                      formData.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-red-100"
                          onClick={() => removeFeature(index)}
                        >
                          {feature} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Click "Add Feature" to add property features like "Granite Counters", "2-Car Garage", etc.</p>
                    )}
                  </div>
                </div>

                {/* Coordinates (Optional) */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Map Coordinates (Optional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="Latitude (e.g., 44.2623)"
                        value={formData.latitude === 0 ? '' : formData.latitude}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormData(prev => ({ 
                            ...prev, 
                            latitude: value === '' ? 0 : parseFloat(value) 
                          }))
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">North = positive, South = negative</p>
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="Longitude (e.g., -88.4071)"
                        value={formData.longitude === 0 ? '' : formData.longitude}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormData(prev => ({ 
                            ...prev, 
                            longitude: value === '' ? 0 : parseFloat(value) 
                          }))
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">West = negative, East = positive</p>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">* Required fields</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={resetForm} className="min-w-[100px]">
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      className="bg-red-600 hover:bg-red-700 min-w-[140px]"
                      disabled={!formData.title || !formData.price || !formData.location}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Create Property
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className={`hover:shadow-md transition-shadow duration-200 border ${selectedProperties.has(property.id) ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50' : 'hover:border-gray-300'}`}>
              <CardContent className="p-4">
                {/* Header with Checkbox and Title */}
                <div className="flex items-start gap-3 mb-3">
                  <button
                    onClick={() => togglePropertySelection(property.id)}
                    className="mt-1 p-0.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    {selectedProperties.has(property.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{property.title}</h3>
                    <p className="text-lg font-bold text-red-600">{property.price}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{property.location}</p>
                </div>
                
                {/* Property Details - Simple Row */}
                <div className="flex items-center justify-between text-sm text-gray-700 mb-3 py-2 px-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1" />
                    <span className="font-medium">{property.beds} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 mr-1" />
                    <span className="font-medium">{property.baths} bath</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-3 h-3 mr-1" />
                    <span className="font-medium">{property.sqft}</span>
                  </div>
                </div>
                
                {/* Status and Date Row */}
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    className={`text-xs px-2 py-1 font-medium ${
                      property.status === 'Move-In Ready' ? 'bg-green-500' :
                      property.status === 'Nearly Complete' ? 'bg-blue-500' :
                      property.status === 'Under Construction' ? 'bg-orange-500' :
                      'bg-purple-500'
                    } text-white`}
                  >
                    {property.status}
                  </Badge>
                  <span className="text-xs text-gray-600">{property.completion_date}</span>
                </div>
                
                {/* Features - Simplified */}
                {property.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 2 && (
                        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{property.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={() => startEdit(property)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
            <Button onClick={startAddNew} className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Property
            </Button>
          </div>
        )}

        {/* Bulk Actions Toolbar */}
        {showBulkActions && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="shadow-lg border-2 border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {selectedProperties.size} property{selectedProperties.size !== 1 ? 'ies' : ''} selected
                    </span>
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300"></div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="px-3 py-1.5 border border-input rounded text-sm bg-background"
                    >
                      <option value="">Update Status...</option>
                      <option value="Move-In Ready">Move-In Ready</option>
                      <option value="Nearly Complete">Nearly Complete</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Pre-Construction">Pre-Construction</option>
                    </select>
                    
                    <Button
                      onClick={bulkUpdateStatus}
                      disabled={!bulkStatus}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300"></div>
                  
                  <Button
                    onClick={bulkDeleteProperties}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  
                  <Button
                    onClick={clearSelection}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Plan Selector Modal */}
      {showPlanSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Select a Plan as Template</h2>
              <Button variant="ghost" onClick={() => setShowPlanSelector(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading plans...</p>
                </div>
              ) : availablePlans.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Plans Available</h3>
                  <p className="text-gray-600 mb-4">Create some house plans first to use as templates.</p>
                  <Button asChild variant="outline">
                    <Link href="/admin/plans">Go to Plans Management</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availablePlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectPlanAsTemplate(plan)}>
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
                            <Star className="w-3 h-3 text-red-600" />
                            <span>${plan.price?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {plan.description || 'No description available'}
                        </p>
                        
                        <div className="pt-3 border-t">
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Use This Plan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <p className="text-sm text-gray-600">
                Select a plan to automatically populate property details
              </p>
              <Button variant="outline" onClick={() => setShowPlanSelector(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 