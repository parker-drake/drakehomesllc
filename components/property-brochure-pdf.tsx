import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Register fonts if needed
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// })

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#DC2626',
    paddingBottom: 15,
  },
  logo: {
    width: 150,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 3,
  },
  mainImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    marginBottom: 20,
    borderRadius: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  detailBox: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  feature: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 5,
    paddingLeft: 15,
  },
  propertyInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  infoItem: {
    width: '45%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 10,
    color: '#374151',
  },
  contactBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  disclaimer: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 10,
    textAlign: 'center',
  },
  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  galleryImage: {
    width: '48%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4,
  },
  badge: {
    backgroundColor: '#DC2626',
    color: 'white',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
})

interface PropertyBrochureProps {
  property: {
    id: string
    title: string
    price: string
    location: string
    beds: number
    baths: number
    sqft: string
    status: string
    availability_status?: string
    description: string
    features: string[]
    completion_date: string
    main_image?: string
    property_images?: Array<{ image_url: string }>
    lot_size?: string
    year_built?: number
    property_type?: string
    garage_spaces?: number
    heating_cooling?: string
    flooring_type?: string
    school_district?: string
    hoa_fee?: string
    utilities_included?: string
    exterior_materials?: string
  }
}

export const PropertyBrochurePDF: React.FC<PropertyBrochureProps> = ({ property }) => {
  // Get additional images (limit to 4 for space)
  const additionalImages = property.property_images?.slice(0, 4) || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image 
              style={styles.logo} 
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://drakehomesllc.com'}/DrakeHomes_Logo.jpg`}
            />
            <View style={{ marginLeft: 'auto' }}>
              {property.availability_status && property.availability_status !== 'Available' && (
                <View style={styles.badge}>
                  <Text>{property.availability_status}</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.subtitle}>{property.location}</Text>
        </View>

        {/* Main Image */}
        {property.main_image && (
          <Image style={styles.mainImage} src={property.main_image} />
        )}

        {/* Price */}
        <Text style={styles.price}>{property.price}</Text>

        {/* Property Details */}
        <View style={styles.propertyDetails}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>BEDROOMS</Text>
            <Text style={styles.detailValue}>{property.beds}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>BATHROOMS</Text>
            <Text style={styles.detailValue}>{property.baths}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>SQUARE FEET</Text>
            <Text style={styles.detailValue}>{property.sqft}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>STATUS</Text>
            <Text style={styles.detailValue}>{property.status}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Home</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Features */}
        {property.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features & Amenities</Text>
            <View style={styles.featuresGrid}>
              {property.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>• {feature}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Property Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.propertyInfo}>
            {property.lot_size && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Lot Size</Text>
                <Text style={styles.infoValue}>{property.lot_size}</Text>
              </View>
            )}
            {property.year_built && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Year Built</Text>
                <Text style={styles.infoValue}>{property.year_built}</Text>
              </View>
            )}
            {property.property_type && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Property Type</Text>
                <Text style={styles.infoValue}>{property.property_type}</Text>
              </View>
            )}
            {property.garage_spaces && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Garage Spaces</Text>
                <Text style={styles.infoValue}>{property.garage_spaces}</Text>
              </View>
            )}
            {property.school_district && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>School District</Text>
                <Text style={styles.infoValue}>{property.school_district}</Text>
              </View>
            )}
            {property.hoa_fee && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>HOA Fee</Text>
                <Text style={styles.infoValue}>{property.hoa_fee}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Completion Date</Text>
              <Text style={styles.infoValue}>{property.completion_date}</Text>
            </View>
          </View>
        </View>

        {/* Additional Images */}
        {additionalImages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Gallery</Text>
            <View style={styles.imageGallery}>
              {additionalImages.map((image, index) => (
                <Image key={index} style={styles.galleryImage} src={image.image_url} />
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.contactInfo}>
            <View>
              <Text style={styles.contactBold}>Drake Homes LLC</Text>
              <Text style={styles.contactText}>Quality Construction in Wisconsin</Text>
            </View>
            <View>
              <Text style={styles.contactBold}>(920) 740-6660</Text>
              <Text style={styles.contactText}>info@drakehomesllc.com</Text>
              <Text style={styles.contactText}>drakehomesllc.com</Text>
            </View>
          </View>
          <Text style={styles.disclaimer}>
            Information deemed reliable but not guaranteed. Subject to change without notice.
          </Text>
        </View>
      </Page>
    </Document>
  )
} 