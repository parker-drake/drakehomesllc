"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ArrowRight,
  Save,
  FileText,
  User,
  Home,
  CheckCircle,
  Circle,
  Plus,
  Printer,
  Download,
  List,
  Loader2
} from "lucide-react"

// Types for the Selection Book
interface SelectionOption {
  id: string
  label: string
  value: string
  checked: boolean
  textValue?: string
  price?: number
  isUpgrade?: boolean
}

interface SelectionGroup {
  id: string
  title: string
  type: 'radio' | 'checkbox' | 'text' | 'checkbox-text' | 'radio-text'
  options: SelectionOption[]
  textLabel?: string
  textValue?: string
}

interface SelectionCategory {
  id: string
  name: string
  section: 'EXTERIOR' | 'INTERIOR'
  groups: SelectionGroup[]
  upgrades?: SelectionGroup[]
  notes?: string
}

interface CustomerInfo {
  date: string
  customerName: string
  phoneNumber: string
  email: string
  jobAddress: string
  housePlan: string
}

interface Plan {
  id: string
  title: string
  style: string
}

// Default Selection Book Structure
const defaultCategories: SelectionCategory[] = [
  // EXTERIOR SELECTIONS
  {
    id: 'windows',
    name: 'Windows',
    section: 'EXTERIOR',
    groups: [
      {
        id: 'window-type',
        title: 'Type',
        type: 'radio',
        options: [
          { id: 'sh', label: 'SH', value: 'SH', checked: false },
          { id: 'dh', label: 'DH', value: 'DH', checked: false },
          { id: 'casement', label: 'Casement', value: 'Casement', checked: false },
        ]
      },
      {
        id: 'interior-jamb',
        title: 'Interior jamb',
        type: 'radio',
        options: [
          { id: 'maple', label: 'Maple', value: 'Maple', checked: true },
          { id: 'primed', label: 'Primed', value: 'Primed', checked: false },
          { id: 'plaster-returns', label: 'Plaster returns', value: 'Plaster returns', checked: false },
        ]
      },
      {
        id: 'interior-color',
        title: 'Interior color',
        type: 'radio-text',
        options: [
          { id: 'int-white', label: 'White', value: 'White', checked: true },
        ],
        textLabel: 'Other',
        textValue: ''
      },
      {
        id: 'exterior-color',
        title: 'Exterior color',
        type: 'radio-text',
        options: [
          { id: 'ext-white', label: 'White', value: 'White', checked: true },
        ],
        textLabel: 'Other',
        textValue: ''
      },
      {
        id: 'grilles',
        title: 'Grilles',
        type: 'radio',
        options: [
          { id: 'none', label: 'None', value: 'None', checked: true },
          { id: 'front-windows', label: 'Front windows', value: 'Front windows', checked: false },
          { id: 'all-windows', label: 'All windows', value: 'All windows', checked: false },
        ]
      },
      {
        id: 'grille-option',
        title: 'Grille option #',
        type: 'text',
        options: [],
        textValue: ''
      },
    ],
    notes: ''
  },
  {
    id: 'roofing',
    name: 'Roofing',
    section: 'EXTERIOR',
    groups: [
      {
        id: 'shingle-color',
        title: 'Shingle color',
        type: 'text',
        options: [],
        textValue: ''
      },
      {
        id: 'soffit-fascia-gutters',
        title: 'Soffit, fascia, & gutters color',
        type: 'radio',
        options: [
          { id: 'sfg-white', label: 'White', value: 'White', checked: true },
          { id: 'sfg-black', label: 'Black', value: 'Black', checked: false },
        ]
      },
    ]
  },
  {
    id: 'siding',
    name: 'Siding',
    section: 'EXTERIOR',
    groups: [
      {
        id: 'siding-brand',
        title: 'Brand',
        type: 'text',
        options: [],
        textValue: ''
      },
      {
        id: 'siding-color',
        title: 'Color',
        type: 'checkbox-text',
        options: [
          { id: 'deluxe-color', label: 'Deluxe color', value: 'Deluxe color', checked: false },
        ],
        textValue: ''
      },
      {
        id: 'corner-color',
        title: 'Corner color',
        type: 'radio',
        options: [
          { id: 'corner-white', label: 'White', value: 'White', checked: true },
          { id: 'corner-matching', label: 'Matching', value: 'Matching', checked: false },
        ]
      },
      {
        id: 'secondary-siding',
        title: 'Secondary siding',
        type: 'radio',
        options: [
          { id: 'board-batton', label: 'Board & Batton', value: 'Board & Batton', checked: false },
          { id: 'shake', label: 'Shake', value: 'Shake', checked: false },
        ]
      },
      {
        id: 'secondary-location',
        title: 'Location',
        type: 'text',
        options: [],
        textValue: ''
      },
      {
        id: 'stone',
        title: 'Stone',
        type: 'checkbox',
        options: [
          { id: 'stone-option', label: 'Stone 1/3 height of main garage, front bedroom', value: 'Stone 1/3 height', checked: false },
        ]
      },
    ],
    upgrades: [
      {
        id: 'siding-upgrades',
        title: 'Upgrades',
        type: 'checkbox-text',
        options: [
          { id: 'linneals', label: 'Linneals', value: 'Linneals', checked: false, isUpgrade: true },
          { id: 'shutters', label: 'Shutters', value: 'Shutters', checked: false, isUpgrade: true },
          { id: 'extra-secondary', label: 'Extra secondary siding', value: 'Extra secondary siding', checked: false, isUpgrade: true },
          { id: 'extra-stone', label: 'Extra stone', value: 'Extra stone', checked: false, isUpgrade: true },
        ]
      }
    ]
  },
  {
    id: 'garage-doors',
    name: 'Garage Doors',
    section: 'EXTERIOR',
    groups: [
      {
        id: 'door-type',
        title: 'Door type',
        type: 'radio',
        options: [
          { id: 'colonial', label: 'Colonial', value: 'Colonial', checked: false },
          { id: 'ranch', label: 'Ranch', value: 'Ranch', checked: false },
          { id: 'sonoma', label: 'Sonoma', value: 'Sonoma', checked: false },
          { id: 'sonoma-ranch', label: 'Sonoma Ranch', value: 'Sonoma Ranch', checked: false },
          { id: 'contemporary', label: 'Contemporary', value: 'Contemporary', checked: false },
        ]
      },
      {
        id: 'door-color',
        title: 'Door color',
        type: 'radio-text',
        options: [
          { id: 'gd-white', label: 'White', value: 'White', checked: true },
          { id: 'gd-black', label: 'Black', value: 'Black', checked: false },
        ],
        textValue: ''
      },
      {
        id: 'clad-frame-color',
        title: 'Clad frame color',
        type: 'radio-text',
        options: [
          { id: 'cf-white', label: 'White', value: 'White', checked: true },
          { id: 'cf-black', label: 'Black', value: 'Black', checked: false },
        ],
        textValue: ''
      },
    ],
    upgrades: [
      {
        id: 'garage-door-upgrades',
        title: 'Upgrades',
        type: 'checkbox',
        options: [
          { id: 'gd-windows', label: 'Windows ($175 per window)', value: 'Windows', checked: false, price: 175, isUpgrade: true },
        ]
      }
    ]
  },
  {
    id: 'garage-interior',
    name: 'Garage Interior',
    section: 'EXTERIOR',
    groups: [
      {
        id: 'garage-interior-options',
        title: 'Options',
        type: 'checkbox',
        options: [
          { id: 'sheetrock-fire', label: 'Sheetrock on fire wall', value: 'Sheetrock on fire wall', checked: false },
          { id: 'floor-drain', label: 'Floor drain', value: 'Floor drain', checked: false },
        ]
      },
    ],
    upgrades: [
      {
        id: 'garage-interior-upgrades',
        title: 'Upgrades',
        type: 'checkbox',
        options: [
          { id: 'insulate-rock', label: 'Insulate and rock all walls', value: 'Insulate and rock all walls', checked: false, isUpgrade: true },
          { id: 'plaster', label: 'Plaster', value: 'Plaster', checked: false, isUpgrade: true },
          { id: 'paint', label: 'Paint', value: 'Paint', checked: false, isUpgrade: true },
        ]
      }
    ]
  },
  {
    id: 'exterior-doors',
    name: 'Exterior Doors',
    section: 'EXTERIOR',
    groups: [
      {
        id: 'front-door',
        title: 'Front door',
        type: 'radio',
        options: [
          { id: 'fd-1', label: 'Style 1', value: 'Style 1', checked: false },
          { id: 'fd-2', label: 'Style 2', value: 'Style 2', checked: false },
          { id: 'fd-3', label: 'Style 3', value: 'Style 3', checked: false },
          { id: 'fd-4', label: 'Style 4', value: 'Style 4', checked: false },
          { id: 'fd-5', label: 'Style 5', value: 'Style 5', checked: false },
        ]
      },
      {
        id: 'fire-door',
        title: 'Fire door',
        type: 'radio',
        options: [
          { id: 'fire-1', label: 'Style 1', value: 'Style 1', checked: false },
          { id: 'fire-2', label: 'Style 2', value: 'Style 2', checked: false },
          { id: 'fire-3', label: 'Style 3', value: 'Style 3', checked: false },
        ]
      },
      {
        id: 'service-door',
        title: 'Service door',
        type: 'radio',
        options: [
          { id: 'serv-1', label: 'Style 1', value: 'Style 1', checked: false },
          { id: 'serv-2', label: 'Style 2', value: 'Style 2', checked: false },
          { id: 'serv-3', label: 'Style 3', value: 'Style 3', checked: false },
        ]
      },
      {
        id: 'hardware-color',
        title: 'Hardware color',
        type: 'radio',
        options: [
          { id: 'hw-brushed', label: 'Brushed nickel', value: 'Brushed nickel', checked: true },
          { id: 'hw-matte', label: 'Matte black', value: 'Matte black', checked: false },
        ]
      },
      {
        id: 'manufacturer',
        title: 'Manufacturer',
        type: 'radio',
        options: [
          { id: 'drexel', label: 'Drexel', value: 'Drexel', checked: false },
          { id: 'thermatru', label: 'ThermaTru', value: 'ThermaTru', checked: false },
        ]
      },
      {
        id: 'door-interior-color',
        title: 'Interior color',
        type: 'text',
        options: [],
        textValue: ''
      },
      {
        id: 'door-exterior-color',
        title: 'Exterior color',
        type: 'text',
        options: [],
        textValue: ''
      },
    ]
  },
  // INTERIOR SELECTIONS
  {
    id: 'interior-doors-trim',
    name: 'Interior Doors & Trim',
    section: 'INTERIOR',
    groups: [
      {
        id: 'door-finish',
        title: 'Finish type',
        type: 'radio',
        options: [
          { id: 'stained', label: 'Stained doors & trim', value: 'Stained doors & trim', checked: false },
        ]
      },
      {
        id: 'stained-door-option',
        title: 'Stained door option',
        type: 'radio',
        options: [
          { id: '2-panels-4102', label: '2-panels 4102', value: '2-panels 4102', checked: false },
          { id: '3-panels-4103T', label: '3-panels 4103T', value: '3-panels 4103T', checked: false },
          { id: '3-equal-4103', label: '3-equal panels 4103', value: '3-equal panels 4103', checked: false },
        ]
      },
      {
        id: 'stain-color',
        title: 'Stain color',
        type: 'text',
        options: [],
        textValue: ''
      },
      {
        id: 'int-hardware-color',
        title: 'Hardware color',
        type: 'radio',
        options: [
          { id: 'int-hw-brushed', label: 'Brushed nickel', value: 'Brushed nickel', checked: true },
          { id: 'int-hw-matte', label: 'Matte black', value: 'Matte black', checked: false },
        ]
      },
      {
        id: 'hardware-style',
        title: 'Hardware style',
        type: 'radio',
        options: [
          { id: 'latitude', label: 'Latitude', value: 'Latitude', checked: true },
          { id: 'accent', label: 'Accent', value: 'Accent', checked: false },
        ]
      },
      {
        id: 'wall-paint-color',
        title: 'Wall paint color',
        type: 'text',
        options: [],
        textValue: ''
      },
    ],
    upgrades: [
      {
        id: 'door-upgrades',
        title: 'Upgrades',
        type: 'radio',
        options: [
          { id: 'painted-doors', label: 'Painted doors and trim', value: 'Painted doors and trim', checked: false, isUpgrade: true },
        ]
      },
      {
        id: 'painted-door-option',
        title: 'Painted door option',
        type: 'radio',
        options: [
          { id: '1-panel-7910', label: '1-panel 7910', value: '1-panel 7910', checked: false },
          { id: '2-panels-7920', label: '2-panels 7920', value: '2-panels 7920', checked: false },
          { id: '3-equal-793H', label: '3-equal panels 793H', value: '3-equal panels 793H', checked: false },
          { id: '3-panels-793E', label: '3-panels 793E', value: '3-panels 793E', checked: false },
          { id: '5-panels-795H', label: '5-panels 795H', value: '5-panels 795H', checked: false },
        ]
      },
      {
        id: 'paint-color',
        title: 'Paint color',
        type: 'text',
        options: [],
        textValue: ''
      }
    ]
  },
  {
    id: 'stair-case',
    name: 'Stair Case',
    section: 'INTERIOR',
    groups: [
      {
        id: 'stair-type',
        title: 'Type',
        type: 'radio',
        options: [
          { id: 'half-wall', label: 'Half wall', value: 'Half wall', checked: true },
          { id: 'welded', label: 'Welded', value: 'Welded', checked: false },
          { id: 'spindle-newel', label: 'Spindle & newel', value: 'Spindle & newel', checked: false },
        ]
      },
      {
        id: 'handrail-options',
        title: 'Handrail options',
        type: 'radio',
        options: [
          { id: 'lj-6002', label: 'LJ-6002', value: 'LJ-6002', checked: true },
          { id: 'lj-6210', label: 'LJ-6210', value: 'LJ-6210', checked: false },
        ]
      },
      {
        id: 'spindle-options',
        title: 'Spindle options',
        type: 'radio',
        options: [
          { id: 'metal-no-twist', label: 'Metal no twist', value: 'Metal no twist', checked: false },
          { id: 'metal-one-twist', label: 'Metal one twist', value: 'Metal one twist', checked: false },
          { id: 'metal-two-twist', label: 'Metal two twist', value: 'Metal two twist', checked: false },
          { id: 'square-wood', label: 'Square wood', value: 'Square wood', checked: false },
        ]
      },
      {
        id: 'newel-options',
        title: 'Newel options',
        type: 'radio',
        options: [
          { id: 'lj-4000', label: 'LJ-4000', value: 'LJ-4000', checked: false },
          { id: 'lj-4101G', label: 'LJ-4101G', value: 'LJ-4101G', checked: false },
          { id: 'lj-4075-50', label: 'LJ-4075-50', value: 'LJ-4075-50', checked: false },
        ]
      },
    ]
  },
  {
    id: 'countertops',
    name: 'Countertops',
    section: 'INTERIOR',
    groups: [
      {
        id: 'laminate-countertops',
        title: 'Laminate countertops',
        type: 'checkbox-text',
        options: [
          { id: 'lam-kitchen', label: 'Kitchen', value: 'Kitchen', checked: false, textValue: '' },
          { id: 'lam-bathrooms', label: 'Bathrooms', value: 'Bathrooms', checked: false, textValue: '' },
          { id: 'lam-bench', label: 'Bench', value: 'Bench', checked: false, textValue: '' },
          { id: 'lam-laundry', label: 'Laundry', value: 'Laundry', checked: false, textValue: '' },
        ]
      },
      {
        id: 'backsplash',
        title: 'Backsplash',
        type: 'radio',
        options: [
          { id: 'bs-4inch', label: '4" countertop ledge', value: '4" countertop ledge', checked: false },
          { id: 'bs-tile', label: 'Tile', value: 'Tile', checked: false },
          { id: 'bs-hard', label: 'Hard surface', value: 'Hard surface', checked: false },
        ]
      },
      {
        id: 'backsplash-locations',
        title: 'Backsplash locations',
        type: 'text',
        options: [],
        textValue: ''
      },
    ],
    upgrades: [
      {
        id: 'hard-surface-countertops',
        title: 'Hard surface countertops',
        type: 'checkbox-text',
        options: [
          { id: 'hs-kitchen', label: 'Kitchen', value: 'Kitchen', checked: false, textValue: '', isUpgrade: true },
          { id: 'hs-bathrooms', label: 'Bathrooms', value: 'Bathrooms', checked: false, textValue: '', isUpgrade: true },
          { id: 'hs-bench', label: 'Bench', value: 'Bench', checked: false, textValue: '', isUpgrade: true },
          { id: 'hs-laundry', label: 'Laundry', value: 'Laundry', checked: false, textValue: '', isUpgrade: true },
        ]
      }
    ]
  },
  {
    id: 'flooring',
    name: 'Flooring',
    section: 'INTERIOR',
    groups: [
      {
        id: 'flooring-type',
        title: 'Flooring type',
        type: 'checkbox-text',
        options: [
          { id: 'lvp', label: 'LVP', value: 'LVP', checked: false, textValue: '' },
          { id: 'lvt', label: 'LVT', value: 'LVT', checked: false, textValue: '' },
          { id: 'carpet', label: 'Carpet', value: 'Carpet', checked: false, textValue: '' },
        ]
      },
      {
        id: 'grout',
        title: 'Grout',
        type: 'checkbox-text',
        options: [
          { id: 'grout-option', label: 'Grout', value: 'Grout', checked: false, textValue: '' },
        ]
      },
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    section: 'INTERIOR',
    groups: [
      {
        id: 'fixture-color',
        title: 'Fixture color',
        type: 'radio',
        options: [
          { id: 'fix-brushed', label: 'Brushed nickel', value: 'Brushed nickel', checked: true },
          { id: 'fix-black', label: 'Black', value: 'Black', checked: false },
        ]
      },
      {
        id: 'bathroom-sink',
        title: 'Bathroom sink',
        type: 'radio',
        options: [
          { id: 'overmount', label: 'Overmount', value: 'Overmount', checked: false },
          { id: 'undermount', label: 'Undermount', value: 'Undermount', checked: false },
        ]
      },
      {
        id: 'bathroom-sink-shape',
        title: 'Bathroom sink shape',
        type: 'radio',
        options: [
          { id: 'oval', label: 'Oval', value: 'Oval', checked: false },
          { id: 'rectangle', label: 'Rectangle', value: 'Rectangle', checked: false },
        ]
      },
      {
        id: 'kitchen-sink',
        title: 'Kitchen sink',
        type: 'radio-text',
        options: [
          { id: 'black-composite', label: 'Black composite', value: 'Black composite', checked: false },
        ],
        textValue: ''
      },
      {
        id: 'toilets',
        title: 'Toilets',
        type: 'checkbox',
        options: [
          { id: 'elongated', label: 'Elongated', value: 'Elongated', checked: false },
          { id: 'comfort-height', label: 'Comfort height', value: 'Comfort height', checked: false },
        ]
      },
      {
        id: 'water-heater',
        title: 'Water heater',
        type: 'radio',
        options: [
          { id: 'electric', label: 'Electric', value: 'Electric', checked: false },
          { id: 'gas', label: 'Gas', value: 'Gas', checked: false },
          { id: 'tankless', label: 'Tankless', value: 'Tankless', checked: false },
        ]
      },
    ],
    upgrades: [
      {
        id: 'plumbing-upgrades',
        title: 'Upgrades',
        type: 'checkbox',
        options: [
          { id: 'tile-shower', label: 'Tile shower', value: 'Tile shower', checked: false, isUpgrade: true },
          { id: 'water-softner', label: 'Water softner', value: 'Water softner', checked: false, isUpgrade: true },
          { id: 'floor-drains', label: 'Floor drains', value: 'Floor drains', checked: false, isUpgrade: true },
        ]
      }
    ]
  },
]

function SelectionWizardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get('id')
  
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectionBookId, setSelectionBookId] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    phoneNumber: '',
    email: '',
    jobAddress: '',
    housePlan: ''
  })
  const [categories, setCategories] = useState<SelectionCategory[]>(defaultCategories)
  const [generalNotes, setGeneralNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  useEffect(() => {
    if (editId) {
      loadSelectionBook(editId)
    }
  }, [editId])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      if (!editId) setLoading(false)
    }
  }

  const loadSelectionBook = async (id: string) => {
    try {
      const response = await fetch(`/api/selection-books/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectionBookId(data.id)
        setCustomerInfo({
          date: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          customerName: data.customer_name || '',
          phoneNumber: data.customer_phone || '',
          email: data.customer_email || '',
          jobAddress: data.job_address || '',
          housePlan: data.house_plan_id || ''
        })
        setGeneralNotes(data.notes || '')
        
        // Restore selections if they exist
        if (data.selections && typeof data.selections === 'object') {
          setCategories(prev => {
            // Merge saved selections with default structure
            return prev.map(cat => {
              const savedCat = data.selections[cat.id]
              if (!savedCat) return cat
              
              return {
                ...cat,
                groups: cat.groups.map(group => {
                  const savedGroup = savedCat.groups?.find((g: any) => g.id === group.id)
                  if (!savedGroup) return group
                  
                  return {
                    ...group,
                    textValue: savedGroup.textValue || group.textValue,
                    options: group.options.map(opt => {
                      const savedOpt = savedGroup.options?.find((o: any) => o.id === opt.id)
                      if (!savedOpt) return opt
                      return { ...opt, checked: savedOpt.checked, textValue: savedOpt.textValue }
                    })
                  }
                }),
                upgrades: cat.upgrades?.map(group => {
                  const savedGroup = savedCat.upgrades?.find((g: any) => g.id === group.id)
                  if (!savedGroup) return group
                  
                  return {
                    ...group,
                    options: group.options.map(opt => {
                      const savedOpt = savedGroup.options?.find((o: any) => o.id === opt.id)
                      if (!savedOpt) return opt
                      return { ...opt, checked: savedOpt.checked, textValue: savedOpt.textValue }
                    })
                  }
                })
              }
            })
          })
        }
      }
    } catch (error) {
      console.error('Error loading selection book:', error)
    } finally {
      setLoading(false)
    }
  }

  const exteriorCategories = categories.filter(c => c.section === 'EXTERIOR')
  const interiorCategories = categories.filter(c => c.section === 'INTERIOR')

  // Steps: Customer Info -> Exterior Categories -> Interior Categories -> Notes & Review
  const allSteps = [
    { id: 'customer-info', name: 'Customer Info', type: 'info' },
    ...exteriorCategories.map(c => ({ id: c.id, name: c.name, type: 'category', section: 'EXTERIOR' })),
    ...interiorCategories.map(c => ({ id: c.id, name: c.name, type: 'category', section: 'INTERIOR' })),
    { id: 'notes-review', name: 'Notes & Review', type: 'review' }
  ]

  const currentStepData = allSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === allSteps.length - 1

  const handleOptionChange = (categoryId: string, groupId: string, optionId: string, value: boolean) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat
      
      return {
        ...cat,
        groups: cat.groups.map(group => {
          if (group.id !== groupId) return group
          
          if (group.type === 'radio' || group.type === 'radio-text') {
            // For radio, only one can be selected
            return {
              ...group,
              options: group.options.map(opt => ({
                ...opt,
                checked: opt.id === optionId ? value : false
              }))
            }
          } else {
            // For checkbox, toggle the specific option
            return {
              ...group,
              options: group.options.map(opt => 
                opt.id === optionId ? { ...opt, checked: value } : opt
              )
            }
          }
        }),
        upgrades: cat.upgrades?.map(group => {
          if (group.id !== groupId) return group
          
          if (group.type === 'radio' || group.type === 'radio-text') {
            return {
              ...group,
              options: group.options.map(opt => ({
                ...opt,
                checked: opt.id === optionId ? value : false
              }))
            }
          } else {
            return {
              ...group,
              options: group.options.map(opt => 
                opt.id === optionId ? { ...opt, checked: value } : opt
              )
            }
          }
        })
      }
    }))
  }

  const handleTextChange = (categoryId: string, groupId: string, optionId: string | null, value: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat
      
      const updateGroup = (group: SelectionGroup) => {
        if (group.id !== groupId) return group
        
        if (optionId) {
          // Update specific option's text value
          return {
            ...group,
            options: group.options.map(opt =>
              opt.id === optionId ? { ...opt, textValue: value } : opt
            )
          }
        } else {
          // Update group's text value
          return { ...group, textValue: value }
        }
      }
      
      return {
        ...cat,
        groups: cat.groups.map(updateGroup),
        upgrades: cat.upgrades?.map(updateGroup)
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Build selections object keyed by category ID
      const selectionsObject: any = {}
      categories.forEach(cat => {
        selectionsObject[cat.id] = {
          name: cat.name,
          section: cat.section,
          groups: cat.groups.map(group => ({
            id: group.id,
            title: group.title,
            textValue: group.textValue,
            options: group.options.map(opt => ({
              id: opt.id,
              label: opt.label,
              checked: opt.checked,
              textValue: opt.textValue,
              price: opt.price,
              isUpgrade: opt.isUpgrade
            }))
          })),
          upgrades: cat.upgrades?.map(group => ({
            id: group.id,
            title: group.title,
            options: group.options.map(opt => ({
              id: opt.id,
              label: opt.label,
              checked: opt.checked,
              textValue: opt.textValue,
              price: opt.price,
              isUpgrade: opt.isUpgrade
            }))
          }))
        }
      })

      // Calculate total upgrades price
      let totalUpgradesPrice = 0
      categories.forEach(cat => {
        cat.upgrades?.forEach(group => {
          group.options.forEach(opt => {
            if (opt.checked && opt.price) {
              totalUpgradesPrice += opt.price
            }
          })
        })
      })

      const selectedPlan = plans.find(p => p.id === customerInfo.housePlan)
      
      const payload = {
        customer_name: customerInfo.customerName,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phoneNumber,
        job_address: customerInfo.jobAddress,
        house_plan: selectedPlan?.title || '',
        house_plan_id: customerInfo.housePlan || null,
        selections: selectionsObject,
        notes: generalNotes,
        total_upgrades_price: totalUpgradesPrice,
        created_by: 'admin'
      }

      let response
      if (selectionBookId) {
        // Update existing
        response = await fetch(`/api/selection-books/${selectionBookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        // Create new
        response = await fetch('/api/selection-books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        const data = await response.json()
        if (!selectionBookId && data.selectionBook?.id) {
          setSelectionBookId(data.selectionBook.id)
          // Update URL without reload
          window.history.replaceState({}, '', `/admin/selection-wizard?id=${data.selectionBook.id}`)
        }
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving selection book')
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    // Open print dialog which can be saved as PDF
    window.print()
  }

  const renderCustomerInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <Input
            type="date"
            value={customerInfo.date}
            onChange={(e) => setCustomerInfo({ ...customerInfo, date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <Input
            type="text"
            value={customerInfo.customerName}
            onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <Input
            type="tel"
            value={customerInfo.phoneNumber}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
            placeholder="(920) 555-1234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            placeholder="customer@email.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Address</label>
          <Input
            type="text"
            value={customerInfo.jobAddress}
            onChange={(e) => setCustomerInfo({ ...customerInfo, jobAddress: e.target.value })}
            placeholder="123 Main St, City, WI"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">House Plan</label>
          <select
            value={customerInfo.housePlan}
            onChange={(e) => setCustomerInfo({ ...customerInfo, housePlan: e.target.value })}
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-red-600"
          >
            <option value="">Select a plan...</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.title} ({plan.style})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  const renderSelectionGroup = (categoryId: string, group: SelectionGroup, isUpgrade: boolean = false) => (
    <div key={group.id} className={`p-4 rounded-lg ${isUpgrade ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        {group.title}
        {isUpgrade && <Badge className="ml-2 bg-amber-500 text-white text-xs">Upgrade</Badge>}
      </h4>
      
      <div className="space-y-2">
        {group.options.map(option => (
          <div key={option.id} className="flex items-center gap-3">
            {group.type === 'radio' || group.type === 'radio-text' ? (
              <input
                type="radio"
                id={option.id}
                name={`${categoryId}-${group.id}`}
                checked={option.checked}
                onChange={(e) => handleOptionChange(categoryId, group.id, option.id, e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
            ) : (
              <input
                type="checkbox"
                id={option.id}
                checked={option.checked}
                onChange={(e) => handleOptionChange(categoryId, group.id, option.id, e.target.checked)}
                className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
              />
            )}
            <label htmlFor={option.id} className="text-sm text-gray-700 flex-1">
              {option.label}
              {option.price && option.price > 0 && (
                <span className="text-amber-600 ml-2">(${option.price})</span>
              )}
            </label>
            
            {/* Text input for checkbox-text type */}
            {(group.type === 'checkbox-text' && option.checked) && (
              <Input
                type="text"
                value={option.textValue || ''}
                onChange={(e) => handleTextChange(categoryId, group.id, option.id, e.target.value)}
                placeholder="Specify..."
                className="w-48"
              />
            )}
          </div>
        ))}
        
        {/* Text input for radio-text or standalone text */}
        {(group.type === 'radio-text' || group.type === 'text') && (
          <div className="mt-2">
            <Input
              type="text"
              value={group.textValue || ''}
              onChange={(e) => handleTextChange(categoryId, group.id, null, e.target.value)}
              placeholder={group.textLabel || 'Enter value...'}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderCategoryStep = (category: SelectionCategory) => (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-xs">
          {category.section} SELECTIONS
        </Badge>
      </div>

      {/* Main selection groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.groups.map(group => renderSelectionGroup(category.id, group, false))}
      </div>

      {/* Upgrades section */}
      {category.upgrades && category.upgrades.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Upgrades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.upgrades.map(group => renderSelectionGroup(category.id, group, true))}
          </div>
        </div>
      )}
    </div>
  )

  const renderReviewStep = () => {
    // Compile all selections for review
    const allSelections = categories.flatMap(cat => {
      const catSelections: { category: string; items: string[] }[] = []
      let items: string[] = []
      
      cat.groups.forEach(group => {
        group.options.forEach(opt => {
          if (opt.checked) {
            items.push(`${group.title}: ${opt.label}${opt.textValue ? ` (${opt.textValue})` : ''}`)
          }
        })
        if (group.textValue) {
          items.push(`${group.title}: ${group.textValue}`)
        }
      })
      
      cat.upgrades?.forEach(group => {
        group.options.forEach(opt => {
          if (opt.checked) {
            items.push(`[UPGRADE] ${group.title}: ${opt.label}${opt.price ? ` ($${opt.price})` : ''}`)
          }
        })
      })
      
      if (items.length > 0) {
        catSelections.push({ category: cat.name, items })
      }
      
      return catSelections
    })

    return (
      <div className="space-y-6">
        {/* Customer Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Name:</span> {customerInfo.customerName}</div>
              <div><span className="text-gray-500">Phone:</span> {customerInfo.phoneNumber}</div>
              <div><span className="text-gray-500">Email:</span> {customerInfo.email}</div>
              <div><span className="text-gray-500">Address:</span> {customerInfo.jobAddress}</div>
              <div className="col-span-2">
                <span className="text-gray-500">Plan:</span> {plans.find(p => p.id === customerInfo.housePlan)?.title || 'Not selected'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selections Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Selections Summary</h3>
          {allSelections.map((section, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">{section.category}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {section.items.map((item, i) => (
                    <li key={i} className={item.includes('[UPGRADE]') ? 'text-amber-700' : ''}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* General Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">General Notes</label>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="Any additional notes, special requests, or comments..."
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const currentCategory = categories.find(c => c.id === currentStepData?.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectionBookId ? 'Edit Selection Book' : 'New Selection Book'}
          </h1>
          <p className="text-gray-600">Complete home customization selections</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/selection-books">
            <List className="w-4 h-4 mr-2" />
            View All
          </Link>
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {allSteps.length}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {currentStepData?.name}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / allSteps.length) * 100}%` }}
          />
        </div>
        
        {/* Section indicator */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {allSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                idx === currentStep 
                  ? 'bg-red-600 text-white' 
                  : idx < currentStep
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            {currentStepData?.type === 'info' && <User className="w-5 h-5 mr-2" />}
            {currentStepData?.type === 'category' && <Home className="w-5 h-5 mr-2" />}
            {currentStepData?.type === 'review' && <FileText className="w-5 h-5 mr-2" />}
            {currentStepData?.name}
          </h2>

          {currentStepData?.type === 'info' && renderCustomerInfoStep()}
          {currentStepData?.type === 'category' && currentCategory && renderCategoryStep(currentCategory)}
          {currentStepData?.type === 'review' && renderReviewStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={isFirstStep}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {isLastStep && (
            <>
              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Selection Book
                  </>
                )}
              </Button>
            </>
          )}
          
          {!isLastStep && (
            <Button
              onClick={() => setCurrentStep(prev => Math.min(allSteps.length - 1, prev + 1))}
              className="bg-red-600 hover:bg-red-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Saved indicator */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Selection Book Saved!
        </div>
      )}
    </div>
  )
}

// Wrapper component with Suspense for useSearchParams
export default function SelectionWizardPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Selection Wizard...</p>
        </div>
      </div>
    }>
      <SelectionWizardContent />
    </Suspense>
  )
}

