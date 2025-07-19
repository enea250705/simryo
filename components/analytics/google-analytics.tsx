'use client'

import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XTN13B7FTE'

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        defer
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        defer
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false
            });
          `,
        }}
      />
    </>
  )
}

export function GoogleAnalyticsPageView() {
  return (
    <Script
      id="google-analytics-pageview"
      strategy="afterInteractive"
      defer
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof gtag !== 'undefined') {
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true
            });
          }
        `,
      }}
    />
  )
}