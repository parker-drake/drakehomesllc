"use client"

import Image from 'next/image'

export default function TestImagePage() {
  const testImageUrl = "https://fxaowczkvopxnwbkthtv.supabase.co/storage/v1/object/public/property-images/775b6e32-92ea-494e-bef6-cf56a58c430b.jpg"
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Next.js Image Component:</h2>
          <div className="border p-4">
            <Image 
              src={testImageUrl}
              alt="Test property image"
              width={400}
              height={300}
              className="object-cover"
              onError={(e) => console.error('Next Image error:', e)}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Standard img tag:</h2>
          <div className="border p-4">
            <img 
              src={testImageUrl}
              alt="Test property image"
              className="w-[400px] h-[300px] object-cover"
              onError={(e) => console.error('Standard img error:', e)}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Image URL:</h2>
          <div className="border p-4 break-all">
            <a href={testImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {testImageUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
