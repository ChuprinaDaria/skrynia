import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detect Facebook crawler
  const isFacebookBot = 
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('Facebot') ||
    userAgent.includes('facebookcatalog');
  
  // Detect other social media crawlers
  const isSocialBot = 
    isFacebookBot ||
    userAgent.includes('Twitterbot') ||
    userAgent.includes('LinkedInBot') ||
    userAgent.includes('WhatsApp') ||
    userAgent.includes('TelegramBot') ||
    userAgent.includes('SkypeUriPreview') ||
    userAgent.includes('Slackbot') ||
    userAgent.includes('Applebot') ||
    userAgent.includes('Googlebot');
  
  // Add header to identify bot requests
  if (isSocialBot) {
    const response = NextResponse.next();
    response.headers.set('X-Social-Bot', 'true');
    response.headers.set('X-User-Agent', userAgent);
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

