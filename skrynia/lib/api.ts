/**
 * API URL utility functions
 * Handles normalization of API URLs to prevent double /api/api/ paths
 */

/**
 * Get the normalized API base URL
 * Removes trailing slashes and ensures it doesn't end with /api
 * Automatically converts HTTP to HTTPS in production (works for both SSR and client)
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Remove trailing slashes
  let normalized = apiUrl.trim().replace(/\/+$/, '');
  
  // If the URL ends with /api, remove it to prevent double /api/api/ paths
  // This handles cases where NEXT_PUBLIC_API_URL is set to something like "https://runebox.eu/api"
  if (normalized.endsWith('/api')) {
    normalized = normalized.slice(0, -4);
  }
  
  // Check if URL is localhost/127.0.0.1/192.x.x.x (local development)
  const isLocalhost = 
    normalized.includes('localhost') || 
    normalized.includes('127.0.0.1') || 
    normalized.startsWith('http://192.');
  
  // PRIORITY 1: If domain is runebox.eu or api.runebox.eu, ALWAYS use HTTPS (unless localhost)
  // This ensures production domains always use HTTPS regardless of other conditions
  // This is critical for preventing mixed content errors
  if (!isLocalhost && normalized.startsWith('http://') && (normalized.includes('runebox.eu') || normalized.includes('api.runebox.eu'))) {
    normalized = normalized.replace('http://', 'https://');
  }
  
  // PRIORITY 2: Check if we're in production or if the page is loaded over HTTPS
  const isProduction = process.env.NODE_ENV === 'production';
  const isPageHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  // Convert HTTP to HTTPS if:
  // 1. Not localhost AND (production OR page is loaded over HTTPS)
  // This ensures HTTPS is always used in production and when the page is served over HTTPS
  // (Note: runebox.eu domains are already handled above)
  if (!isLocalhost && normalized.startsWith('http://') && (isProduction || isPageHttps)) {
    normalized = normalized.replace('http://', 'https://');
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug('[API] Original URL:', apiUrl, 'Normalized:', normalized, 'isProduction:', isProduction, 'isPageHttps:', isPageHttps);
  }
  
  return normalized;
}

/**
 * Build a full API endpoint URL
 * @param endpoint - The API endpoint path (e.g., "/api/v1/contact-info/" or "api/v1/contact-info/")
 * @returns The full URL to the API endpoint
 */
export function getApiEndpoint(endpoint: string): string {
  const baseUrl = getApiUrl();
  
  // Ensure endpoint starts with /
  let normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Remove any duplicate /api/ in the endpoint path
  // This handles cases where endpoint might already contain /api/
  normalizedEndpoint = normalizedEndpoint.replace(/\/api\/api\//g, '/api/');
  
  const fullUrl = `${baseUrl}${normalizedEndpoint}`;
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug('[API] Endpoint:', endpoint, 'Full URL:', fullUrl);
  }
  
  return fullUrl;
}

/**
 * Normalize image URL - converts relative paths to absolute URLs
 * Handles both relative paths (/static/uploads/...) and absolute URLs
 * @param imageUrl - The image URL (can be relative or absolute)
 * @returns The normalized absolute URL
 */
export function normalizeImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/images/products/placeholder.jpg';
  }

  // If already absolute URL (http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If relative path starting with /static/ or /uploads/, use backend URL
  if (imageUrl.startsWith('/static/') || imageUrl.startsWith('/uploads/')) {
    const backendBase = getApiUrl().replace(/\/api$/, '').replace(/\/$/, '');
    return `${backendBase}${imageUrl}`;
  }

  // If relative path starting with /, assume it's a frontend public asset
  if (imageUrl.startsWith('/')) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';
    return `${siteUrl}${imageUrl}`;
  }

  // Fallback: treat as relative path from site root
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';
  return `${siteUrl}/${imageUrl}`;
}

