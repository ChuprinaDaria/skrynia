'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface InPostPoint {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    city: string;
    post_code: string;
    country_code: string;
  };
}

type GeowidgetVersion = 'v5' | 'international';

interface InPostGeowidgetProps {
  /** PUBLIC token from Parcel Manager */
  token: string;
  /** Geowidget version: 'v5' for PL Market, 'international' for multi-country */
  version?: GeowidgetVersion;
  /** Comma-separated country codes (PL,BE,IT,FR,LU,PT,ES,NL). Only for International version. First value is default map location */
  country?: string;
  /** Widget language: pl, en, uk (v5) or pl, en, uk, es, fr, pt, it (International) */
  language?: 'pl' | 'en' | 'uk' | 'es' | 'fr' | 'pt' | 'it';
  /** Configuration for point types: parcelCollect, parcelCollectPayment, parcelCollect247, parcelSend, cooledDeposit */
  config?: 'parcelCollect' | 'parcelCollectPayment' | 'parcelCollect247' | 'parcelSend' | 'cooledDeposit';
  /** Callback when point is selected */
  onPointSelect?: (point: InPostPoint) => void;
  /** Use sandbox environment */
  sandbox?: boolean;
  /** Widget element ID for API access */
  widgetId?: string;
}

/**
 * InPost Geowidget Component
 * 
 * Displays InPost pickup point selector widget.
 * Supports both Geowidget v5 (PL Market) and Geowidget International.
 * 
 * @example
 * ```tsx
 * // Geowidget International (multi-country)
 * <InPostGeowidget
 *   token="your-token-here"
 *   version="international"
 *   country="PL,NL"
 *   language="pl"
 *   config="parcelCollect"
 *   onPointSelect={(point) => console.log('Selected:', point.name)}
 * />
 * 
 * // Geowidget v5 (PL Market only)
 * <InPostGeowidget
 *   token="your-token-here"
 *   version="v5"
 *   language="pl"
 *   config="parcelCollect"
 *   onPointSelect={(point) => console.log('Selected:', point.name)}
 * />
 * ```
 */
export function InPostGeowidget({
  token,
  version = 'international',
  country = 'PL',
  language = 'pl',
  config = 'parcelCollect',
  onPointSelect,
  sandbox = false,
  widgetId = 'inpost-geowidget'
}: InPostGeowidgetProps) {
  const widgetRef = useRef<HTMLElement>(null);
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate script loading
    if (scriptsLoadedRef.current) {
      return;
    }

    // Determine base URL based on version
    let baseUrl: string;
    if (version === 'v5') {
      baseUrl = sandbox
        ? 'https://sandbox-easy-geowidget-sdk.easypack24.net'
        : 'https://geowidget.inpost.pl';
    } else {
      // International version
      baseUrl = sandbox
        ? 'https://sandbox-global-geowidget-sdk.easypack24.net'
        : 'https://geowidget.inpost-group.com';
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${baseUrl}/inpost-geowidget.css`;
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = `${baseUrl}/inpost-geowidget.js`;
    script.defer = true;
    script.onload = () => {
      scriptsLoadedRef.current = true;
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingLink = document.querySelector(`link[href="${link.href}"]`);
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingLink) document.head.removeChild(existingLink);
      if (existingScript) document.head.removeChild(existingScript);
      scriptsLoadedRef.current = false;
    };
  }, [sandbox, version]);

  useEffect(() => {
    if (!onPointSelect) return;

    // Handle point selection event according to Geowidget International documentation
    // The event can be either CustomEvent with details or a direct function call
    const handlePointSelect = (event: Event | any) => {
      let pointData: any;
      
      // Check if it's a CustomEvent (from addEventListener)
      if (event instanceof CustomEvent) {
        pointData = (event as any).detail || (event as any).details;
      } 
      // Check if it's a direct function call (from onpoint parameter)
      else if (event && typeof event === 'object') {
        pointData = event;
      }
      
      if (pointData) {
        // Map the point data to our InPostPoint interface
        // Geowidget International returns point data in different formats
        const point: InPostPoint = {
          name: pointData.name || pointData.location?.name || pointData.location_name || '',
          location: {
            latitude: pointData.location?.latitude || pointData.latitude || pointData.location?.lat || 0,
            longitude: pointData.location?.longitude || pointData.longitude || pointData.location?.lng || 0,
          },
          address: {
            street: pointData.address?.street || pointData.street || pointData.address_line1 || '',
            city: pointData.address?.city || pointData.city || '',
            post_code: pointData.address?.post_code || pointData.post_code || pointData.postal_code || pointData.address?.postal_code || '',
            country_code: pointData.address?.country_code || pointData.country_code || pointData.country || '',
          },
        };
        onPointSelect(point);
      }
    };

    // Listen for the onpointselect event on document (for complete integration)
    document.addEventListener('onpointselect', handlePointSelect);

    return () => {
      document.removeEventListener('onpointselect', handlePointSelect);
    };
  }, [onPointSelect]);

  // Build widget props
  const widgetProps: any = {
    ref: widgetRef,
    id: widgetId,
    token,
    language,
    config,
    onpoint: 'onpointselect'
  };

  // Country prop only for International version (v5 does NOT use country parameter)
  if (version === 'international' && country) {
    widgetProps.country = country;
  }

  // Use React.createElement to avoid TypeScript JSX type checking issues
  // @ts-ignore - Custom HTML element not in JSX.IntrinsicElements
  return React.createElement('inpost-geowidget', {
    ...widgetProps,
    style: { width: '100%', height: '100%', display: 'block' }
  });
}

/**
 * Hook to access Geowidget API
 * 
 * @example
 * ```tsx
 * const { api, isReady } = useGeowidgetAPI('inpost-geowidget');
 * 
 * useEffect(() => {
 *   if (isReady && api) {
 *     api.changePosition({ longitude: 20.318968, latitude: 49.731131 }, 16);
 *   }
 * }, [isReady, api]);
 * ```
 */
export function useGeowidgetAPI(widgetId: string = 'inpost-geowidget') {
  const [api, setApi] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const widget = document.getElementById(widgetId);
    if (!widget) return;

    const handleInit = (event: CustomEvent) => {
      setApi(event.detail.api);
      setIsReady(true);
    };

    widget.addEventListener('inpost.geowidget.init', handleInit as EventListener);

    return () => {
      widget.removeEventListener('inpost.geowidget.init', handleInit as EventListener);
    };
  }, [widgetId]);

  return { api, isReady };
}

