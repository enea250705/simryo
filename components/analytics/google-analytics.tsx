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
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        defer
        onLoad={() => {
          if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
              window.dataLayer.push(arguments);
            }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', GA_TRACKING_ID, {
              // Minimal configuration to reduce JS payload
              transport_type: 'beacon',
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              send_page_view: true,
              // Disable features that add unused JS
              optimize_id: undefined,
              linker: undefined,
              custom_map: undefined,
              page_load_time: false,
              site_speed_sample_rate: 1
            });
          }
        }}
      />
    </>
  )
}

export function GoogleAnalyticsPageView() {
  useEffect(() => {
    // Only send pageview after user interaction to improve performance
    const handlePageView = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true
        });
      }
    };

    // Send pageview after a small delay to prioritize content loading
    const timer = setTimeout(handlePageView, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}