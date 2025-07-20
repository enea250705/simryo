import { EnhancedPlan } from '@/lib/services/provider-manager'

export function shouldKeepPlan(plan: EnhancedPlan): boolean {
  const dataInMB = plan.dataInMB
  const days = plan.days
  
  // Only allow specific data/validity combinations as requested:
  // 1GB/7days, 3GB/30days, 3GB/15days, 5GB/30days, 10GB/30days, 20GB/30days, 50GB/30days
  const allowedPlans = [
    { dataInMB: 1024, days: 7 },      // 1GB/7days
    { dataInMB: 3072, days: 30 },     // 3GB/30days  
    { dataInMB: 3072, days: 15 },     // 3GB/15days
    { dataInMB: 5120, days: 30 },     // 5GB/30days
    { dataInMB: 10240, days: 30 },    // 10GB/30days
    { dataInMB: 20480, days: 30 },    // 20GB/30days
    { dataInMB: 51200, days: 30 }     // 50GB/30days
  ]
  
  return allowedPlans.some(allowedPlan => {
    // Allow for small variations in data size (±50MB) to handle API inconsistencies
    const dataMatch = Math.abs(dataInMB - allowedPlan.dataInMB) <= 50
    const daysMatch = days === allowedPlan.days
    
    return dataMatch && daysMatch
  })
}

export function filterAllowedPlans(plans: EnhancedPlan[]): EnhancedPlan[] {
  const filteredPlans = plans.filter(shouldKeepPlan)
  
  // Log filtering summary
  const originalCount = plans.length
  const filteredCount = filteredPlans.length
  const removedCount = originalCount - filteredCount
  
  console.log(`🔍 Plan filtering summary: Kept ${filteredCount}/${originalCount} plans (${removedCount} filtered out)`)
  
  if (removedCount > 0) {
    console.log(`📊 Filtered out plan combinations that don't match: 1GB/7d, 3GB/15d, 3GB/30d, 5GB/30d, 10GB/30d, 20GB/30d, 50GB/30d`)
  }
  
  return filteredPlans
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