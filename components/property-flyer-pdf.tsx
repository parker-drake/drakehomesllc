import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#DC2626',
  },
  logo: {
    width: 140,
    height: 50,
    objectFit: 'contain',
  },
  headerText: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  titleSection: {
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: 'medium',
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  propertyCard: {
    width: '48%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  propertyCard3: {
    width: '31%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  propertyImage: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
  },
  propertyImageSmall: {
    width: '100%',
    height: 110,
    objectFit: 'cover',
  },
  propertyDetails: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  propertyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 1.3,
  },
  propertyLocation: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 1.2,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 6,
  },
  propertySpecs: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  spec: {
    fontSize: 9,
    color: '#374151',
    fontWeight: 'medium',
  },
  specDivider: {
    fontSize: 8,
    color: '#D1D5DB',
  },
  propertyStatus: {
    fontSize: 9,
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#DC2626',
    backgroundColor: '#FFFFFF',
  },
  footerContent: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
  },
  contactItem: {
    fontSize: 11,
    color: '#374151',
    fontWeight: 'medium',
  },
  contactBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  website: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  disclaimer: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
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

  // Get status color based on property status
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Move-In Ready':
        return {
          color: '#065F46',
          backgroundColor: '#D1FAE5',
        }
      case 'Under Construction':
        return {
          color: '#92400E',
          backgroundColor: '#FED7AA',
        }
      case 'Nearly Complete':
        return {
          color: '#1E40AF',
          backgroundColor: '#DBEAFE',
        }
      default:
        return {
          color: '#374151',
          backgroundColor: '#F3F4F6',
        }
    }
  }

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

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Available Homes</Text>
        </View>

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
                  <Text style={styles.specDivider}>•</Text>
                  <Text style={styles.spec}>{property.baths || 0} Baths</Text>
                  <Text style={styles.specDivider}>•</Text>
                  <Text style={styles.spec}>{property.sqft || 'TBD'}</Text>
                </View>
                <Text style={[styles.propertyStatus, getStatusStyle(property.status || '')]}>{property.status || 'Status TBD'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.contactRow}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactBold}>Call: (920) 740-6660</Text>
                <Text style={styles.contactItem}>Email: info@drakehomesllc.com</Text>
              </View>
              <Text style={styles.website}>www.drakehomesllc.com</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  )
} 