import Script from 'next/script'

interface JsonLdProps {
  data: object
  id?: string
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <Script
      id={id || 'json-ld'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  )
}
