"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plane, 
  MapPin, 
  Clock, 
  Wifi, 
  Battery, 
  Camera,
  Coffee,
  Globe,
  Shield,
  Zap,
  Heart,
  Star
} from "lucide-react"

const travelTips = [
  {
    icon: Plane,
    title: "Before You Fly",
    tip: "Install your eSIM while on Wi-Fi at home. It activates when you arrive!",
    color: "text-blue-500"
  },
  {
    icon: Battery,
    title: "Save Battery",
    tip: "Turn off automatic app updates and background refresh while traveling",
    color: "text-green-500"
  },
  {
    icon: Wifi,
    title: "Smart Usage",
    tip: "Use Wi-Fi when available and save cellular data for when you really need it",
    color: "text-purple-500"
  },
  {
    icon: MapPin,
    title: "Offline Maps",
    tip: "Download offline maps before you travel to save data and never get lost",
    color: "text-orange-500"
  },
  {
    icon: Shield,
    title: "Stay Secure",
    tip: "Avoid public Wi-Fi for sensitive activities. Your eSIM data is safer!",
    color: "text-red-500"
  },
  {
    icon: Clock,
    title: "Time Zones",
    tip: "Your eSIM activates automatically in the new time zone. No manual setup needed!",
    color: "text-teal-500"
  }
]

export function TravelTips() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-2 mb-3">
          <Star className="h-6 w-6 text-yellow-500" />
          <Heart className="h-6 w-6 text-red-500" />
          <Globe className="h-6 w-6 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Travel Tips from Fellow Nomads</h3>
        <p className="text-gray-600">Make the most of your eSIM and travel experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {travelTips.map((tip, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${tip.color}`}>
                  <tip.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Coffee className="h-3 w-3 mr-1" />
          Happy travels! ☕✈️
        </Badge>
      </div>
    </div>
  )
}