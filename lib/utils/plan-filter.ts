import { EnhancedPlan } from '@/lib/services/provider-manager'

export function shouldKeepPlan(plan: EnhancedPlan): boolean {
  const dataInMB = plan.dataInMB
  const days = plan.days
  
  // Basic quality filters - remove obviously unreasonable plans
  if (!plan.inStock || plan.price <= 0 || dataInMB <= 0 || days <= 0) {
    return false
  }
  
  // Remove plans with unreasonable pricing (more than $2 per GB)
  const pricePerGB = plan.price / (dataInMB / 1024)
  if (pricePerGB > 2) {
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
  
  // Prefer common duration patterns but don't be too restrictive
  const preferredDurations = [1, 3, 5, 7, 10, 14, 15, 21, 30, 60, 90]
  const hasReasonableDuration = preferredDurations.some(duration => Math.abs(days - duration) <= 2)
  
  // Prefer standard data amounts but allow flexibility
  const dataInGB = dataInMB / 1024
  const hasReasonableData = dataInGB >= 0.1 && dataInGB <= 100
  
  return hasReasonableDuration && hasReasonableData
}

export function filterAllowedPlans(plans: EnhancedPlan[]): EnhancedPlan[] {
  const filteredPlans = plans.filter(shouldKeepPlan)
  
  // Log filtering summary
  const originalCount = plans.length
  const filteredCount = filteredPlans.length
  const removedCount = originalCount - filteredCount
  
  console.log(`🔍 Plan filtering summary: Kept ${filteredCount}/${originalCount} plans (${removedCount} filtered out)`)
  
  if (removedCount > 0) {
    console.log(`📊 Filtered out plans with: unreasonable pricing (>$2/GB), extreme durations (<1 or >90 days), tiny data (<100MB), or massive data (>100GB)`)
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