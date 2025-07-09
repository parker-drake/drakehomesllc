"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Home,
  MessageSquare,
  Filter,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"

interface Configuration {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_message?: string
  status: 'draft' | 'submitted' | 'contacted' | 'closed'
  created_at: string
  updated_at: string
  plans: {
    id: string
    title: string
    style: string
    main_image?: string
  }
  configuration_selections: {
    id: string
    customization_options: {
      id: string
      name: string
      description: string
      customization_categories: {
        id: string
        name: string
      }
    }
  }[]
}

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null)

  useEffect(() => {
    fetchConfigurations()
  }, [])

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/configurations')
      if (response.ok) {
        const data = await response.json()
        setConfigurations(data)
      }
    } catch (error) {
      console.error('Error fetching configurations:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfigurationStatus = async (configId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/configurations/${configId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      if (response.ok) {
        fetchConfigurations()
      }
    } catch (error) {
      console.error('Error updating configuration:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4" />
      case 'contacted':
        return <MessageSquare className="w-4 h-4" />
      case 'closed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const filteredConfigurations = configurations
    .filter(config => {
      if (filter === 'all') return true
      return config.status === filter
    })
    .filter(config => {
      if (!searchTerm) return true
      return (
        config.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.plans.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const groupedSelections = selectedConfig?.configuration_selections.reduce((acc, selection) => {
    const categoryName = selection.customization_options.customization_categories.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(selection.customization_options)
    return acc
  }, {} as Record<string, any[]>)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configurations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Configurations</h1>
        <p className="text-gray-600">Manage customer home customization requests</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              All ({configurations.length})
            </Button>
            <Button
              variant={filter === 'submitted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('submitted')}
              className={filter === 'submitted' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              New ({configurations.filter(c => c.status === 'submitted').length})
            </Button>
            <Button
              variant={filter === 'contacted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('contacted')}
              className={filter === 'contacted' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              In Progress ({configurations.filter(c => c.status === 'contacted').length})
            </Button>
            <Button
              variant={filter === 'closed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('closed')}
              className={filter === 'closed' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Closed ({configurations.filter(c => c.status === 'closed').length})
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, email, or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Configurations List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredConfigurations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No configurations found</h3>
              <p className="text-gray-600">No customer configurations match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredConfigurations.map((config) => (
            <Card key={config.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    {config.plans.main_image && (
                      <img
                        src={config.plans.main_image}
                        alt={config.plans.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{config.plans.title}</h3>
                      <p className="text-sm text-gray-600">{config.plans.style} Style</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(config.status)} border-0`}>
                      {getStatusIcon(config.status)}
                      <span className="ml-1 capitalize">{config.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{config.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <a
                      href={`mailto:${config.customer_email}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {config.customer_email}
                    </a>
                  </div>
                  {config.customer_phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <a
                        href={`tel:${config.customer_phone}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {config.customer_phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{formatDate(config.created_at)}</span>
                  </div>
                </div>

                {config.customer_message && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Message:</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {config.customer_message}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Configuration ({config.configuration_selections.length} selections)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {config.configuration_selections.slice(0, 3).map((selection) => (
                      <Badge key={selection.id} variant="secondary" className="text-xs">
                        {selection.customization_options.customization_categories.name}: {selection.customization_options.name}
                      </Badge>
                    ))}
                    {config.configuration_selections.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{config.configuration_selections.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedConfig(config)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <div className="flex space-x-2">
                    {config.status === 'submitted' && (
                      <Button
                        size="sm"
                        onClick={() => updateConfigurationStatus(config.id, 'contacted')}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Mark as Contacted
                      </Button>
                    )}
                    {config.status === 'contacted' && (
                      <Button
                        size="sm"
                        onClick={() => updateConfigurationStatus(config.id, 'closed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark as Closed
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/plans/${config.plans.id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Configuration Details Modal */}
      {selectedConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Configuration Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedConfig(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedConfig.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedConfig.customer_email}</p>
                    </div>
                    {selectedConfig.customer_phone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedConfig.customer_phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-medium">{formatDate(selectedConfig.created_at)}</p>
                    </div>
                  </div>
                  {selectedConfig.customer_message && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Message</p>
                      <p className="font-medium mt-1">{selectedConfig.customer_message}</p>
                    </div>
                  )}
                </div>

                {/* Plan Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Plan</h3>
                  <div className="flex items-center space-x-4">
                    {selectedConfig.plans.main_image && (
                      <img
                        src={selectedConfig.plans.main_image}
                        alt={selectedConfig.plans.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="text-lg font-semibold">{selectedConfig.plans.title}</p>
                      <p className="text-gray-600">{selectedConfig.plans.style} Style</p>
                    </div>
                  </div>
                </div>

                {/* Configuration Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Selections</h3>
                  <div className="space-y-4">
                    {groupedSelections && Object.entries(groupedSelections).map(([category, options]) => (
                      <div key={category} className="border-b border-gray-200 pb-3">
                        <p className="font-medium text-gray-900 mb-2">{category}</p>
                        <div className="space-y-1">
                          {options.map((option) => (
                            <div key={option.id} className="flex justify-between">
                              <span className="text-sm text-gray-700">{option.name}</span>
                              <span className="text-sm text-gray-500">{option.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 