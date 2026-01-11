/**
 * API URL utility functions
 * Handles normalization of API URLs to prevent double /api/api/ paths
 */

/**
 * Get the normalized API base URL
 * Removes trailing slashes and ensures it doesn't end with /api
 * Automatically converts HTTP to HTTPS in production or when page is loaded over HTTPS
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
  
  // Convert HTTP to HTTPS if:
  // 1. We're in production (not localhost)
  // 2. The page is loaded over HTTPS (if running in browser)
  // 3. The URL is not localhost
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalhost = normalized.includes('localhost') || normalized.includes('127.0.0.1') || normalized.startsWith('http://192.');
  
  if (!isLocalhost && (isProduction || isHttpsPage) && normalized.startsWith('http://')) {
    normalized = normalized.replace('http://', 'https://');
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API] Converted HTTP to HTTPS:', apiUrl, '->', normalized);
    }
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug('[API] Original URL:', apiUrl, 'Normalized:', normalized);
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

