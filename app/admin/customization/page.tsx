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
  Save,
  X,
  Settings,
  Home,
  Palette,
  Zap,
  ChefHat,
  Bath,
  Eye,
  EyeOff
} from "lucide-react"

interface CustomizationOption {
  id: string
  name: string
  description: string
  image_url?: string
  is_default: boolean
  sort_order: number
  is_active: boolean
}

interface CustomizationCategory {
  id: string
  name: string
  description: string
  step_order: number
  icon: string
  is_active: boolean
  customization_options: CustomizationOption[]
}

interface Plan {
  id: string
  title: string
  style: string
}

export default function CustomizationManagementPage() {
  const [categories, setCategories] = useState<CustomizationCategory[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingOption, setEditingOption] = useState<string | null>(null)
  const [newOption, setNewOption] = useState<{
    categoryId: string
    name: string
    description: string
    image_url: string
    is_default: boolean
    sort_order: number
  } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch categories and options
      console.log('Fetching customization options...')
      const categoriesResponse = await fetch('/api/customization-options')
      console.log('Categories response status:', categoriesResponse.status)
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        console.log('Categories data:', categoriesData)
        setCategories(categoriesData)
      } else {
        const errorData = await categoriesResponse.json()
        console.error('Categories fetch error:', errorData)
        alert(`Error loading categories: ${errorData.error || 'Unknown error'}`)
      }

      // Fetch plans
      console.log('Fetching plans...')
      const plansResponse = await fetch('/api/plans')
      console.log('Plans response status:', plansResponse.status)
      
      if (plansResponse.ok) {
        const plansData = await plansResponse.json()
        console.log('Plans data:', plansData)
        setPlans(plansData)
      } else {
        const errorData = await plansResponse.json()
        console.error('Plans fetch error:', errorData)
        alert(`Error loading plans: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Network error fetching data:', error)
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'customization-options')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        const error = await response.json()
        alert(`Error uploading image: ${error.error || 'Unknown error'}`)
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddOption = async (categoryId: string) => {
    if (!newOption || !newOption.name.trim()) return

    try {
      console.log('Submitting option:', {
        category_id: categoryId,
        name: newOption.name,
        description: newOption.description,
        image_url: newOption.image_url || null,
        is_default: newOption.is_default,
        sort_order: newOption.sort_order
      })

      const response = await fetch('/api/customization-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id: categoryId,
          name: newOption.name,
          description: newOption.description,
          image_url: newOption.image_url || null,
          is_default: newOption.is_default,
          sort_order: newOption.sort_order
        })
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok) {
        setNewOption(null)
        fetchData() // Refresh data
        alert('Option added successfully!')
      } else {
        console.error('API Error:', result)
        alert(`Error adding option: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Network Error:', error)
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const toggleOptionActive = async (optionId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/customization-options/${optionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !isActive
        })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error toggling option:', error)
    }
  }

  const deleteOption = async (optionId: string, optionName: string) => {
    if (!confirm(`Are you sure you want to delete "${optionName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/customization-options/${optionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      } else {
        const result = await response.json()
        alert(`Error deleting option: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting option:', error)
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'home': Home,
      'palette': Palette,
      'zap': Zap,
      'chef-hat': ChefHat,
      'bath': Bath,
      'plus': Plus,
      'settings': Settings
    }
    const IconComponent = icons[iconName] || Settings
    return <IconComponent className="w-5 h-5" />
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customization options...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customization Management</h1>
        <p className="text-gray-600">Manage customization categories and options for your home plans</p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getIconComponent(category.icon)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Step {category.step_order}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewOption({
                      categoryId: category.id,
                      name: '',
                      description: '',
                      image_url: '',
                      is_default: false,
                      sort_order: category.customization_options.length + 1
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>

              {/* Add New Option Form */}
              {newOption && newOption.categoryId === category.id && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Add New Option</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option Name *
                      </label>
                      <Input
                        type="text"
                        value={newOption.name}
                        onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                        placeholder="e.g., Hardwood Floors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image (optional)
                      </label>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = await handleImageUpload(file)
                              if (url) {
                                setNewOption({...newOption, image_url: url})
                              }
                            }
                          }}
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-red-600 rounded-full mr-2"></div>
                            Uploading image...
                          </div>
                        )}
                        {newOption.image_url && (
                          <div className="mt-2">
                            <img
                              src={newOption.image_url}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        rows={3}
                        value={newOption.description}
                        onChange={(e) => setNewOption({...newOption, description: e.target.value})}
                        placeholder="Describe this option..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newOption.is_default}
                          onChange={(e) => setNewOption({...newOption, is_default: e.target.checked})}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Make this the default option</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <Input
                        type="number"
                        value={newOption.sort_order}
                        onChange={(e) => setNewOption({...newOption, sort_order: parseInt(e.target.value) || 0})}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setNewOption(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleAddOption(category.id)}
                      disabled={!newOption.name.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-3">
                {category.customization_options.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No options yet. Add your first option above.</p>
                ) : (
                  category.customization_options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {option.image_url && (
                          <img
                            src={option.image_url}
                            alt={option.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{option.name}</h4>
                            {option.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleOptionActive(option.id, option.is_active)}
                          className={option.is_active ? 'text-green-600' : 'text-gray-400'}
                        >
                          {option.is_active ? (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Inactive
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOption(option.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteOption(option.id, option.name)}
                          className="text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {categories.length}
              </div>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {categories.reduce((sum, cat) => sum + cat.customization_options.length, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Options</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {plans.length}
              </div>
              <p className="text-sm text-gray-600">Available Plans</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 