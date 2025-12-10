"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Home, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight
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
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalProperties: number
  averagePrice: number
  statusBreakdown: { [key: string]: number }
  recentProperties: Property[]
  completionTimeline: { month: string; count: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    averagePrice: 0,
    statusBreakdown: {},
    recentProperties: [],
    completionTimeline: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const properties: Property[] = await response.json()
        calculateStats(properties)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (properties: Property[]) => {
    // Basic stats
    const totalProperties = properties.length
    const prices = properties.map(p => parseFloat(p.price.replace(/[$,]/g, '')))
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length || 0

    // Status breakdown
    const statusBreakdown = properties.reduce((acc, property) => {
      acc[property.status] = (acc[property.status] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    // Recent properties (last 5)
    const recentProperties = properties
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    // Completion timeline (next 6 months)
    const completionTimeline = generateCompletionTimeline(properties)

    setStats({
      totalProperties,
      averagePrice,
      statusBreakdown,
      recentProperties,
      completionTimeline
    })
  }

  const generateCompletionTimeline = (properties: Property[]) => {
    const timeline: { month: string; count: number }[] = []
    const now = new Date()
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const count = properties.filter(p => {
        const completionDate = new Date(p.completion_date)
        return completionDate.getMonth() === date.getMonth() && 
               completionDate.getFullYear() === date.getFullYear()
      }).length
      
      timeline.push({ month: monthName, count })
    }
    
    return timeline
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Move-In Ready": return "bg-green-500"
      case "Nearly Complete": return "bg-blue-500"
      case "Under Construction": return "bg-orange-500"
      case "Pre-Construction": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const calculateTotalPortfolioValue = () => {
    return stats.recentProperties.reduce((sum, property) => {
      return sum + parseFloat(property.price.replace(/[$,]/g, ''))
    }, 0) * (stats.totalProperties / Math.max(stats.recentProperties.length, 1))
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your property portfolio</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 h-24 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 h-24 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Price</p>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.averagePrice)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 h-24 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Move-In Ready</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.statusBreakdown["Move-In Ready"] || 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 h-24 flex items-center">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Construction</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.statusBreakdown["Under Construction"] || 0}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Pipeline */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Property Status Pipeline</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                  const percentage = (count / stats.totalProperties) * 100
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(status)} text-white`}>
                          {status}
                        </Badge>
                        <span className="text-sm text-gray-600">{count} properties</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(status)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
                
                {Object.keys(stats.statusBreakdown).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No properties yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
                <Link href="/admin/properties" className="text-sm text-red-600 hover:text-red-700 flex items-center">
                  View all <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {stats.recentProperties.slice(0, 4).map((property) => (
                  <div key={property.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{property.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{property.location}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-green-600 text-sm">{property.price}</p>
                      <Badge className={`${getStatusColor(property.status)} text-white text-xs mt-1`}>
                        {property.status.split(' ')[0]}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {stats.recentProperties.length === 0 && (
                  <div className="text-center py-6">
                    <Home className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No properties yet</p>
                    <Button asChild size="sm" className="mt-3 bg-red-600 hover:bg-red-700">
                      <Link href="/admin/properties">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Property
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completion Timeline */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Completion Timeline</h3>
                <Link href="/admin/workflow" className="text-sm text-red-600 hover:text-red-700 flex items-center">
                  Workflow <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {stats.completionTimeline.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${Math.min((item.count / 3) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Portfolio Value</span>
                  <span className="font-bold text-green-600">{formatPrice(calculateTotalPortfolioValue())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-blue-600">
                    {stats.totalProperties > 0 ? Math.round(((stats.statusBreakdown["Move-In Ready"] || 0) / stats.totalProperties) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Pipeline</span>
                  <span className="font-bold text-purple-600">
                    {(stats.statusBreakdown["Under Construction"] || 0) + (stats.statusBreakdown["Pre-Construction"] || 0)}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/admin/analytics">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 