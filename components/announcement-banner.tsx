"use client"

const mobileMessage = "🔥 30% off all plans this week only"

const desktopMessages = [
  "🔥 30% off all plans this week only",
  "✈️ Get connected before you land",
  "🌍 Works in 190+ countries",
  "📱 No contracts. No roaming bills.",
  "⚡ Discount applied automatically at checkout",
  "🛜 4G and 5G speeds wherever you go",
]

const track = [...desktopMessages, ...desktopMessages]

export function AnnouncementBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-zinc-900 overflow-hidden flex items-center">

      {/* Mobile: static centered message */}
      <div className="flex md:hidden w-full items-center justify-center px-4">
        <span className="text-xs font-medium text-white text-center truncate">{mobileMessage}</span>
      </div>

      {/* Desktop: scrolling marquee */}
      <div className="hidden md:flex whitespace-nowrap animate-marquee">
        {track.map((msg, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-xs font-medium text-white">
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
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
