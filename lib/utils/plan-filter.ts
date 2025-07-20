import { EnhancedPlan } from '@/lib/services/provider-manager'

export function shouldKeepPlan(plan: EnhancedPlan): boolean {
  const dataInGB = Math.round(plan.dataInMB / 1024)
  const days = plan.days
  
  const allowedPlans = [
    { data: 1, days: 7 },
    { data: 3, days: 15 },
    { data: 3, days: 30 },
    { data: 5, days: 30 },
    { data: 10, days: 30 },
    { data: 20, days: 30 },
    { data: 50, days: 30 }
  ]
  
  return allowedPlans.some(allowedPlan => 
    dataInGB === allowedPlan.data && days === allowedPlan.days
  )
}

export function filterAllowedPlans(plans: EnhancedPlan[]): EnhancedPlan[] {
  return plans.filter(shouldKeepPlan)
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