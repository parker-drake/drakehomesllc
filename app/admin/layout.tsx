"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut, getCurrentUser } from "@/lib/supabase-auth"
import { 
  Home, 
  LayoutDashboard,
  FileText,
  MapPin,
  Image as ImageIcon,
  Users,
  Settings,
  Quote,
  BarChart3,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ClipboardList,
  Plus,
  Eye,
  Building2,
  Printer
} from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Workflow", href: "/admin/workflow", icon: Calendar },
    ]
  },
  {
    title: "Selection Book",
    items: [
      { name: "New Selection", href: "/admin/selection-wizard", icon: Plus },
      { name: "All Selections", href: "/admin/selection-books", icon: ClipboardList },
    ]
  },
  {
    title: "Inventory",
    items: [
      { name: "Properties", href: "/admin/properties", icon: Home },
      { name: "House Plans", href: "/admin/plans", icon: FileText },
      { name: "Available Lots", href: "/admin/lots", icon: MapPin },
    ]
  },
  {
    title: "Content",
    items: [
      { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { name: "Property Flyers", href: "/admin/property-flyers", icon: Printer },
    ]
  },
  {
    title: "Settings",
    items: [
      { name: "Configurator Options", href: "/admin/customization", icon: Settings },
      { name: "Customer Configs", href: "/admin/configurations", icon: Users },
    ]
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Don't show sidebar on login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [isLoginPage])

  const checkAuth = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser()
      if (error || !currentUser) {
        router.push('/admin/login')
      } else {
        setUser(currentUser)
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Show just children for login page
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-red-600" />
            <span className="font-bold text-gray-900">Drake Homes</span>
          </Link>
          <button 
            className="lg:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                          transition-colors duration-150
                          ${isActive 
                            ? 'bg-red-50 text-red-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* View Site Link */}
          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Eye className="w-5 h-5 text-gray-400" />
              View Website
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </Link>
          </div>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-red-700">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            {/* Breadcrumb could go here */}
          </div>

          {/* Quick actions in header */}
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 hidden sm:flex">
              <Link href="/admin/selection-wizard">
                <Plus className="w-4 h-4 mr-1" />
                New Selection
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="hidden sm:flex">
              <Link href="/admin/properties">
                <Home className="w-4 h-4 mr-1" />
                Add Property
              </Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

