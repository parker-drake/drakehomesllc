import { Metadata } from "next"

interface PlanLayoutProps {
  children: React.ReactNode
  params: { id: string }
}

// This will be populated dynamically based on the plan data
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // In a real app, you'd fetch the plan data here for SEO
    // For now, we'll use a generic template
    return {
      title: "House Plan Details - Custom Home Design | Drake Homes LLC",
      description: "View detailed information about this custom house plan including floor plans, features, specifications, and pricing. Quality home construction in Wisconsin's Fox Valley area.",
      keywords: ["house plan details", "custom home design", "Wisconsin home plans", "home specifications", "Drake Homes plans"],
      openGraph: {
        title: "House Plan Details - Custom Home Design",
        description: "View detailed information about this custom house plan including floor plans, features, and specifications.",
        url: `https://drakehomesllc.com/plans/${params.id}`,
        type: "website",
      },
      twitter: {
        title: "House Plan Details - Custom Home Design",
        description: "View detailed information about this custom house plan including floor plans, features, and specifications.",
      },
      alternates: {
        canonical: `/plans/${params.id}`,
      },
    }
  } catch (error) {
    // Fallback metadata if fetch fails
    return {
      title: "House Plan Details | Drake Homes LLC",
      description: "View detailed information about this custom house plan from Drake Homes LLC.",
    }
  }
}

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
} 