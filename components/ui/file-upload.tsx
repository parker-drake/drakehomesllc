"use client"

import React, { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'

interface FileUploadProps {
  type: 'image' | 'document'
  onUploadComplete: (url: string, fileName: string) => void
  onUploadError?: (error: string) => void
  accept?: string
  maxSizeMB?: number
  className?: string
  children?: React.ReactNode
}

export function FileUpload({
  type,
  onUploadComplete,
  onUploadError,
  accept,
  maxSizeMB,
  className = '',
  children
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultAccept = type === 'image' 
    ? 'image/jpeg,image/jpg,image/png,image/webp'
    : 'application/pdf,image/jpeg,image/jpg,image/png'

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onUploadComplete(result.url, result.originalName)
      } else {
        onUploadError?.(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  if (children) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div
          onClick={openFilePicker}
          className={`cursor-pointer ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            children
          )}
        </div>
      </>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept || defaultAccept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFilePicker}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <p className="text-sm text-gray-600">Uploading file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {type === 'image' ? (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            ) : (
              <FileText className="w-8 h-8 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {type === 'image' ? 'JPEG, PNG, WebP' : 'PDF, JPEG, PNG'} 
                {maxSizeMB && ` (max ${maxSizeMB}MB)`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface UploadedFileProps {
  fileName: string
  url: string
  type: 'image' | 'document'
  onRemove: () => void
}

export function UploadedFile({ fileName, url, type, onRemove }: UploadedFileProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      {type === 'image' ? (
        <ImageIcon className="w-5 h-5 text-green-600" />
      ) : (
        <FileText className="w-5 h-5 text-blue-600" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-500">Uploaded successfully</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => window.open(url, '_blank')}
        className="shrink-0"
      >
        View
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="shrink-0 text-red-600 hover:bg-red-50"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  )
} 