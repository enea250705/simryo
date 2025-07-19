export function PerformanceHints() {
  return (
    <>
      {/* Mobile viewport optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
      
      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS prefetch for other domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Preload critical resources - Mobile optimized */}
      <link rel="preload" href="/simryologo.png" as="image" type="image/png" fetchPriority="high" />
      
      {/* Mobile-specific preloads */}
      <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      <link rel="preload" href="/_next/static/css/app/globals.css" as="style" />
      
      {/* Mobile performance hints */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#0066cc" />
      <meta name="msapplication-TileColor" content="#0066cc" />
    </>
  )
} 