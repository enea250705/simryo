import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://simryo.com'
  const currentDate = new Date().toISOString()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/plans`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Blog posts - Major pillar content
  const majorBlogPosts = [
    {
      url: `${baseUrl}/blog/ultimate-guide-best-esim-international-travel-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0, // Highest priority for main pillar
    },
    {
      url: `${baseUrl}/blog/esim-technology-explained-complete-guide-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog/digital-nomad-global-connectivity-esim-guide`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog/best-esim-europe-travel-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Supporting blog posts
  const supportingBlogPosts = [
    'country-specific-esim-guides-usa-canada-mexico',
    'esim-vs-physical-sim-comprehensive-comparison',
    'esim-troubleshooting-common-issues-solutions',
    'best-unlimited-data-esim-plans-worldwide',
    'esim-business-travel-guide-enterprise-solutions',
    'cheapest-esim-plans-budget-travel-guide',
    'esim-security-privacy-guide-2025',
    'cruise-ship-connectivity-esim-guide',
    '5g-esim-coverage-speed-guide',
    'student-study-abroad-esim-guide',
    'esim-vs-pocket-wifi-comparison-guide',
    'best-esim-apps-management-guide',
    'family-travel-esim-group-plans',
    'emergency-communication-esim-guide',
  ].map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Country-specific plan pages (high-value landing pages)
  const countryPages = [
    // Europe
    'germany', 'france', 'italy', 'spain', 'uk', 'netherlands', 'switzerland',
    'austria', 'belgium', 'portugal', 'greece', 'poland', 'czech-republic',
    'hungary', 'croatia', 'norway', 'sweden', 'denmark', 'finland',
    
    // North America
    'usa', 'canada', 'mexico',
    
    // Asia
    'japan', 'south-korea', 'singapore', 'thailand', 'vietnam', 'indonesia',
    'philippines', 'malaysia', 'china', 'hong-kong', 'taiwan', 'india',
    
    // Oceania
    'australia', 'new-zealand',
    
    // Middle East
    'uae', 'saudi-arabia', 'qatar', 'israel', 'turkey',
    
    // Africa
    'south-africa', 'egypt', 'morocco', 'kenya', 'tanzania',
    
    // South America
    'brazil', 'argentina', 'chile', 'peru', 'colombia',
  ].map(country => ({
    url: `${baseUrl}/plans/${country}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Regional plan pages
  const regionalPages = [
    'europe',
    'asia',
    'north-america',
    'south-america',
    'middle-east',
    'africa',
    'oceania',
    'global',
  ].map(region => ({
    url: `${baseUrl}/plans/${region}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  // Plan-specific pages (for popular plans)
  const planPages = [
    // Europe plans
    'plans/europe/eu-unlimited',
    'plans/europe/schengen-basic',
    'plans/europe/uk-ireland',
    
    // Global plans
    'plans/global/world-traveler',
    'plans/global/business-pro',
    'plans/global/student-special',
    
    // Regional plans
    'plans/asia/asia-pacific',
    'plans/north-america/usa-canada',
    'plans/middle-east/gulf-states',
  ].map(planPath => ({
    url: `${baseUrl}/${planPath}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Admin pages (lower priority)
  const adminPages = [
    'admin',
    'admin/analytics',
    'admin/customers', 
    'admin/orders',
    'admin/providers',
    'admin/settings',
  ].map(adminPath => ({
    url: `${baseUrl}/${adminPath}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.3,
  }))

  // Special pages
  const specialPages = [
    {
      url: `${baseUrl}/setup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/benefits`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [
    ...staticPages,
    ...majorBlogPosts,
    ...supportingBlogPosts,
    ...countryPages,
    ...regionalPages,
    ...planPages,
    ...specialPages,
    ...adminPages,
  ]
} 