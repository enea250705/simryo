"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Travel Blogger",
    avatar: "/avatars/sarah.jpg",
    content: "SIMRYO saved my European trip! Instant connectivity in 15 countries with just one eSIM. The setup was incredibly easy, and the data speeds were excellent throughout my journey.",
    rating: 5,
    location: "🇺🇸 United States"
  },
  {
    name: "Marcus Chen",
    role: "Digital Nomad",
    avatar: "/avatars/marcus.jpg",
    content: "As someone who travels constantly for work, SIMRYO has been a game-changer. No more hunting for local SIM cards or dealing with expensive roaming charges. Just activate and go!",
    rating: 5,
    location: "🇸🇬 Singapore"
  },
  {
    name: "Emma Rodriguez",
    role: "Business Executive",
    avatar: "/avatars/emma.jpg",
    content: "The reliability and coverage exceeded my expectations. Used it across Asia for 3 weeks without any issues. Customer support was responsive and helpful when I had questions.",
    rating: 5,
    location: "🇲🇽 Mexico"
  },
  {
    name: "David Kim",
    role: "Adventure Photographer",
    avatar: "/avatars/david.jpg",
    content: "Perfect for remote locations! I was able to upload photos and stay connected even in rural areas of Iceland and Norway. The data allowance was generous and speeds were consistent.",
    rating: 5,
    location: "🇰🇷 South Korea"
  },
  {
    name: "Lisa Thompson",
    role: "Travel Consultant",
    avatar: "/avatars/lisa.jpg",
    content: "I recommend SIMRYO to all my clients. The ease of activation and wide coverage make it ideal for international travelers. No more client complaints about connectivity issues!",
    rating: 5,
    location: "🇨🇦 Canada"
  },
  {
    name: "Ahmed Hassan",
    role: "Tech Entrepreneur",
    avatar: "/avatars/ahmed.jpg",
    content: "Seamless experience from purchase to activation. The QR code setup took less than 2 minutes. Having reliable internet for video calls while traveling has been crucial for my business.",
    rating: 5,
    location: "🇦🇪 UAE"
  }
]

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Travelers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who stay connected with SIMRYO
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-4">
                  <Quote className="h-8 w-8 text-blue-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 mt-1">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}