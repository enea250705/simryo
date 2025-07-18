import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageAnimation } from "@/components/page-animation"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { WebVitals } from "@/components/web-vitals"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://simryo.com'),
  title: {
    default: 'SIMRYO - Global eSIM Marketplace | Instant Mobile Data Plans Worldwide',
    template: '%s | SIMRYO - Global eSIM Marketplace'
  },
  description: 'Stay connected worldwide with SIMRYO\'s premium eSIM data plans. Instant activation, no contracts, coverage in 190+ countries. Get 15% off your first purchase with code WELCOME15.',
  keywords: [
    'eSIM',
    'international data plans',
    'travel SIM',
    'global connectivity',
    'mobile data',
    'roaming',
    'travel internet',
    'digital SIM',
    'worldwide coverage',
    'instant activation',
    'no contract',
    'prepaid data',
    'travel technology',
    'international roaming',
    'mobile internet'
  ],
  authors: [{ name: 'SIMRYO Team' }],
  creator: 'SIMRYO',
  publisher: 'SIMRYO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Technology',
  classification: 'Business',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'SIMRYO',
    title: 'SIMRYO - Global eSIM Marketplace | Instant Mobile Data Plans Worldwide',
    description: 'Stay connected worldwide with SIMRYO\'s premium eSIM data plans. Instant activation, no contracts, coverage in 190+ countries.',
    url: 'https://simryo.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SIMRYO - Global eSIM Marketplace',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'SIMRYO - Global eSIM Marketplace',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    alternateLocale: ['en_GB', 'es_ES', 'fr_FR', 'de_DE', 'it_IT', 'pt_BR', 'ja_JP', 'ko_KR', 'zh_CN'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@simryo',
    creator: '@simryo',
    title: 'SIMRYO - Global eSIM Marketplace',
    description: 'Stay connected worldwide with premium eSIM data plans. Instant activation, 190+ countries coverage.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://simryo.com',
    languages: {
      'en-US': 'https://simryo.com/en',
      'en-GB': 'https://simryo.com/en-gb',
      'es-ES': 'https://simryo.com/es',
      'fr-FR': 'https://simryo.com/fr',
      'de-DE': 'https://simryo.com/de',
      'it-IT': 'https://simryo.com/it',
      'pt-BR': 'https://simryo.com/pt-br',
      'ja-JP': 'https://simryo.com/ja',
      'ko-KR': 'https://simryo.com/ko',
      'zh-CN': 'https://simryo.com/zh-cn',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
      'facebook-domain-verification': 'your-facebook-verification-code',
    },
  },
  appleWebApp: {
    capable: true,
    title: 'SIMRYO',
    statusBarStyle: 'default',
    startupImage: [
      {
        url: '/apple-touch-startup-image-768x1004.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
      {
        url: '/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 1536px) and (device-height: 2048px)',
      },
    ],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/simryologo.png', sizes: '192x192', type: 'image/png' },
      { url: '/simryologo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/simryologo.png', sizes: '180x180', type: 'image/png' },
      { url: '/simryologo.png', sizes: '152x152', type: 'image/png' },
      { url: '/simryologo.png', sizes: '167x167', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/simryologo.png', color: '#0066cc' },
      { rel: 'shortcut icon', url: '/favicon.ico' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'SIMRYO',
    'msapplication-TileColor': '#0066cc',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
}

// Enhanced Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
  '@type': 'Organization',
      '@id': 'https://simryo.com/#organization',
  name: 'SIMRYO',
  description: 'Global eSIM marketplace providing instant mobile data plans worldwide',
  url: 'https://simryo.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://simryo.com/simryologo.png',
        width: 200,
        height: 60
      },
  image: 'https://simryo.com/og-image.jpg',
  sameAs: [
    'https://twitter.com/simryo',
    'https://facebook.com/simryo',
    'https://instagram.com/simryo',
    'https://linkedin.com/company/simryo'
  ],
      contactPoint: [
        {
    '@type': 'ContactPoint',
    telephone: '+1-555-SIMRYO',
    contactType: 'customer service',
          availableLanguage: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Chinese'],
          areaServed: 'Worldwide'
        },
        {
          '@type': 'ContactPoint',
          telephone: '+1-555-SIMRYO',
          contactType: 'technical support',
          availableLanguage: ['English'],
          areaServed: 'Worldwide'
        }
      ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'Global',
    addressLocality: 'Global',
    addressRegion: '',
    postalCode: '',
    streetAddress: ''
  },
  founder: {
    '@type': 'Person',
    name: 'SIMRYO Founder'
  },
  foundingDate: '2024',
  numberOfEmployees: '50-100',
  industry: 'Telecommunications',
      naics: '517312',
      parentOrganization: {
        '@type': 'Organization',
        name: 'SIMRYO Global Ltd'
      },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'eSIM Data Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Global eSIM Data Plans',
              description: 'Instant activation eSIM data plans for international travel',
              serviceType: 'Telecommunications',
              provider: {
                '@id': 'https://simryo.com/#organization'
              }
            },
            priceCurrency: 'USD',
            priceRange: '$3-200',
            availability: 'https://schema.org/InStock'
          }
        ]
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '2847',
        bestRating: '5',
        worstRating: '1'
      }
    },
    {
      '@type': 'WebSite',
      '@id': 'https://simryo.com/#website',
      url: 'https://simryo.com',
      name: 'SIMRYO',
      description: 'Global eSIM marketplace providing instant mobile data plans worldwide',
      publisher: {
        '@id': 'https://simryo.com/#organization'
      },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://simryo.com/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      ],
      inLanguage: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN']
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://simryo.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://simryo.com'
        }
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://simryo.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is an eSIM?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does SIMRYO work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SIMRYO provides instant eSIM activation for international travel. Simply purchase a plan, receive a QR code, and activate your eSIM instantly.'
          }
        }
      ]
    },
    {
      '@type': 'Product',
      '@id': 'https://simryo.com/#product',
      name: 'Global eSIM Data Plans',
      description: 'Instant activation eSIM data plans for international travel with coverage in 190+ countries',
      brand: {
        '@id': 'https://simryo.com/#organization'
      },
      category: 'Telecommunications',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '3',
        highPrice: '200',
        offerCount: '50+',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '2847',
        bestRating: '5',
        worstRating: '1'
      }
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.simryo.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Performance Hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Geo Location */}
        <meta name="geo.region" content="Global" />
        <meta name="geo.placename" content="Global" />
        
        {/* Business Information */}
        <meta name="rating" content="5" />
        <meta name="price" content="$3-200" />
        <meta name="priceCurrency" content="USD" />
        <meta name="availability" content="InStock" />
        
        {/* Mobile Optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SIMRYO" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#0066cc" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="en" href="https://simryo.com/en" />
        <link rel="alternate" hrefLang="es" href="https://simryo.com/es" />
        <link rel="alternate" hrefLang="fr" href="https://simryo.com/fr" />
        <link rel="alternate" hrefLang="de" href="https://simryo.com/de" />
        <link rel="alternate" hrefLang="it" href="https://simryo.com/it" />
        <link rel="alternate" hrefLang="pt" href="https://simryo.com/pt-br" />
        <link rel="alternate" hrefLang="ja" href="https://simryo.com/ja" />
        <link rel="alternate" hrefLang="ko" href="https://simryo.com/ko" />
        <link rel="alternate" hrefLang="zh" href="https://simryo.com/zh-cn" />
        <link rel="alternate" hrefLang="x-default" href="https://simryo.com" />
        
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="SIMRYO Blog RSS Feed"
          href="/rss.xml"
        />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/simryologo.png" type="image/png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <div className="relative min-h-screen bg-background">
        <Navbar />
              <main id="main-content" className="relative">
                <PageAnimation>{children}</PageAnimation>
              </main>
        <Footer />
              <Toaster />
              <WebVitals />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
        
        {/* Analytics Scripts - Deferred for better performance */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true
                  });
                }, 3000);
              });
            `,
          }}
        />
        
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
            `,
          }}
        />
        
        {/* Hotjar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:HOTJAR_ID,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </body>
    </html>
  )
}
