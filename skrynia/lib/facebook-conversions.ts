/**
 * Facebook Conversions API client for frontend.
 * 
 * Sends events to backend API which forwards them to Facebook Conversions API.
 * This provides server-side tracking that bypasses ad blockers.
 */

import { getApiEndpoint } from './api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

interface UserData {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  external_id?: string;
  fbc?: string; // Facebook Click ID from _fbc cookie
  fbp?: string; // Facebook Browser ID from _fbp cookie
}

interface ContentItem {
  id?: string;
  quantity?: number;
  item_price?: number;
}

interface CustomData {
  value?: number;
  currency?: string;
  content_ids?: string[];
  contents?: ContentItem[];
  content_name?: string;
  content_category?: string;
  num_items?: number;
}

interface FacebookEvent {
  event_name: string;
  event_time?: number;
  event_id?: string;
  event_source_url?: string;
  action_source?: string;
  user_data?: UserData;
  custom_data?: CustomData;
  test_event_code?: string;
}

/**
 * Get Facebook cookies (_fbc and _fbp) if available.
 */
function getFacebookCookies(): { fbc?: string; fbp?: string } {
  if (typeof document === 'undefined') return {};
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return {
    fbc: cookies['_fbc'],
    fbp: cookies['_fbp'],
  };
}

/**
 * Get current page URL.
 */
function getCurrentUrl(): string {
  if (typeof window === 'undefined') return siteUrl;
  return window.location.href;
}

/**
 * Send event to Facebook Conversions API via backend.
 */
export async function sendFacebookEvent(event: FacebookEvent): Promise<boolean> {
  try {
    // Get Facebook cookies
    const { fbc, fbp } = getFacebookCookies();
    
    // Add cookies to user_data if not provided
    if (event.user_data) {
      event.user_data.fbc = event.user_data.fbc || fbc;
      event.user_data.fbp = event.user_data.fbp || fbp;
    } else if (fbc || fbp) {
      event.user_data = {
        fbc,
        fbp,
      };
    }
    
    // Set event_source_url if not provided
    if (!event.event_source_url) {
      event.event_source_url = getCurrentUrl();
    }
    
    // Set event_time if not provided
    if (!event.event_time) {
      event.event_time = Math.floor(Date.now() / 1000);
    }
    
    // Generate event_id if not provided
    if (!event.event_id) {
      event.event_id = `${event.event_name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Send to backend API
    const response = await fetch(getApiEndpoint('/api/v1/facebook/track'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      console.error('[Facebook Conversions API] Request failed:', response.status, response.statusText);
      return false;
    }
    
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    // Fail silently to not break user flow
    console.error('[Facebook Conversions API] Error:', error);
    return false;
  }
}

/**
 * Send AddToCart event.
 */
export async function trackAddToCart(data: {
  content_name: string;
  content_ids: string[];
  value: number;
  currency?: string;
  content_type?: string;
  user_data?: UserData;
}): Promise<boolean> {
  return sendFacebookEvent({
    event_name: 'AddToCart',
    custom_data: {
      content_name: data.content_name,
      content_ids: data.content_ids,
      content_type: data.content_type || 'product',
      value: data.value,
      currency: data.currency || 'PLN',
      num_items: 1,
    },
    user_data: data.user_data,
  });
}

/**
 * Send InitiateCheckout event.
 */
export async function trackInitiateCheckout(data: {
  content_ids: string[];
  contents: ContentItem[];
  value: number;
  currency?: string;
  num_items: number;
  user_data?: UserData;
}): Promise<boolean> {
  return sendFacebookEvent({
    event_name: 'InitiateCheckout',
    custom_data: {
      content_ids: data.content_ids,
      contents: data.contents,
      value: data.value,
      currency: data.currency || 'PLN',
      num_items: data.num_items,
    },
    user_data: data.user_data,
  });
}

/**
 * Send Purchase event.
 */
export async function trackPurchase(data: {
  content_ids: string[];
  contents: ContentItem[];
  value: number;
  currency?: string;
  num_items: number;
  user_data?: UserData;
}): Promise<boolean> {
  return sendFacebookEvent({
    event_name: 'Purchase',
    custom_data: {
      content_ids: data.content_ids,
      contents: data.contents,
      value: data.value,
      currency: data.currency || 'PLN',
      num_items: data.num_items,
    },
    user_data: data.user_data,
  });
}

/**
 * Send ViewContent event (for product pages).
 */
export async function trackViewContent(data: {
  content_ids: string[];
  content_name?: string;
  content_type?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  user_data?: UserData;
}): Promise<boolean> {
  return sendFacebookEvent({
    event_name: 'ViewContent',
    custom_data: {
      content_ids: data.content_ids,
      content_name: data.content_name,
      content_type: data.content_type || 'product',
      content_category: data.content_category,
      value: data.value,
      currency: data.currency || 'PLN',
    },
    user_data: data.user_data,
  });
}

/**
 * Send PageView event.
 */
export async function trackPageView(data?: {
  user_data?: UserData;
}): Promise<boolean> {
  return sendFacebookEvent({
    event_name: 'PageView',
    user_data: data?.user_data,
  });
}

