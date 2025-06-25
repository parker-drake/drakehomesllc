"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  value: "",
  onValueChange: () => {},
  open: false,
  onOpenChange: () => {},
})

export interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, onValueChange, defaultValue }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [open, setOpen] = React.useState(false)
    
    const currentValue = value !== undefined ? value : internalValue
    const handleValueChange = onValueChange || setInternalValue

    return (
      <SelectContext.Provider value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        onOpenChange: setOpen,
      }}>
        <div ref={ref} className="relative">
          {children}
        </div>
      </SelectContext.Provider>
    )
  }
)
Select.displayName = "Select"

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SelectContext)
    
    return (
      <button
        ref={ref}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        onClick={() => onOpenChange(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

export interface SelectValueProps {
  placeholder?: string
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder }, ref) => {
    const { value } = React.useContext(SelectContext)
    
    return (
      <span ref={ref}>
        {value || placeholder}
      </span>
    )
  }
)
SelectValue.displayName = "SelectValue"

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = React.useContext(SelectContext)
    
    if (!open) return null
    
    return (
      <div
        ref={ref}
        className={`absolute top-full left-0 z-50 w-full mt-1 bg-popover border rounded-md shadow-md ${className || ""}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { onValueChange, onOpenChange } = React.useContext(SelectContext)
    
    return (
      <div
        ref={ref}
        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className || ""}`}
        onClick={() => {
          onValueChange(value)
          onOpenChange(false)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } 