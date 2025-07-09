"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  ArrowRight,
  Home,
  CheckCircle,
  Circle,
  Mail,
  Phone,
  User,
  MessageSquare,
  Loader2
} from "lucide-react"

interface Plan {
  id: string
  title: string
  description: string
  square_footage: number
  bedrooms: number
  bathrooms: number
  style: string
  main_image: string
}

interface CustomizationOption {
  id: string
  name: string
  description: string
  image_url?: string
  is_default: boolean
  sort_order: number
}

interface CustomizationCategory {
  id: string
  name: string
  description: string
  step_order: number
  icon: string
  customization_options: CustomizationOption[]
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  message: string
}

export default function PlanConfiguratorPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params.id as string

  const [plan, setPlan] = useState<Plan | null>(null)
  const [categories, setCategories] = useState<CustomizationCategory[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<{[categoryId: string]: string | string[] | {material?: string, primary?: string, accent?: string}}>({})
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchData()
  }, [planId])

  const fetchData = async () => {
    try {
      // Fetch plan details
      const planResponse = await fetch(`/api/plans/${planId}`)
      if (planResponse.ok) {
        const planData = await planResponse.json()
        setPlan(planData)
      }

      // Fetch customization options
      const optionsResponse = await fetch(`/api/customization-options?plan_id=${planId}`)
      if (optionsResponse.ok) {
        const optionsData = await optionsResponse.json()
        setCategories(optionsData)
        
        // Set default selections
        const defaults: {[categoryId: string]: string | string[] | {material?: string, primary?: string, accent?: string}} = {}
        optionsData.forEach((category: CustomizationCategory) => {
          if (category.name === 'Exterior') {
            // Handle exterior category with separate material/primary/accent defaults
            const defaultMaterial = category.customization_options.find(option => {
              const materialKeywords = ['vinyl', 'siding', 'fiber', 'cement', 'brick', 'exterior']
              return option.is_default && materialKeywords.some(keyword => option.name.toLowerCase().includes(keyword))
            })
            
            const colorOptions = category.customization_options.filter(option => {
              const materialKeywords = ['vinyl', 'siding', 'fiber', 'cement', 'brick', 'exterior']
              return !materialKeywords.some(keyword => option.name.toLowerCase().includes(keyword))
            })
            
            // Set default primary and accent colors (first two color options if available)
            const defaultPrimary = colorOptions[0]
            const defaultAccent = colorOptions[1] || colorOptions[0] // Use same color if only one available
            
            defaults[category.id] = {
              material: defaultMaterial?.id,
              primary: defaultPrimary?.id,
              accent: defaultAccent?.id
            }
          } else {
            // Single default for other categories
            const defaultOption = category.customization_options.find(option => option.is_default)
            if (defaultOption) {
              defaults[category.id] = defaultOption.id
            }
          }
        })
        setSelectedOptions(defaults)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (categoryId: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [categoryId]: optionId
    }))
  }

  const handleExteriorOptionSelect = (categoryId: string, optionId: string, selectionType: 'material' | 'primary' | 'accent') => {
    setSelectedOptions(prev => {
      const current = prev[categoryId] as {material?: string, primary?: string, accent?: string} || {}
      
      return {
        ...prev,
        [categoryId]: {
          ...current,
          [selectionType]: optionId
        }
      }
    })
  }

  const handleNext = () => {
    if (currentStep < categories.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex <= categories.length) {
      setCurrentStep(stepIndex)
    }
  }

  const handleSubmit = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in your name and email address.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          customer_email: customerInfo.email,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_message: customerInfo.message,
          selected_options: Object.values(selectedOptions).flatMap(value => {
            if (typeof value === 'object' && !Array.isArray(value)) {
              // Handle exterior category structure
              return Object.values(value).filter(Boolean) as string[]
            }
            if (Array.isArray(value)) {
              return value
            }
            return value ? [value] : []
          })
        })
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Error submitting configuration. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting configuration:', error)
      alert('Error submitting configuration. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isStepComplete = (stepIndex: number) => {
    if (stepIndex >= categories.length) return true
    const category = categories[stepIndex]
    const selections = selectedOptions[category.id]
    
    // For exterior category, check if we have material, primary, and accent selections
    if (category.name === 'Exterior') {
      const exteriorSelections = selections as {material?: string, primary?: string, accent?: string} || {}
      return !!(exteriorSelections.material && exteriorSelections.primary && exteriorSelections.accent)
    }
    
    return selections !== undefined
  }

  const getSelectedOption = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    const optionId = selectedOptions[categoryId]
    if (Array.isArray(optionId)) {
      return category?.customization_options.filter(opt => optionId.includes(opt.id))
    }
    return category?.customization_options.find(opt => opt.id === optionId)
  }

  const getSelectedOptions = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return []
    
    const selections = selectedOptions[categoryId]
    
    // Handle exterior category differently
    if (category.name === 'Exterior') {
      const exteriorSelections = selections as {material?: string, primary?: string, accent?: string} || {}
      const selectedIds = Object.values(exteriorSelections).filter(Boolean) as string[]
      return category.customization_options.filter(opt => selectedIds.includes(opt.id))
    }
    
    // Handle other categories
    const selectionsArray = Array.isArray(selections) ? selections : (selections ? [selections] : [])
    return category.customization_options.filter(opt => selectionsArray.includes(opt.id))
  }

  // Check if category is likely a color/material category
  const isColorCategory = (category: CustomizationCategory) => {
    const colorKeywords = ['color', 'colors', 'siding', 'paint', 'stain', 'finish', 'material']
    const categoryName = category.name.toLowerCase()
    const hasColorKeyword = colorKeywords.some(keyword => categoryName.includes(keyword))
    const hasMoreThanFiveOptions = category.customization_options.length > 5
    return hasColorKeyword || hasMoreThanFiveOptions
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading configurator...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">The plan you're trying to configure doesn't exist.</p>
          <Button onClick={() => router.push('/plans')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in customizing {plan.title}. 
            We'll review your selections and get back to you soon.
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push('/plans')} className="w-full">
              Browse More Plans
            </Button>
            <Button variant="outline" onClick={() => router.push('/contact')} className="w-full">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentCategory = categories[currentStep]
  const isLastStep = currentStep === categories.length
  const isFirstStep = currentStep === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push(`/plans/${planId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plan
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">Customize {plan.title}</h1>
              <p className="text-sm text-gray-600">{plan.style} Style</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Step {Math.min(currentStep + 1, categories.length + 1)} of {categories.length + 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {categories.map((category, index) => (
              <div key={category.id} className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    isStepComplete(index) ? 'bg-green-600 text-white hover:bg-green-700' :
                    index === currentStep ? 'bg-red-600 text-white hover:bg-red-700' :
                    'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isStepComplete(index) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                <button
                  onClick={() => goToStep(index)}
                  className={`ml-2 text-sm font-medium transition-colors hover:text-red-600 ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {category.name}
                </button>
                {index < categories.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    isStepComplete(index) ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
            <div className="flex items-center">
              <button
                onClick={() => goToStep(categories.length)}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 ${
                  currentStep === categories.length ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <span className="text-sm font-medium">{categories.length + 1}</span>
              </button>
              <button
                onClick={() => goToStep(categories.length)}
                className={`ml-2 text-sm font-medium transition-colors hover:text-red-600 ${
                  currentStep === categories.length ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isLastStep ? (
          // Option Selection Steps
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentCategory.name}</h2>
              <p className="text-gray-600">{currentCategory.description}</p>
            </div>

            {currentCategory.name === 'Exterior' ? (
              // Special exterior category with material and color selections
              <div className="space-y-8">
                {/* Material Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Exterior Material</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentCategory.customization_options
                      .filter(option => {
                        // Show material options (vinyl, fiber cement, brick, etc.)
                        const materialKeywords = ['vinyl', 'siding', 'fiber', 'cement', 'brick', 'exterior']
                        return materialKeywords.some(keyword => option.name.toLowerCase().includes(keyword))
                      })
                      .map((option) => {
                        const exteriorSelections = selectedOptions[currentCategory.id] as {material?: string, primary?: string, accent?: string} || {}
                        const isSelected = exteriorSelections.material === option.id
                        return (
                          <Card 
                            key={option.id} 
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              isSelected ? 'ring-2 ring-red-600 shadow-lg' : 'hover:shadow-md'
                            }`}
                            onClick={() => handleExteriorOptionSelect(currentCategory.id, option.id, 'material')}
                          >
                            <CardContent className="p-4">
                              {option.image_url && (
                                <div className="relative h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                  <Image
                                    src={option.image_url}
                                    alt={option.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{option.name}</h4>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300'
                                }`}>
                                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm">{option.description}</p>
                              
                              {option.is_default && (
                                <Badge variant="secondary" className="text-xs mt-2">Standard</Badge>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                </div>

                {/* Primary Siding Color */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Siding Color</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {currentCategory.customization_options
                      .filter(option => {
                        // Show color options (exclude materials)
                        const materialKeywords = ['vinyl', 'siding', 'fiber', 'cement', 'brick', 'exterior']
                        return !materialKeywords.some(keyword => option.name.toLowerCase().includes(keyword))
                      })
                      .map((option) => {
                        const exteriorSelections = selectedOptions[currentCategory.id] as {material?: string, primary?: string, accent?: string} || {}
                        const isSelected = exteriorSelections.primary === option.id
                        const displayName = option.name
                        return (
                          <div
                            key={option.id}
                            className={`group cursor-pointer transition-all duration-200 ${
                              isSelected ? 'transform scale-105' : 'hover:transform hover:scale-105'
                            }`}
                            onClick={() => handleExteriorOptionSelect(currentCategory.id, option.id, 'primary')}
                          >
                            <div className={`relative rounded-lg overflow-hidden border-4 transition-all ${
                              isSelected ? 'border-red-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              {option.image_url ? (
                                <div className="relative h-24 w-full bg-gray-100">
                                  <Image
                                    src={option.image_url}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-24 w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs font-medium">{displayName}</span>
                                </div>
                              )}
                              
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-red-600 rounded-full p-1">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2 text-center">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                {displayName}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Accent Siding Color */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Accent Siding Color</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {currentCategory.customization_options
                      .filter(option => {
                        // Show color options (exclude materials)
                        const materialKeywords = ['vinyl', 'siding', 'fiber', 'cement', 'brick', 'exterior']
                        return !materialKeywords.some(keyword => option.name.toLowerCase().includes(keyword))
                      })
                      .map((option) => {
                        const exteriorSelections = selectedOptions[currentCategory.id] as {material?: string, primary?: string, accent?: string} || {}
                        const isSelected = exteriorSelections.accent === option.id
                        const displayName = option.name
                        return (
                          <div
                            key={option.id}
                            className={`group cursor-pointer transition-all duration-200 ${
                              isSelected ? 'transform scale-105' : 'hover:transform hover:scale-105'
                            }`}
                            onClick={() => handleExteriorOptionSelect(currentCategory.id, option.id, 'accent')}
                          >
                            <div className={`relative rounded-lg overflow-hidden border-4 transition-all ${
                              isSelected ? 'border-red-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              {option.image_url ? (
                                <div className="relative h-24 w-full bg-gray-100">
                                  <Image
                                    src={option.image_url}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-24 w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs font-medium">{displayName}</span>
                                </div>
                              )}
                              
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-red-600 rounded-full p-1">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2 text-center">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                {displayName}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            ) : isColorCategory(currentCategory) ? (
              // Compact color/material layout
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {currentCategory.customization_options.map((option) => (
                    <div
                      key={option.id}
                      className={`group cursor-pointer transition-all duration-200 ${
                        selectedOptions[currentCategory.id] === option.id 
                          ? 'transform scale-105' 
                          : 'hover:transform hover:scale-105'
                      }`}
                      onClick={() => handleOptionSelect(currentCategory.id, option.id)}
                    >
                      <div className={`relative rounded-lg overflow-hidden border-4 transition-all ${
                        selectedOptions[currentCategory.id] === option.id
                          ? 'border-red-600 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {option.image_url ? (
                          <div className="relative h-24 w-full bg-gray-100">
                            <Image
                              src={option.image_url}
                              alt={option.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-medium">{option.name}</span>
                          </div>
                        )}
                        
                        {selectedOptions[currentCategory.id] === option.id && (
                          <div className="absolute top-1 right-1 bg-red-600 rounded-full p-1">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        {option.is_default && (
                          <div className="absolute bottom-1 left-1">
                            <Badge variant="secondary" className="text-xs py-0 px-1">
                              Standard
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                          {option.name}
                        </p>
                        {option.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Standard layout for non-color options
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCategory.customization_options.map((option) => (
                  <Card 
                    key={option.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedOptions[currentCategory.id] === option.id 
                        ? 'ring-2 ring-red-600 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleOptionSelect(currentCategory.id, option.id)}
                  >
                    <CardContent className="p-6">
                      {option.image_url && (
                        <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={option.image_url}
                            alt={option.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOptions[currentCategory.id] === option.id
                            ? 'border-red-600 bg-red-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedOptions[currentCategory.id] === option.id && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                      
                      {option.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Standard
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Summary and Contact Form
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Configuration Summary</h2>
              <p className="text-gray-600">Review your selections and provide your contact information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Options</h3>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const selectedOptions = getSelectedOptions(category.id)
                      const hasSelection = selectedOptions.length > 0
                      return (
                        <div key={category.id} className="border-b border-gray-200 pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{category.name}</p>
                                {hasSelection ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                )}
                              </div>
                              <div className={`text-sm ${hasSelection ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                                {hasSelection ? (
                                  selectedOptions.length === 1 ? (
                                    selectedOptions[0].name
                                  ) : (
                                    <div className="space-y-1">
                                      {selectedOptions.map((option) => (
                                        <div key={option.id}>• {option.name}</div>
                                      ))}
                                    </div>
                                  )
                                ) : (
                                  'No selection yet'
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => goToStep(categories.indexOf(category))}
                              className="text-xs"
                            >
                              {hasSelection ? 'Change' : 'Select'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <Input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        rows={4}
                        value={customerInfo.message}
                        onChange={(e) => setCustomerInfo({...customerInfo, message: e.target.value})}
                        placeholder="Any additional questions or comments..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {!isLastStep ? (
            <Button 
              onClick={handleNext}
              className="bg-red-600 hover:bg-red-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={submitting || !customerInfo.name || !customerInfo.email}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Configuration
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 