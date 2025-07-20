import { EnhancedPlan } from '@/lib/services/provider-manager'

export function shouldKeepPlan(plan: EnhancedPlan): boolean {
  const dataInMB = plan.dataInMB
  const days = plan.days
  
  // Basic quality filters - remove obviously unreasonable plans
  if (!plan.inStock || plan.price <= 0 || dataInMB <= 0 || days <= 0) {
    return false
  }
  
  // Remove plans with unreasonable pricing (more than $10 per GB)
  const dataInGB = dataInMB / 1024
  const pricePerGB = plan.price / dataInGB
  if (pricePerGB > 10) {
    return false
  }
  
  // Remove plans with extremely short validity (less than 1 day) or extremely long (more than 90 days)
  if (days < 1 || days > 90) {
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
  
  // If no plans available, return empty (we can't generate from nothing)
  if (availablePlans.length === 0) {
    console.log(`⚠️ Cannot generate plans for ${countryInfo.country}: no base plans available`)
    return []
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
  // Step 1: Filter out unreasonable plans
  const qualityFiltered = plans.filter(shouldKeepPlan)
  
  // Step 2: Deduplicate plans (prefer shorter duration)
  const deduplicated = deduplicatePlans(qualityFiltered)
  
  // Step 3: Generate missing standard plans if country info provided
  let finalPlans = deduplicated
  if (countryInfo && deduplicated.length > 0) {
    const generated = generateMissingPlans(deduplicated, countryInfo)
    finalPlans = [...deduplicated, ...generated].sort((a, b) => {
      const aGB = a.dataInMB / 1024
      const bGB = b.dataInMB / 1024
      return aGB - bGB
    })
  }
  
  // Log filtering summary
  const originalCount = plans.length
  const filteredCount = finalPlans.length
  const generatedCount = finalPlans.length - deduplicated.length
  
  console.log(`🔍 Plan filtering summary: Kept ${deduplicated.length}/${originalCount} plans, generated ${generatedCount} missing plans`)
  
  if (originalCount - deduplicated.length > 0) {
    console.log(`📊 Filtered out plans with: unreasonable pricing (>$10/GB), extreme durations (<1 or >90 days), tiny data (<100MB), or massive data (>100GB)`)
  }
  
  return finalPlans
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