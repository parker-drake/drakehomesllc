"use client"

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string
  aspectRatio?: number
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  fallback = "/placeholder.svg",
  aspectRatio,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {aspectRatio && (
        <div style={{ paddingBottom: `${100 / aspectRatio}%` }} />
      )}
      <Image
        src={hasError ? fallback : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          aspectRatio && "absolute inset-0 w-full h-full object-cover"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
} 