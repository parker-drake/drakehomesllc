"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DebugPlansPage() {
  const [planId, setPlanId] = useState('')
  const [planData, setPlanData] = useState(null)
  const [error, setError] = useState('')

  const fetchPlan = async () => {
    if (!planId.trim()) {
      setError('Please enter a plan ID')
      return
    }

    try {
      setError('')
      const response = await fetch(`/api/plans/${planId}`)
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Full plan data:', data)
        setPlanData(data)
      } else {
        const errorData = await response.text()
        console.error('API error:', errorData)
        setError(`API Error: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setError(`Network error: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Plan Documents</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Plan ID:</label>
          <Input
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            placeholder="Enter plan ID to test"
            className="max-w-md"
          />
        </div>
        <Button onClick={fetchPlan}>Fetch Plan Data</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {planData && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Plan Basic Info:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify({
                id: planData.id,
                title: planData.title,
                description: planData.description
              }, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Plan Documents:</h2>
            <p className="mb-2">
              Documents found: {planData.plan_documents?.length || 0}
            </p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(planData.plan_documents || [], null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Plan Images:</h2>
            <p className="mb-2">
              Images found: {planData.plan_images?.length || 0}
            </p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(planData.plan_images || [], null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Full Raw Data:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(planData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
} 