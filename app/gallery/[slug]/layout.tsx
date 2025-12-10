import { Metadata } from "next"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { generateCanonicalUrl, generateMetaTags } from "@/lib/seo-utils"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Fetch all galleries to find the one with matching slug
    const { data: galleries, error } = await supabaseAdmin
      .from("galleries")
      .select("*")

    if (error || !galleries) {
      return {
        title: "Gallery Not Found",
        description: "This gallery is no longer available.",
        robots: "noindex, nofollow",
      }
    }

    const gallery = galleries.find((g) => g.slug === params.slug)

    if (!gallery) {
      return {
        title: "Gallery Not Found",
        description: "This gallery is no longer available.",
        robots: "noindex, nofollow",
      }
    }

    const title = `${gallery.name} - Project Gallery`
    const description = gallery.description 
      ? `${gallery.description.slice(0, 140)}... View photos from Drake Homes LLC.`
      : `View photos from ${gallery.name} by Drake Homes LLC. Quality custom home construction in Wisconsin's Fox Valley area.`

    return generateMetaTags({
      title,
      description,
      canonical: generateCanonicalUrl(`/gallery/${params.slug}`),
      ogImage: "/DrakeHomes_Logo.jpg",
    })
  } catch (error) {
    console.error("Error generating gallery metadata:", error)
    return {
      title: "Project Gallery",
      description: "View project photos from Drake Homes LLC in Wisconsin's Fox Valley area.",
    }
  }
}

export default function GalleryDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

