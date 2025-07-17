// Promotion Manager Service
import { ProviderPlan } from './providers/base-provider'

export interface Promotion {
  id: string
  type: 'first_time_user' | 'seasonal' | 'referral'
  discountPercentage: number
  discountFixed?: number
  startDate: Date
  endDate?: Date
  minimumPurchase?: number
  maxDiscount?: number
  code?: string
}

export class PromotionManager {
  private static instance: PromotionManager
  private promotions: Map<string, Promotion> = new Map()

  private constructor() {
    // Initialize default promotions
    this.addPromotion({
      id: 'first-time-user',
      type: 'first_time_user',
      discountPercentage: 15,
      startDate: new Date('2024-01-01'),
      code: 'WELCOME15'
    })
  }

  public static getInstance(): PromotionManager {
    if (!PromotionManager.instance) {
      PromotionManager.instance = new PromotionManager()
    }
    return PromotionManager.instance
  }

  public addPromotion(promotion: Promotion) {
    this.promotions.set(promotion.id, promotion)
  }

  public getPromotion(id: string): Promotion | undefined {
    return this.promotions.get(id)
  }

  public getFirstTimeUserPromotion(): Promotion | undefined {
    return Array.from(this.promotions.values())
      .find(promo => promo.type === 'first_time_user' && 
        (!promo.endDate || promo.endDate > new Date()))
  }

  public applyPromotion(plan: ProviderPlan, promotion: Promotion): ProviderPlan {
    let discountedPrice = plan.price

    if (promotion.discountPercentage) {
      discountedPrice *= (1 - promotion.discountPercentage / 100)
    }

    if (promotion.discountFixed) {
      discountedPrice -= promotion.discountFixed
    }

    if (promotion.maxDiscount) {
      const discount = plan.price - discountedPrice
      if (discount > promotion.maxDiscount) {
        discountedPrice = plan.price - promotion.maxDiscount
      }
    }

    if (promotion.minimumPurchase && plan.price < promotion.minimumPurchase) {
      return plan
    }

    // Round up to nearest dollar and subtract 0.01 to maintain .99 pricing
    discountedPrice = Math.ceil(discountedPrice) - 0.01

    return {
      ...plan,
      price: discountedPrice,
      promoApplied: {
        id: promotion.id,
        originalPrice: plan.price,
        savings: Number((plan.price - discountedPrice).toFixed(2))
      }
    }
  }

  public isFirstTimeUser(userId: string): Promise<boolean> {
    // In production, this would check the user's purchase history
    // For now, we'll simulate this with localStorage or a similar mechanism
    return Promise.resolve(true)
  }
} 