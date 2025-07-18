import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#DC2626',
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  headerText: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 10,
    color: '#6B7280',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
    textAlign: 'center',
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  propertyCard: {
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  propertyCard3: {
    width: '31%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
  },
  propertyImageSmall: {
    width: '100%',
    height: 100,
    objectFit: 'cover',
  },
  propertyDetails: {
    padding: 8,
  },
  propertyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
  },
  propertyLocation: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 3,
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 4,
  },
  propertySpecs: {
    flexDirection: 'row',
    gap: 8,
  },
  spec: {
    fontSize: 8,
    color: '#374151',
  },
  propertyStatus: {
    fontSize: 8,
    color: '#FFFFFF',
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  contactItem: {
    fontSize: 10,
    color: '#374151',
  },
  contactBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  website: {
    fontSize: 10,
    color: '#DC2626',
    textDecoration: 'none',
  },
  disclaimer: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 5,
    textAlign: 'center',
  },
  noImageBox: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageBoxSmall: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
})

interface Property {
  id: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  sqft: string
  main_image?: string
  status: string
}

interface PropertyFlyerProps {
  properties: Property[]
}

export const PropertyFlyerPDF: React.FC<PropertyFlyerProps> = ({ properties }) => {
  // Determine layout based on number of properties
  const count = properties.length
  const useThreeColumn = count >= 3
  const cardStyle = useThreeColumn ? styles.propertyCard3 : styles.propertyCard
  const imageStyle = useThreeColumn ? styles.propertyImageSmall : styles.propertyImage
  const noImageStyle = useThreeColumn ? styles.noImageBoxSmall : styles.noImageBox

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://drakehomesllc.com'}/DrakeHomes_Logo.jpg`}
          />
          <View style={styles.headerText}>
            <Text style={styles.companyName}>Drake Homes LLC</Text>
            <Text style={styles.tagline}>Quality Construction in Wisconsin</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Available Homes</Text>

        {/* Properties Grid */}
        <View style={styles.propertiesGrid}>
          {properties.map((property) => (
            <View key={property.id} style={cardStyle}>
              {property.main_image ? (
                <Image 
                  style={imageStyle} 
                  src={property.main_image}
                  cache={false}
                />
              ) : (
                <View style={noImageStyle}>
                  <Text style={styles.noImageText}>No Image Available</Text>
                </View>
              )}
              <View style={styles.propertyDetails}>
                <Text style={styles.propertyTitle}>{property.title || 'Untitled'}</Text>
                <Text style={styles.propertyLocation}>{property.location || 'Location TBD'}</Text>
                <Text style={styles.propertyPrice}>{property.price || 'Price TBD'}</Text>
                <View style={styles.propertySpecs}>
                  <Text style={styles.spec}>{property.beds || 0} Beds</Text>
                  <Text style={styles.spec}>•</Text>
                  <Text style={styles.spec}>{property.baths || 0} Baths</Text>
                  <Text style={styles.spec}>•</Text>
                  <Text style={styles.spec}>{property.sqft || 'TBD'}</Text>
                </View>
                <Text style={styles.propertyStatus}>{property.status || 'Status TBD'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.contactRow}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactBold}>(920) 740-6660</Text>
              <Text style={styles.contactItem}>info@drakehomesllc.com</Text>
            </View>
            <Text style={styles.website}>drakehomesllc.com</Text>
          </View>
          <Text style={styles.disclaimer}>
            Information deemed reliable but not guaranteed. Prices and availability subject to change without notice.
          </Text>
        </View>
      </Page>
    </Document>
  )
} 