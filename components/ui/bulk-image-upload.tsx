"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle, Trash2, Star, StarOff } from 'lucide-react'
import { Badge } from './badge'

interface UploadedImage {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  url?: string
  error?: string
  isMain?: boolean
  altText?: string
}

interface BulkImageUploadProps {
  onUploadComplete: (images: Array<{ url: string; fileName: string; isMain: boolean; altText?: string }>) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  maxSizeMB?: number
  className?: string
  existingImages?: Array<{ url: string; isMain: boolean; altText?: string }>
}

export function BulkImageUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 50,
  maxSizeMB = 5,
  className = '',
  existingImages = []
}: BulkImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `${file.name} is not an image file`
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `${file.name} exceeds ${maxSizeMB}MB`
    }
    return null
  }

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const currentCount = images.length + existingImages.length
    const remainingSlots = maxFiles - currentCount

    if (fileArray.length > remainingSlots) {
      onUploadError?.(`You can only add ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}. Maximum: ${maxFiles} total.`)
      return
    }

    const newImages: UploadedImage[] = []
    const errors: string[] = []

    fileArray.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
        return
      }

      const id = `${Date.now()}-${Math.random()}`
      const preview = URL.createObjectURL(file)
      
      newImages.push({
        id,
        file,
        preview,
        status: 'pending',
        progress: 0,
        isMain: false,
        altText: file.name.replace(/\.[^/.]+$/, '') // Remove extension for initial alt text
      })
    })

    if (errors.length > 0) {
      onUploadError?.(errors.join(', '))
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages])
    }
  }, [images.length, existingImages.length, maxFiles, onUploadError])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image?.preview) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  const toggleMainImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === id ? !img.isMain : false
    })))
  }

  const updateAltText = (id: string, altText: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, altText } : img
    ))
  }

  const uploadSingleImage = async (image: UploadedImage): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'uploading', progress: 0 } : img
        ))

        const formData = new FormData()
        formData.append('file', image.file)
        formData.append('type', 'image')

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setImages(prev => prev.map(img => 
              img.id === image.id ? { ...img, progress } : img
            ))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText)
            setImages(prev => prev.map(img => 
              img.id === image.id 
                ? { ...img, status: 'success', progress: 100, url: result.url } 
                : img
            ))
            resolve()
          } else {
            const error = JSON.parse(xhr.responseText).error || 'Upload failed'
            setImages(prev => prev.map(img => 
              img.id === image.id 
                ? { ...img, status: 'error', error } 
                : img
            ))
            reject(error)
          }
        })

        xhr.addEventListener('error', () => {
          const error = 'Network error during upload'
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'error', error } 
              : img
          ))
          reject(error)
        })

        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Upload failed'
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'error', error: errorMsg } 
            : img
        ))
        reject(errorMsg)
      }
    })
  }

  const uploadAllImages = async () => {
    const pendingImages = images.filter(img => img.status === 'pending')
    
    if (pendingImages.length === 0) {
      onUploadError?.('No images to upload')
      return
    }

    setIsUploading(true)

    // Upload in batches of 5 for better performance
    const batchSize = 5
    const batches = []
    for (let i = 0; i < pendingImages.length; i += batchSize) {
      batches.push(pendingImages.slice(i, i + batchSize))
    }

    try {
      for (const batch of batches) {
        await Promise.all(batch.map(image => uploadSingleImage(image)))
      }

      // Get all successfully uploaded images
      const successfulImages = images
        .filter(img => img.status === 'success' && img.url)
        .map(img => ({
          url: img.url!,
          fileName: img.file.name,
          isMain: img.isMain || false,
          altText: img.altText
        }))

      if (successfulImages.length > 0) {
        onUploadComplete(successfulImages)
        // Clear successfully uploaded images
        setImages(prev => prev.filter(img => img.status !== 'success'))
      }
    } catch (error) {
      onUploadError?.('Some uploads failed. Please retry failed images.')
    } finally {
      setIsUploading(false)
    }
  }

  const retryFailedUploads = async () => {
    const failedImages = images.filter(img => img.status === 'error')
    
    // Reset failed images to pending
    setImages(prev => prev.map(img => 
      img.status === 'error' ? { ...img, status: 'pending', error: undefined } : img
    ))

    // Small delay to allow state to update
    await new Promise(resolve => setTimeout(resolve, 100))
    
    await uploadAllImages()
  }

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
  }

  const pendingCount = images.filter(img => img.status === 'pending').length
  const uploadingCount = images.filter(img => img.status === 'uploading').length
  const successCount = images.filter(img => img.status === 'success').length
  const errorCount = images.filter(img => img.status === 'error').length
  const totalCount = existingImages.length + images.length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive 
            ? 'border-red-500 bg-red-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full ${dragActive ? 'bg-red-100' : 'bg-gray-100'}`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-red-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 mb-1">
              {dragActive ? 'Drop images here' : 'Click or drag images here'}
            </p>
            <p className="text-sm text-gray-500">
              Upload multiple images at once • JPEG, PNG, WebP up to {maxSizeMB}MB each
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {totalCount}/{maxFiles} images • {maxFiles - totalCount} slots remaining
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {images.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-600">
              <strong>{images.length}</strong> selected
            </span>
            {pendingCount > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {pendingCount} pending
              </Badge>
            )}
            {uploadingCount > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {uploadingCount} uploading
              </Badge>
            )}
            {successCount > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {successCount} uploaded
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {errorCount} failed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {errorCount > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={retryFailedUploads}
                disabled={isUploading}
              >
                Retry Failed
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={clearAll}
              disabled={isUploading}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={uploadAllImages}
              disabled={isUploading || pendingCount === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {pendingCount > 0 ? pendingCount : 'All'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isMain 
                  ? 'border-yellow-400 ring-2 ring-yellow-400' 
                  : 'border-gray-200'
              } bg-white`}
            >
              {/* Image Preview */}
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={image.preview}
                  alt={image.altText || 'Preview'}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Overlay */}
                {image.status !== 'pending' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    {image.status === 'uploading' && (
                      <div className="text-center text-white">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p className="text-xs font-medium">{image.progress}%</p>
                      </div>
                    )}
                    {image.status === 'success' && (
                      <div className="bg-green-500 rounded-full p-2">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {image.status === 'error' && (
                      <div className="text-center text-white">
                        <AlertCircle className="w-8 h-8 mx-auto mb-1" />
                        <p className="text-xs px-2">{image.error}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Progress Bar */}
                {image.status === 'uploading' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Controls */}
              {image.status === 'pending' && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMainImage(image.id)
                    }}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors"
                    title="Set as main image"
                  >
                    {image.isMain ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                    }}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}

              {/* Main Image Badge */}
              {image.isMain && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
                    Main
                  </Badge>
                </div>
              )}

              {/* File Name */}
              <div className="p-2 bg-white">
                <p className="text-xs text-gray-600 truncate" title={image.file.name}>
                  {image.file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(image.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {images.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            💡 Pro tip: Select multiple images at once or drag & drop a folder
          </p>
        </div>
      )}
    </div>
  )
}

