import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

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
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 3,
  },
  mainImage: {
    width: '100%',
    height: 300,
    objectFit: 'contain',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  price: {
    fontSize: 24,
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
  detailsGrid: {
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
  floorPlanSection: {
    marginBottom: 20,
  },
  floorPlanImage: {
    width: '100%',
    height: 400,
    objectFit: 'contain',
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
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
  customizationNote: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  customizationText: {
    fontSize: 10,
    color: '#92400E',
  },
})

interface PlanBrochureProps {
  plan: {
    id: string
    name: string
    base_price?: number
    beds: number
    baths: number
    sqft: string
    description: string
    features: string[]
    main_image?: string
    floor_plan_images?: Array<{ image_url: string; floor_number?: number }>
    garage_type?: string
  }
}

export const PlanBrochurePDF: React.FC<PlanBrochureProps> = ({ plan }) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'Contact for Pricing'
    return `Starting at $${price.toLocaleString()}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="/DrakeHomes_Logo.jpg"
          />
          <Text style={styles.title}>{plan.name}</Text>
          <Text style={styles.subtitle}>Custom Home Floor Plan</Text>
        </View>

        {/* Main Image */}
        {plan.main_image && (
          <Image style={styles.mainImage} src={plan.main_image} />
        )}

        {/* Price */}
        <Text style={styles.price}>{formatPrice(plan.base_price)}</Text>

        {/* Customization Note */}
        <View style={styles.customizationNote}>
          <Text style={styles.customizationText}>
            This is a starting price. Final pricing depends on your selected lot, 
            customizations, and finishes. Contact us to discuss your specific needs.
          </Text>
        </View>

        {/* Plan Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>BEDROOMS</Text>
            <Text style={styles.detailValue}>{plan.beds}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>BATHROOMS</Text>
            <Text style={styles.detailValue}>{plan.baths}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>SQUARE FEET</Text>
            <Text style={styles.detailValue}>{plan.sqft}</Text>
          </View>
          {plan.garage_type && (
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>GARAGE</Text>
              <Text style={styles.detailValue}>{plan.garage_type}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Floor Plan</Text>
          <Text style={styles.description}>{plan.description}</Text>
        </View>

        {/* Features */}
        {plan.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Standard Features</Text>
            <View style={styles.featuresGrid}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>• {feature}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Floor Plan Images */}
        {plan.floor_plan_images && plan.floor_plan_images.length > 0 && (
          <View style={styles.floorPlanSection}>
            <Text style={styles.sectionTitle}>Floor Plan Details</Text>
            {plan.floor_plan_images.map((image, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                {image.floor_number && (
                  <Text style={{ fontSize: 12, marginBottom: 5, color: '#374151' }}>
                    Floor {image.floor_number}
                  </Text>
                )}
                <Image style={styles.floorPlanImage} src={image.image_url} />
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.contactInfo}>
            <View>
              <Text style={styles.contactBold}>Drake Homes LLC</Text>
              <Text style={styles.contactText}>Custom Home Builder</Text>
            </View>
            <View>
              <Text style={styles.contactBold}>(920) 740-6660</Text>
              <Text style={styles.contactText}>info@drakehomesllc.com</Text>
              <Text style={styles.contactText}>drakehomesllc.com</Text>
            </View>
          </View>
          <Text style={styles.disclaimer}>
            Floor plans and pricing subject to change. Images may show optional features.
          </Text>
        </View>
      </Page>
    </Document>
  )
} 