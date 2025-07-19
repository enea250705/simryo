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
        strategy="lazyOnload"
        defer
        onLoad={() => {
          // Only initialize after user interaction or scroll
          if (typeof window !== 'undefined') {
            const initGA = () => {
              window.dataLayer = window.dataLayer || [];
              function gtag(...args: any[]) {
                window.dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', GA_TRACKING_ID, {
                page_title: document.title,
                page_location: window.location.href,
                // Mobile optimization
                transport_type: 'beacon',
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                // Reduce tracking overhead
                send_page_view: false,
                page_load_time: false,
                custom_map: {
                  'custom_parameter_1': 'dimension1'
                }
              });
            };

            // Initialize GA after user interaction
            const handleInteraction = () => {
              initGA();
              document.removeEventListener('scroll', handleInteraction);
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('touchstart', handleInteraction);
            };

            document.addEventListener('scroll', handleInteraction, { passive: true, once: true });
            document.addEventListener('click', handleInteraction, { passive: true, once: true });
            document.addEventListener('touchstart', handleInteraction, { passive: true, once: true });
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