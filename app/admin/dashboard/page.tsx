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
  TrendingUp, 
  Clock
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your property portfolio</p>
        </div>

        {/* Key Metrics - 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Properties</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProperties}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Price</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(stats.averagePrice)}</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Move-In Ready</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.statusBreakdown["Move-In Ready"] || 0}</p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{stats.statusBreakdown["Under Construction"] || 0}</p>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                  const percentage = (count / stats.totalProperties) * 100
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(status)}`} />
                      <span className="text-sm text-gray-700 flex-1 truncate">{status}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                      <span className="text-xs text-gray-400 w-8 text-right">{percentage.toFixed(0)}%</span>
                    </div>
                  )
                })}
                {Object.keys(stats.statusBreakdown).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-2">No data</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Completions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Completions</h3>
                <Link href="/admin/workflow" className="text-xs text-red-600 hover:text-red-700">
                  Workflow →
                </Link>
              </div>
              <div className="space-y-2">
                {stats.completionTimeline.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-14 flex-shrink-0">{item.month}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-red-500"
                        style={{ width: `${Math.min((item.count / 3) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-3">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/admin/selection-wizard">
                    <Plus className="w-4 h-4 mr-1" />
                    New Selection Book
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/admin/properties">
                    <Home className="w-4 h-4 mr-1" />
                    Add Property
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties - Full Width */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Recent Properties</h3>
              <Link href="/admin/properties" className="text-xs text-red-600 hover:text-red-700">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.recentProperties.slice(0, 6).map((property) => (
                <div key={property.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`w-1 h-10 rounded-full flex-shrink-0 ${getStatusColor(property.status)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{property.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{property.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm">{property.price}</p>
                    <p className="text-xs text-gray-500">{property.status.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {stats.recentProperties.length === 0 && (
              <div className="text-center py-6">
                <Home className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No properties yet</p>
                <Button asChild size="sm" className="mt-3 bg-red-600 hover:bg-red-700">
                  <Link href="/admin/properties">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Property
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 