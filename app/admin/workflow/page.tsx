"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Plus,
  Edit,
  Eye,
  Trash2,
  DollarSign,
  Home as HomeIcon,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Square,
  MoreVertical,
  Grip
} from "lucide-react"

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
  description: string
  features: string[]
  completion_date: string
  created_at: string
  updated_at: string
}

const statusColumns = [
  { 
    id: 'Pre-Construction', 
    title: 'Pre-Construction', 
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200' 
  },
  { 
    id: 'Under Construction', 
    title: 'Under Construction', 
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200' 
  },
  { 
    id: 'Nearly Complete', 
    title: 'Nearly Complete', 
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200' 
  },
  { 
    id: 'Move-In Ready', 
    title: 'Move-In Ready', 
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200' 
  }
]

export default function PropertyWorkflow() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedProperty, setDraggedProperty] = useState<Property | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        const cleanedData = data.map((property: any) => ({
          ...property,
          features: Array.isArray(property.features) ? property.features : [],
        }))
        setProperties(cleanedData)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPropertiesByStatus = (status: string) => {
    return properties.filter(property => property.status === status)
  }

  const handleDragStart = (e: React.DragEvent, property: Property) => {
    setDraggedProperty(property)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedProperty || draggedProperty.status === newStatus) {
      setDraggedProperty(null)
      return
    }

    try {
      const response = await fetch(`/api/properties/${draggedProperty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...draggedProperty,
          status: newStatus
        }),
      })

      if (response.ok) {
        // Update local state
        setProperties(prev => prev.map(property => 
          property.id === draggedProperty.id 
            ? { ...property, status: newStatus }
            : property
        ))
      } else {
        alert('Error updating property status')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Error updating property status')
    }

    setDraggedProperty(null)
  }

  const formatPrice = (price: string) => {
    return price
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading workflow...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Property Workflow</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin/properties">
                <Edit className="w-4 h-4 mr-2" />
                Manage Properties
              </Link>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/admin/properties">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>
        </div>

        {/* Workflow Instructions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Grip className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag and drop properties between columns to update their status. 
                Click on a property card for quick actions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {statusColumns.map((column) => {
            const columnProperties = getPropertiesByStatus(column.id)
            const isDragOver = dragOverColumn === column.id
            
            return (
              <div
                key={column.id}
                className={`${column.bgColor} ${column.borderColor} border-2 rounded-lg p-4 min-h-[600px] transition-all ${
                  isDragOver ? 'border-dashed border-4 bg-opacity-70' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-white">
                    {columnProperties.length}
                  </Badge>
                </div>

                                 {/* Property Cards */}
                 <div className="space-y-2">
                   {columnProperties.map((property) => (
                     <Card
                       key={property.id}
                       className="cursor-move hover:shadow-md transition-shadow bg-white border border-gray-200"
                       draggable
                       onDragStart={(e) => handleDragStart(e, property)}
                     >
                       <CardContent className="p-3">
                         <div className="flex items-center justify-between">
                           {/* Left Side - Property Info */}
                           <div className="flex-1 min-w-0">
                             <h4 className="font-medium text-gray-900 text-xs leading-tight truncate">
                               {property.title}
                             </h4>
                             <p className="text-sm font-bold text-green-600 mt-1">
                               {formatPrice(property.price)}
                             </p>
                             <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                               <div className="flex items-center gap-1">
                                 <MapPin className="w-3 h-3 flex-shrink-0" />
                                 <span className="truncate">{property.location}</span>
                               </div>
                             </div>
                           </div>
                           
                           {/* Right Side - Quick Actions */}
                           <div className="flex gap-1 ml-2">
                             <Button 
                               asChild
                               variant="ghost" 
                               size="sm" 
                               className="h-6 w-6 p-0"
                             >
                               <Link href={`/available-homes/${property.id}`}>
                                 <Eye className="w-3 h-3" />
                               </Link>
                             </Button>
                             <Button 
                               asChild
                               variant="ghost" 
                               size="sm" 
                               className="h-6 w-6 p-0"
                             >
                               <Link href="/admin/properties">
                                 <Edit className="w-3 h-3" />
                               </Link>
                             </Button>
                           </div>
                         </div>
                         
                         {/* Bottom Row - Details */}
                         <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                           <div className="flex items-center gap-3">
                             <span>{property.beds}br</span>
                             <span>{property.baths}ba</span>
                             <span>{property.sqft}</span>
                           </div>
                           <div className="flex items-center gap-1">
                             <Calendar className="w-3 h-3" />
                             <span>{formatDate(property.completion_date)}</span>
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                  
                  {/* Empty State */}
                  {columnProperties.length === 0 && (
                    <div className="text-center py-8 opacity-50">
                      <HomeIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No properties</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusColumns.map((column) => {
                const count = getPropertiesByStatus(column.id).length
                const totalValue = getPropertiesByStatus(column.id).reduce((sum, property) => {
                  return sum + parseFloat(property.price.replace(/[$,]/g, ''))
                }, 0)
                
                return (
                  <div key={column.id} className="text-center">
                    <div className={`w-4 h-4 rounded-full ${column.color} mx-auto mb-2`}></div>
                    <p className="text-sm font-medium text-gray-900">{column.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(totalValue)}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 