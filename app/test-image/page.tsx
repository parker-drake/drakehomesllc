import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Page',
  robots: 'noindex, nofollow',
}

export default function TestImagePage() {
  return (
    <div className="min-h-screen p-8">
      <h1>Test Page - Not for public viewing</h1>
    </div>
  )
}
