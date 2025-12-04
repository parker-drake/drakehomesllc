import { Metadata } from "next"

// Configure pages are interactive tools, not content - don't index them
export const metadata: Metadata = {
  title: "Plan Configurator | Drake Homes LLC",
  description: "Customize your home plan with Drake Homes LLC.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ConfigureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

