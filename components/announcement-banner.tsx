"use client"

import Link from "next/link"

const messages = [
  "🔥 LIMITED TIME: 30% OFF ALL PLANS",
  "✈️ Instant activation — travel ready in minutes",
  "🌍 Coverage in 190+ countries",
  "📱 No contracts, no roaming fees",
  "⚡ 30% OFF — Use code SIMRYO30 at checkout",
  "🛜 4G & 5G speeds worldwide",
]

const track = [...messages, ...messages]

export function AnnouncementBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-zinc-900 overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap animate-marquee">
        {track.map((msg, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8 text-xs font-medium text-white">
            {msg}
            <span className="text-zinc-500">·</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
