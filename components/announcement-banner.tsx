"use client"

import { useState } from "react"

const messages = [
  "🔥 30% off all plans this week only",
  "✈️ Get connected before you land",
  "🌍 Works in 190+ countries",
  "📱 No contracts. No roaming bills.",
  "⚡ Use code SIMRYO30 at checkout",
  "🛜 4G & 5G speeds wherever you go",
]

const track = [...messages, ...messages]

export function AnnouncementBanner() {
  const [isPaused, setIsPaused] = useState(false)

  const resume = () => setIsPaused(false)
  const pause = () => setIsPaused(true)

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-zinc-900 overflow-hidden flex items-center">
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
        onPointerDown={pause}
        onPointerUp={resume}
        onPointerLeave={resume}
        onPointerCancel={resume}
      >
        {track.map((msg, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-sm sm:text-xs font-medium text-white">
            {msg}
            <span className="text-zinc-600 text-[10px]">✦</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
          animation-timing-function: linear;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (max-width: 1024px) {
          .animate-marquee {
            animation-duration: 180s;
          }
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 320s;
          }
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 520s;
          }
        }
      `}</style>
    </div>
  )
}
