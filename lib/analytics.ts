// Google Analytics utility functions
import { event } from '@/components/analytics/google-analytics'

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XTN13B7FTE', {
      page_path: url,
    })
  }
}

// Track user interactions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// Predefined event tracking functions for common actions
export const analytics = {
  // E-commerce events
  addToCart: (planId: string, country: string, price: number) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: planId,
        item_name: `eSIM Plan - ${country}`,
        category: 'eSIM Plans',
        price: price,
        quantity: 1
      }]
    })
  },

  removeFromCart: (planId: string, country: string, price: number) => {
    trackEvent('remove_from_cart', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: planId,
        item_name: `eSIM Plan - ${country}`,
        category: 'eSIM Plans',
        price: price,
        quantity: 1
      }]
    })
  },

  beginCheckout: (value: number, items: any[]) => {
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: value,
      items: items
    })
  },

  purchase: (transactionId: string, value: number, items: any[]) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      currency: 'USD',
      value: value,
      items: items
    })
  },

  // User engagement events
  viewPlan: (planId: string, country: string) => {
    trackEvent('view_item', {
      currency: 'USD',
      items: [{
        item_id: planId,
        item_name: `eSIM Plan - ${country}`,
        category: 'eSIM Plans'
      }]
    })
  },

  searchPlans: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm
    })
  },

  selectCountry: (country: string) => {
    trackEvent('select_content', {
      content_type: 'country',
      content_id: country
    })
  },

  // Contact and support events
  contactForm: (subject: string) => {
    trackEvent('contact_form_submit', {
      form_type: 'contact',
      subject: subject
    })
  },

  supportInteraction: (type: string) => {
    trackEvent('support_interaction', {
      interaction_type: type
    })
  },

  // Navigation events
  clickCTA: (ctaName: string, location: string) => {
    trackEvent('click_cta', {
      cta_name: ctaName,
      cta_location: location
    })
  },

  // Custom events
  customEvent: (eventName: string, parameters?: Record<string, any>) => {
    trackEvent(eventName, parameters)
  }
}

// Enhanced ecommerce tracking
export const ecommerce = {
  // Track product list views
  viewItemList: (listName: string, items: any[]) => {
    trackEvent('view_item_list', {
      item_list_name: listName,
      items: items
    })
  },

  // Track individual item views
  viewItem: (item: any) => {
    trackEvent('view_item', {
      currency: 'USD',
      value: item.price,
      items: [item]
    })
  },

  // Track cart actions
  addToCart: (items: any[]) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: items.reduce((sum, item) => sum + item.price, 0),
      items: items
    })
  }
}

// User identification (for authenticated users)
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XTN13B7FTE', {
      user_id: userId,
      ...properties
    })
  }
}

// Set custom dimensions
export const setCustomDimension = (index: number, value: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XTN13B7FTE', {
      [`custom_map.dimension${index}`]: value
    })
  }
}