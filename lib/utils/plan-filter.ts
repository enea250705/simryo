import { EnhancedPlan } from '@/lib/services/provider-manager'

export function shouldKeepPlan(plan: EnhancedPlan): boolean {
  const dataInMB = plan.dataInMB
  const days = plan.days
  
  // Special exception for China regions - remove ALL filters
  const chinaRegions = ['china mainland', 'hong kong', 'macao', 'china', 'hongkong', 'china-mainland', 'hong-kong']
  const isChina = chinaRegions.some(region => 
    plan.country.toLowerCase().includes(region) || 
    plan.countryCode.toLowerCase().includes('cn') ||
    plan.countryCode.toLowerCase().includes('hk') ||
    plan.countryCode.toLowerCase().includes('mo')
  )
  
  if (isChina) {
    // For China regions, bypass price and data filters but still enforce minimum reasonable duration
    console.log(`🇨🇳 China region detected for plan: "${plan.country}" (${plan.countryCode}) - bypassing price/data filters only`)
    return plan.inStock && plan.price > 0 && dataInMB > 0 && days >= 3 && days <= 90
  }
  
  // Basic quality filters for other countries - remove obviously unreasonable plans
  if (!plan.inStock || plan.price <= 0 || dataInMB <= 0 || days <= 0) {
    return false
  }
  
  // Remove plans with unreasonable pricing (more than $10 per GB)
  const dataInGB = dataInMB / 1024
  const pricePerGB = plan.price / dataInGB
  if (pricePerGB > 10) {
    return false
  }
  
  // Remove plans with extremely short validity (less than 3 days) or extremely long (more than 90 days)
  // 1-2 day plans are impractical for travel
  if (days < 3 || days > 90) {
    return false
  }
  
  // Remove plans with tiny data amounts (less than 100MB) or massive amounts (more than 100GB)
  if (dataInMB < 100 || dataInMB > 102400) {
    return false
  }
  
  return true
}

export function deduplicatePlans(plans: EnhancedPlan[]): EnhancedPlan[] {
  const planMap = new Map<string, EnhancedPlan>()
  
  plans.forEach(plan => {
    const dataInGB = Math.round(plan.dataInMB / 1024)
    const key = `${dataInGB}GB`
    
    const existingPlan = planMap.get(key)
    
    if (!existingPlan) {
      // No plan for this data amount yet, add it
      planMap.set(key, plan)
    } else {
      // Plan exists, prefer the one with shorter duration (15 days over 30 days)
      if (plan.days < existingPlan.days) {
        planMap.set(key, plan)
      } else if (plan.days === existingPlan.days && plan.price < existingPlan.price) {
        // Same duration, prefer cheaper price
        planMap.set(key, plan)
      }
    }
  })
  
  return Array.from(planMap.values())
}

export function generateMissingPlans(availablePlans: EnhancedPlan[], countryInfo: { country: string, flag: string, region: string }): EnhancedPlan[] {
  const targetDataAmounts = [1, 3, 5, 10, 20] // GB
  const generatedPlans: EnhancedPlan[] = []
  
  // Check if this is a China region
  const chinaRegions = ['china mainland', 'hong kong', 'macao', 'china', 'hongkong', 'china-mainland', 'hong-kong']
  const isChina = chinaRegions.some(region => countryInfo.country.toLowerCase().includes(region))
  
  console.log(`🔍 Checking if "${countryInfo.country}" is China region: ${isChina}`)
  
  // If no plans available, try to generate basic plans for China regions
  if (availablePlans.length === 0) {
    if (isChina) {
      console.log(`🇨🇳 Generating basic plans for ${countryInfo.country} (China region with no base plans)`)
      // Generate basic plans with reasonable pricing for China
      const basicPlans = [
        { data: 1, price: 8.99, days: 7 },
        { data: 3, price: 15.99, days: 15 },
        { data: 5, price: 24.99, days: 30 },
        { data: 10, price: 39.99, days: 30 },
        { data: 20, price: 69.99, days: 30 }
      ]
      
      return basicPlans.map((basicPlan, index) => ({
        id: `generated-china-${countryInfo.country.toLowerCase().replace(/\s+/g, '-')}-${basicPlan.data}gb`,
        country: countryInfo.country,
        countryCode: countryInfo.country.toLowerCase().includes('hong kong') ? 'HK' : 
                     countryInfo.country.toLowerCase().includes('macao') ? 'MO' : 'CN',
        region: countryInfo.region,
        flag: countryInfo.flag,
        data: `${basicPlan.data}GB`,
        dataInMB: basicPlan.data * 1024,
        days: basicPlan.days,
        price: basicPlan.price,
        currency: 'EUR',
        network: {
          type: '4G/5G',
          carriers: ['China Mobile', 'China Unicom', 'China Telecom'],
          coverage: 'National'
        },
        features: ['Instant Activation', 'No Contracts', '24/7 Support'],
        inStock: true,
        providerId: 'generated-china',
        providerDisplayName: 'SIMRYO (China)',
        popularity: 50 + index,
        lastUpdated: new Date(),
        featured: index === 1, // Make 3GB featured
        popular: index === 1
      } as EnhancedPlan))
    } else {
      console.log(`⚠️ Cannot generate plans for ${countryInfo.country}: no base plans available`)
      return []
    }
  }
  
  // Get existing data amounts
  const existingDataAmounts = availablePlans.map(plan => Math.round(plan.dataInMB / 1024))
  console.log(`📋 ${countryInfo.country} existing data amounts: ${existingDataAmounts.join(', ')}GB`)
  
  targetDataAmounts.forEach(targetGB => {
    if (!existingDataAmounts.includes(targetGB)) {
      // Find the closest available plan to base pricing on
      const closestPlan = availablePlans.reduce((closest, plan) => {
        const planGB = plan.dataInMB / 1024
        const targetDiff = Math.abs(planGB - targetGB)
        const closestDiff = Math.abs((closest.dataInMB / 1024) - targetGB)
        return targetDiff < closestDiff ? plan : closest
      })
      
      if (closestPlan) {
        // Calculate price based on closest plan's per-GB rate, but cap it at reasonable levels
        const basePricePerGB = closestPlan.price / (closestPlan.dataInMB / 1024)
        let adjustedPricePerGB = basePricePerGB
        
        // Adjust pricing scale - smaller plans can be more expensive per GB
        if (targetGB <= 1) {
          adjustedPricePerGB = Math.min(basePricePerGB, 8) // Max $8/GB for 1GB plans
        } else if (targetGB <= 5) {
          adjustedPricePerGB = Math.min(basePricePerGB, 5) // Max $5/GB for small plans
        } else {
          adjustedPricePerGB = Math.min(basePricePerGB, 3) // Max $3/GB for large plans
        }
        
        const newPrice = Math.round(adjustedPricePerGB * targetGB * 100) / 100
        
        // Prefer 15 days for 3GB, 30 days for others
        const preferredDuration = targetGB === 3 ? 15 : 30
        
        const generatedPlan: EnhancedPlan = {
          ...closestPlan,
          id: `generated-${countryInfo.country.toLowerCase().replace(/\s+/g, '-')}-${targetGB}gb`,
          data: `${targetGB}GB`,
          dataInMB: targetGB * 1024,
          days: preferredDuration,
          price: newPrice,
          providerDisplayName: `${closestPlan.providerDisplayName} (Generated)`,
          popular: false,
          featured: false
        }
        
        console.log(`✨ Generated ${targetGB}GB plan for ${countryInfo.country}: €${newPrice} (${adjustedPricePerGB.toFixed(2)}/GB)`)
        generatedPlans.push(generatedPlan)
      }
    }
  })
  
  return generatedPlans
}

export function filterAllowedPlans(plans: EnhancedPlan[], countryInfo?: { country: string, flag: string, region: string }): EnhancedPlan[] {
  const filtered = plans.filter(shouldKeepPlan)
  return filtered.sort((a, b) => a.dataInMB - b.dataInMB || a.days - b.days)
}

export function getFilteringSummary(originalPlans: EnhancedPlan[], filteredPlans: EnhancedPlan[]) {
  const originalCount = originalPlans.length
  const filteredCount = filteredPlans.length
  const removedCount = originalCount - filteredCount
  
  return {
    originalCount,
    filteredCount,
    removedCount,
    percentageKept: originalCount > 0 ? Math.round((filteredCount / originalCount) * 100) : 0
  }
}