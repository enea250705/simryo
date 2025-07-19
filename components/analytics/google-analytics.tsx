'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XTN13B7FTE'

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: any
    ) => void
    dataLayer: any[]
  }
}

export function GoogleAnalytics() {
  return (
    <>
      <Script
        id="gtag-check"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            // Only load full GA on desktop for performance
            if (window.innerWidth >= 768) {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                transport_type: 'beacon',
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                send_page_view: true,
                page_load_time: false
              });
              
              // Load GA script for desktop only
              const script = document.createElement('script');
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}';
              document.head.appendChild(script);
            }
          `,
        }}
      />
    </>
  )
}

export function GoogleAnalyticsPageView() {
  useEffect(() => {
    // Lightweight tracking for mobile, full tracking for desktop
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Ultra-lightweight tracking for mobile using Image beacon
      const trackPageView = () => {
        const img = new Image();
        img.src = `https://www.google-analytics.com/collect?v=1&tid=${GA_TRACKING_ID}&cid=${Date.now()}&t=pageview&dp=${encodeURIComponent(window.location.pathname)}&dt=${encodeURIComponent(document.title)}`;
      };
      
      // Delay tracking until after LCP
      const timer = setTimeout(trackPageView, 2000);
      return () => clearTimeout(timer);
    } else {
      // Full GA for desktop
      const handlePageView = () => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('config', GA_TRACKING_ID, {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true
          });
        }
      };

      const timer = setTimeout(handlePageView, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}