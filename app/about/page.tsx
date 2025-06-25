import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Home, 
  Users, 
  Award, 
  Heart, 
  Clock, 
  CheckCircle,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Drake Homes LLC
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100">
            "Where Quality and Value Meet"
          </p>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Building homes our customers expect with uncompromising quality and integrity
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  At Drake Homes LLC, <strong>"Where quality and value meet"</strong> is our identity! 
                  We specialize in building homes our customers expect. In today's market, some builders 
                  are trying to increase profit by lowering standards, features, and quality.
                </p>
                <p>
                  <strong>Drake Homes LLC works to increase quality and customer satisfaction.</strong> We have 
                  great relationships with our suppliers and sub-contractors because we treat them like 
                  partners and friends. We work together to make sure your home is something to be proud of!
                </p>
                <p>
                  After over 20 years of real estate sales experience, we noticed that some builders were 
                  taking shortcuts. We didn't like having to explain to customers why builders took shortcuts 
                  and why the finished products were not as home buyers would expect.
                </p>
                <p className="text-red-600 font-medium text-lg">
                  This is why we started Drake Homes!
                </p>
              </div>
            </div>

            {/* Values Cards */}
            <div className="space-y-6">
              <Card className="border-l-4 border-l-red-600 h-32">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Quality First</h3>
                  </div>
                  <p className="text-gray-600">
                    We increase quality and customer satisfaction while others cut corners to boost profits.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-600 h-32">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Strong Partnerships</h3>
                  </div>
                  <p className="text-gray-600">
                    Great relationships with suppliers and sub-contractors as partners and friends.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-600 h-32">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-gray-900">20+ Years Experience</h3>
                  </div>
                  <p className="text-gray-600">
                    Over two decades of real estate sales experience building homes customers expect.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While others take shortcuts, we take the extra steps to ensure your home exceeds expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Shortcuts</h3>
              <p className="text-gray-600">
                We build homes the right way, every time. No cutting corners, no compromises on quality.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Focused</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We build homes you'll be proud to call home.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                Every detail matters. We work with trusted partners to deliver exceptional homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Experience the Drake Homes difference where quality and value truly meet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/available-homes">
                <Home className="w-5 h-5 mr-2" />
                View Available Homes
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Link href="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Ready to discuss your dream home?</p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/contact">
                    Get In Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Have questions about our process?</p>
                <Button asChild variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  <Link href="/contact">
                    Send Message
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 