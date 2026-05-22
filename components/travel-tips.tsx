"use client"

import { Plane, Battery, Wifi, MapPin, Shield, Clock } from "lucide-react"

const travelTips = [
  {
    icon: Plane,
    title: "Install before you fly",
    tip: "Set up your eSIM at home on Wi-Fi. It activates automatically when you land."
  },
  {
    icon: Battery,
    title: "Save battery",
    tip: "Disable automatic app updates and background refresh while traveling."
  },
  {
    icon: Wifi,
    title: "Use Wi-Fi when available",
    tip: "Reserve cellular data for when you actually need it on the go."
  },
  {
    icon: MapPin,
    title: "Download offline maps",
    tip: "Save Google Maps or Maps.me offline before departure to avoid data use."
  },
  {
    icon: Shield,
    title: "Skip public Wi-Fi",
    tip: "Use your eSIM data for banking or logins — it's more secure than café Wi-Fi."
  },
  {
    icon: Clock,
    title: "No time zone setup",
    tip: "Your eSIM works automatically in any time zone. Nothing to configure."
  }
]

export function TravelTips() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Travel tips</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Get more from your eSIM</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {travelTips.map((tip, index) => (
          <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 shrink-0">
              <tip.icon className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
