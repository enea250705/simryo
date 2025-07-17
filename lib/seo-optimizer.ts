// AI-powered SEO content optimization utilities

export interface SEOAnalysis {
  readabilityScore: number
  keywordDensity: { [key: string]: number }
  semanticKeywords: string[]
  contentStructure: {
    headings: { level: number; text: string }[]
    paragraphs: number
    images: number
    links: { internal: number; external: number }
  }
  technicalSEO: {
    titleOptimized: boolean
    metaDescriptionOptimized: boolean
    structuredDataPresent: boolean
    imageAltTexts: boolean
  }
  suggestions: string[]
}

export class SEOOptimizer {
  private static readonly IDEAL_KEYWORD_DENSITY = 0.015 // 1.5%
  private static readonly READABILITY_THRESHOLDS = {
    excellent: 80,
    good: 60,
    average: 40,
    poor: 20
  }

  static analyzeContent(content: string, primaryKeyword: string): SEOAnalysis {
    const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 2)
    const totalWords = words.length
    
    // Calculate keyword density
    const keywordCount = words.filter(word => 
      word.includes(primaryKeyword.toLowerCase())
    ).length
    const keywordDensity = keywordCount / totalWords

    // Extract semantic keywords using NLP-like approach
    const semanticKeywords = this.extractSemanticKeywords(content, primaryKeyword)

    // Analyze readability (simplified Flesch Reading Ease)
    const readabilityScore = this.calculateReadabilityScore(content)

    // Analyze content structure
    const contentStructure = this.analyzeContentStructure(content)

    // Technical SEO checks
    const technicalSEO = this.checkTechnicalSEO(content)

    // Generate suggestions
    const suggestions = this.generateSuggestions({
      keywordDensity,
      readabilityScore,
      contentStructure,
      technicalSEO,
      primaryKeyword
    })

    return {
      readabilityScore,
      keywordDensity: { [primaryKeyword]: keywordDensity },
      semanticKeywords,
      contentStructure,
      technicalSEO,
      suggestions
    }
  }

  private static extractSemanticKeywords(content: string, primaryKeyword: string): string[] {
    // Simplified semantic keyword extraction
    const synonyms = this.getKeywordSynonyms(primaryKeyword)
    const relatedTerms = this.getRelatedTerms(primaryKeyword)
    
    return [...synonyms, ...relatedTerms].filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    )
  }

  private static getKeywordSynonyms(keyword: string): string[] {
    // This would typically use an NLP service or API
    const synonymMap: { [key: string]: string[] } = {
      'esim': ['embedded sim', 'digital sim', 'virtual sim'],
      'international': ['global', 'worldwide', 'overseas'],
      'travel': ['journey', 'trip', 'vacation', 'adventure'],
      'connectivity': ['connection', 'network', 'internet access'],
      'mobile': ['cellular', 'phone', 'device']
    }
    
    return synonymMap[keyword.toLowerCase()] || []
  }

  private static getRelatedTerms(keyword: string): string[] {
    // Related terms that should appear in quality content
    const relatedMap: { [key: string]: string[] } = {
      'esim': ['qr code', 'activation', 'carrier', 'data plan', 'roaming'],
      'international': ['country', 'region', 'coverage', 'border'],
      'travel': ['destination', 'airport', 'hotel', 'tourist'],
      'connectivity': ['signal', 'speed', 'network', 'coverage'],
      'mobile': ['smartphone', 'device', 'android', 'iphone']
    }
    
    return relatedMap[keyword.toLowerCase()] || []
  }

  private static calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length
    
    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    
    return Math.max(0, Math.min(100, score))
  }

  private static countSyllables(word: string): number {
    return word.toLowerCase().replace(/[^aeiou]/g, '').length || 1
  }

  private static analyzeContentStructure(content: string) {
    const headings = this.extractHeadings(content)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0).length
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length
    const links = this.countLinks(content)
    
    return {
      headings,
      paragraphs,
      images,
      links
    }
  }

  private static extractHeadings(content: string) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings: { level: number; text: string }[] = []
    let match
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2]
      })
    }
    
    return headings
  }

  private static countLinks(content: string) {
    const linkRegex = /\[.*?\]\((.*?)\)/g
    const links = content.match(linkRegex) || []
    
    const internal = links.filter(link => 
      link.includes('simryo.com') || 
      link.startsWith('/') || 
      link.startsWith('#')
    ).length
    
    const external = links.length - internal
    
    return { internal, external }
  }

  private static checkTechnicalSEO(content: string) {
    return {
      titleOptimized: content.includes('<title>') || content.includes('<h1>'),
      metaDescriptionOptimized: content.includes('meta') && content.includes('description'),
      structuredDataPresent: content.includes('schema.org') || content.includes('JSON-LD'),
      imageAltTexts: content.includes('alt=')
    }
  }

  private static generateSuggestions(analysis: {
    keywordDensity: number
    readabilityScore: number
    contentStructure: any
    technicalSEO: any
    primaryKeyword: string
  }): string[] {
    const suggestions: string[] = []
    
    // Keyword density suggestions
    if (analysis.keywordDensity < 0.005) {
      suggestions.push(`Increase "${analysis.primaryKeyword}" keyword density (currently ${(analysis.keywordDensity * 100).toFixed(2)}%)`)
    } else if (analysis.keywordDensity > 0.03) {
      suggestions.push(`Reduce "${analysis.primaryKeyword}" keyword density to avoid over-optimization`)
    }
    
    // Readability suggestions
    if (analysis.readabilityScore < 60) {
      suggestions.push('Improve readability by shortening sentences and using simpler words')
    }
    
    // Content structure suggestions
    if (analysis.contentStructure.headings.length < 3) {
      suggestions.push('Add more headings to improve content structure')
    }
    
    if (analysis.contentStructure.images < 2) {
      suggestions.push('Add more images to improve user engagement')
    }
    
    if (analysis.contentStructure.links.internal < 3) {
      suggestions.push('Add more internal links to improve site navigation')
    }
    
    // Technical SEO suggestions
    if (!analysis.technicalSEO.structuredDataPresent) {
      suggestions.push('Add structured data markup for better search engine understanding')
    }
    
    if (!analysis.technicalSEO.imageAltTexts) {
      suggestions.push('Add alt text to all images for accessibility and SEO')
    }
    
    return suggestions
  }

  // Real-time content optimization
  static optimizeContent(content: string, targetKeyword: string, options: {
    targetLength?: number
    includeSemanticKeywords?: boolean
    optimizeForFeaturedSnippets?: boolean
  } = {}): string {
    let optimizedContent = content
    
    // Add semantic keywords naturally
    if (options.includeSemanticKeywords) {
      const semanticKeywords = this.getKeywordSynonyms(targetKeyword)
      semanticKeywords.forEach(keyword => {
        if (!optimizedContent.toLowerCase().includes(keyword.toLowerCase())) {
          optimizedContent = this.insertKeywordNaturally(optimizedContent, keyword)
        }
      })
    }
    
    // Optimize for featured snippets
    if (options.optimizeForFeaturedSnippets) {
      optimizedContent = this.optimizeForFeaturedSnippets(optimizedContent, targetKeyword)
    }
    
    return optimizedContent
  }

  private static insertKeywordNaturally(content: string, keyword: string): string {
    // Simple implementation - would be more sophisticated in production
    const sentences = content.split('.')
    const randomIndex = Math.floor(Math.random() * sentences.length)
    sentences[randomIndex] = sentences[randomIndex].replace(
      /\b(the|a|an)\b/i,
      `$1 ${keyword}`
    )
    return sentences.join('.')
  }

  private static optimizeForFeaturedSnippets(content: string, keyword: string): string {
    // Add structured answers for common question patterns
    const questionPatterns = [
      `What is ${keyword}?`,
      `How does ${keyword} work?`,
      `Why use ${keyword}?`,
      `Benefits of ${keyword}`
    ]
    
    // This would analyze content and suggest structured answers
    return content // Simplified for this example
  }

  // Generate meta descriptions
  static generateMetaDescription(content: string, keyword: string, maxLength: number = 160): string {
    const sentences = content.split('.').filter(s => s.trim().length > 0)
    let description = ''
    
    for (const sentence of sentences) {
      const candidateDesc = description + sentence.trim() + '. '
      if (candidateDesc.length > maxLength) break
      if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
        description = candidateDesc
        break
      }
    }
    
    return description.trim() || sentences[0].substring(0, maxLength)
  }

  // Generate title suggestions
  static generateTitleSuggestions(keyword: string, contentType: 'guide' | 'comparison' | 'review' | 'how-to' = 'guide'): string[] {
    const templates = {
      guide: [
        `The Ultimate Guide to ${keyword} in 2025`,
        `Complete ${keyword} Guide: Everything You Need to Know`,
        `${keyword}: The Definitive Guide for Beginners`,
        `Master ${keyword}: A Comprehensive Guide`
      ],
      comparison: [
        `${keyword} vs [Alternative]: Which is Better?`,
        `Top ${keyword} Providers Compared`,
        `${keyword} Comparison: Find the Best Option`,
        `Best ${keyword} Services: Side-by-Side Comparison`
      ],
      review: [
        `${keyword} Review: Is It Worth It?`,
        `Honest ${keyword} Review: Pros and Cons`,
        `${keyword} Review: User Experience Report`,
        `${keyword} Tested: Our Detailed Review`
      ],
      'how-to': [
        `How to Use ${keyword}: Step-by-Step Guide`,
        `${keyword} Tutorial: Getting Started`,
        `How to Set Up ${keyword} in Minutes`,
        `${keyword} Setup Guide: Quick and Easy`
      ]
    }
    
    return templates[contentType] || templates.guide
  }
}