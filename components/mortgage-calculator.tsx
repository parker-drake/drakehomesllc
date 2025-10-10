"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DollarSign, Percent, Calendar, TrendingUp, Home } from 'lucide-react'

interface MortgageCalculatorProps {
  homePrice: number
  propertyTitle?: string
}

export function MortgageCalculator({ homePrice, propertyTitle }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(homePrice)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(7.0)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTax, setPropertyTax] = useState(0.25) // % per year
  const [insurance, setInsurance] = useState(100) // monthly
  const [hoaFees, setHoaFees] = useState(0) // monthly

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [principalInterest, setPrincipalInterest] = useState(0)
  const [monthlyTax, setMonthlyTax] = useState(0)

  useEffect(() => {
    setPrice(homePrice)
  }, [homePrice])

  useEffect(() => {
    calculatePayment()
  }, [price, downPaymentPercent, interestRate, loanTerm, propertyTax, insurance, hoaFees])

  const calculatePayment = () => {
    const downPayment = price * (downPaymentPercent / 100)
    const loanAmount = price - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Calculate monthly principal & interest using mortgage formula
    let pi = 0
    if (monthlyRate > 0) {
      pi = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    } else {
      pi = loanAmount / numberOfPayments
    }

    // Calculate monthly property tax
    const monthlyPropertyTax = (price * (propertyTax / 100)) / 12

    // Total monthly payment
    const total = pi + monthlyPropertyTax + insurance + hoaFees

    setPrincipalInterest(pi)
    setMonthlyTax(monthlyPropertyTax)
    setMonthlyPayment(total)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const downPaymentAmount = price * (downPaymentPercent / 100)
  const loanAmount = price - downPaymentAmount

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">Mortgage Calculator</h3>
        </div>
        <p className="text-red-100 text-sm">
          Estimate your monthly payment for {propertyTitle || 'this property'}
        </p>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Home Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Home Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="pl-7 h-12 text-base font-medium"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Down Payment
            </label>
            <span className="text-sm text-gray-600">{formatCurrency(downPaymentAmount)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="range"
              min="0"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value))}
              className="flex-1"
            />
            <div className="w-16 text-center">
              <Input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                className="h-10 text-center"
                min="0"
                max="100"
              />
            </div>
            <span className="text-sm text-gray-600">%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Interest Rate (APR)
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              step="0.125"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="h-12"
            />
            <span className="text-sm text-gray-600">%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loan Term
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[15, 20, 30].map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`px-4 py-2 rounded-md border-2 font-medium transition-all ${
                  loanTerm === term
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {term} years
              </button>
            ))}
          </div>
        </div>

        {/* Additional Costs */}
        <div className="pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Additional Costs</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Property Tax Rate (%/year)</label>
              <Input
                type="number"
                step="0.1"
                value={propertyTax}
                onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Home Insurance ($/month)</label>
              <Input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">HOA Fees ($/month)</label>
              <Input
                type="number"
                value={hoaFees}
                onChange={(e) => setHoaFees(parseFloat(e.target.value) || 0)}
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="pt-6 border-t bg-gradient-to-br from-red-50 to-orange-50 -mx-6 -mb-6 p-6 rounded-b-lg">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">Estimated Monthly Payment</p>
            <p className="text-4xl font-bold text-red-600">
              {formatCurrency(monthlyPayment)}
            </p>
            <p className="text-xs text-gray-500 mt-1">per month</p>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal & Interest:</span>
              <span className="font-semibold">{formatCurrency(principalInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Property Tax:</span>
              <span className="font-semibold">{formatCurrency(monthlyTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Home Insurance:</span>
              <span className="font-semibold">{formatCurrency(insurance)}</span>
            </div>
            {hoaFees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">HOA Fees:</span>
                <span className="font-semibold">{formatCurrency(hoaFees)}</span>
              </div>
            )}
            <div className="pt-2 border-t flex justify-between font-bold text-base">
              <span>Total Monthly:</span>
              <span className="text-red-600">{formatCurrency(monthlyPayment)}</span>
            </div>
          </div>

          {/* Loan Summary */}
          <div className="mt-6 pt-6 border-t space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Loan Amount:</span>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Down Payment:</span>
              <span className="font-medium">{formatCurrency(downPaymentAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Interest:</span>
              <span className="font-medium">{formatCurrency((principalInterest * loanTerm * 12) - loanAmount)}</span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            * This calculator provides estimates only. Actual payments may vary. Contact a lender for accurate quotes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

