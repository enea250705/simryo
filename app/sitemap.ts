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

  // Focus on only the top performing blog posts for better indexing
  const supportingBlogPosts = [
    'esim-vs-physical-sim-comprehensive-comparison',
    'cheapest-esim-plans-budget-travel-guide', 
    'esim-security-privacy-guide-2025',
    'best-unlimited-data-esim-plans-worldwide',
  ].map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Only include country pages that actually exist and have plans
  const countryPages = [
    // Countries with confirmed plans (remove others to avoid 404s)
    'hong-kong',
    'japan', 
    'south-korea',
    'usa',
    'thailand',
    'singapore',
  ].map(country => ({
    url: `${baseUrl}/plans/${country}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Remove non-existent regional and plan pages to avoid 404s
  // const regionalPages = []
  // const planPages = []

  // Admin pages removed - should not be indexed

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
    // ...regionalPages, // Removed - pages don't exist
    // ...planPages, // Removed - pages don't exist
    ...specialPages,
    // ...adminPages, // Removed - shouldn't be indexed
  ]
} 