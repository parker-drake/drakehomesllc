"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Building,
  Users,
  Download,
  Filter
} from "lucide-react"

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  status: string
  description: string
  features: string[]
  completion_date: string
  created_at: string
  updated_at: string
}

interface AnalyticsData {
  totalRevenue: number
  averagePrice: number
  totalProperties: number
  completedProperties: number
  monthlyRevenue: { month: string; revenue: number; properties: number }[]
  statusDistribution: { status: string; count: number; revenue: number }[]
  completionTimeline: { month: string; count: number; revenue: number }[]
  revenueGrowth: number
  averageConstructionTime: number
  profitMargin: number
}

export default function Analytics() {
  const [properties, setProperties] = useState<Property[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    averagePrice: 0,
    totalProperties: 0,
    completedProperties: 0,
    monthlyRevenue: [],
    statusDistribution: [],
    completionTimeline: [],
    revenueGrowth: 0,
    averageConstructionTime: 0,
    profitMargin: 25 // Default estimate
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<string>('12months')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data: Property[] = await response.json()
        setProperties(data)
        calculateAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (properties: Property[]) => {
    // Calculate total revenue and metrics
    const totalRevenue = properties.reduce((sum, property) => {
      return sum + parseFloat(property.price.replace(/[$,]/g, ''))
    }, 0)

    const averagePrice = properties.length > 0 ? totalRevenue / properties.length : 0
    const completedProperties = properties.filter(p => p.status === 'Move-In Ready').length

    // Status distribution with revenue
    const statusDistribution = properties.reduce((acc, property) => {
      const price = parseFloat(property.price.replace(/[$,]/g, ''))
      const existing = acc.find(item => item.status === property.status)
      if (existing) {
        existing.count += 1
        existing.revenue += price
      } else {
        acc.push({ status: property.status, count: 1, revenue: price })
      }
      return acc
    }, [] as { status: string; count: number; revenue: number }[])

    // Monthly revenue calculation (last 12 months)
    const monthlyRevenue = generateMonthlyRevenue(properties)

    // Completion timeline (next 12 months)
    const completionTimeline = generateCompletionTimeline(properties)

    // Revenue growth calculation (simplified)
    const revenueGrowth = calculateRevenueGrowth(properties)

    // Average construction time (simplified estimation)
    const averageConstructionTime = 8 // months - could be calculated from actual data

    setAnalytics({
      totalRevenue,
      averagePrice,
      totalProperties: properties.length,
      completedProperties,
      monthlyRevenue,
      statusDistribution,
      completionTimeline,
      revenueGrowth,
      averageConstructionTime,
      profitMargin: 25 // This could be configurable or calculated
    })
  }

  const generateMonthlyRevenue = (properties: Property[]) => {
    const months: { month: string; revenue: number; properties: number }[] = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      // For demo purposes, we'll simulate monthly revenue based on completed properties
      // In real implementation, this would come from actual sales/completion dates
      const monthProperties = properties.filter(p => {
        const completionDate = new Date(p.completion_date)
        return completionDate.getMonth() === date.getMonth() && 
               completionDate.getFullYear() === date.getFullYear() &&
               p.status === 'Move-In Ready'
      })

      const revenue = monthProperties.reduce((sum, p) => {
        return sum + parseFloat(p.price.replace(/[$,]/g, ''))
      }, 0)

      months.push({ month: monthName, revenue, properties: monthProperties.length })
    }

    return months
  }

  const generateCompletionTimeline = (properties: Property[]) => {
    const timeline: { month: string; count: number; revenue: number }[] = []
    const now = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const monthProperties = properties.filter(p => {
        const completionDate = new Date(p.completion_date)
        return completionDate.getMonth() === date.getMonth() && 
               completionDate.getFullYear() === date.getFullYear()
      })

      const revenue = monthProperties.reduce((sum, p) => {
        return sum + parseFloat(p.price.replace(/[$,]/g, ''))
      }, 0)
      
      timeline.push({ month: monthName, count: monthProperties.length, revenue })
    }
    
    return timeline
  }

  const calculateRevenueGrowth = (properties: Property[]) => {
    // Simplified growth calculation based on completion dates
    // In a real implementation, this would use actual historical data
    return Math.random() * 20 + 5 // Random growth between 5-25% for demo
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading analytics...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="24months">Last 24 Months</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{analytics.revenueGrowth.toFixed(1)}% growth</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Property Value</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.averagePrice)}</p>
                  <p className="text-sm text-gray-500 mt-2">Per property</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Properties Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.completedProperties}</p>
                  <p className="text-sm text-gray-500 mt-2">Move-in ready</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Construction Time</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.averageConstructionTime}</p>
                  <p className="text-sm text-gray-500 mt-2">Months</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue by Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue by Status</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {analytics.statusDistribution.map((item, index) => {
                  const percentage = (item.revenue / analytics.totalRevenue) * 100
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(item.status)} text-white`}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-gray-600">{item.count} properties</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.revenue)}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStatusColor(item.status)}`}
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
              </div>
            </CardContent>
          </Card>

          {/* Completion Timeline */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Completion Timeline</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {analytics.completionTimeline.slice(0, 6).map((item, index) => {
                  const maxRevenue = Math.max(...analytics.completionTimeline.map(t => t.revenue))
                  const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 w-20">{item.month}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="h-4 rounded-full bg-red-500 flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          >
                            {item.count > 0 && (
                              <span className="text-xs text-white font-medium">{item.count}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-20 text-right">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Projections */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Financial Projections</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Projected Revenue</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(analytics.totalRevenue * 1.15)}
                </p>
                <p className="text-sm text-green-600 mt-1">Next 12 months</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Estimated Profit</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(analytics.totalRevenue * (analytics.profitMargin / 100))}
                </p>
                <p className="text-sm text-blue-600 mt-1">{analytics.profitMargin}% margin</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Portfolio Growth</h4>
                <p className="text-2xl font-bold text-purple-600">
                  +{Math.round(analytics.totalProperties * 0.2)}
                </p>
                <p className="text-sm text-purple-600 mt-1">Properties next year</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 