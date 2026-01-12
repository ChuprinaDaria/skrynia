# InPost Geowidget Integration Guide

## Overview

Geowidget is a JavaScript widget provided by InPost for selecting Pick Up Drop Off (PUDO) locations like Parcel Lockers, Click & Collect points, and Customer Service Points.

There are two versions:
- **Geowidget International** (recommended for multi-country) - Modern widget using custom HTML elements, supports multiple countries (PL, BE, IT, FR, LU, PT, ES, NL)
- **Geowidget v5** (PL Market) - Widget designed specifically for Polish market, simpler integration

The widget consists of:
- **Points API backend** - provides data to the widget
- **JavaScript component** - frontend that displays PUDO locations on Map/List
- **Responsive Design** - works on Desktop and Mobile devices

## Geowidget International

### Environments

#### Production
- **Widget URL**: `https://geowidget.inpost-group.com`
- **Manager**: https://manager.paczkomaty.pl

#### Test/Sandbox
- **Widget URL**: `https://sandbox-global-geowidget-sdk.easypack24.net/`
- **Manager**: https://sandbox-manager.paczkomaty.pl
- **API Docs**: https://sandbox-global-geowidget-sdk.easypack24.net/docs/interfaces/ApiInterface.html

### Generating Access Token

1. Go to Parcel Manager (production or sandbox)
2. Login with your credentials
3. Go to **My Account** → **API** tab
4. Expand **Geowidget** section
5. Click **Generate** to create a PUBLIC token
6. **Important for sandbox**: When using localhost, do NOT indicate the domain when generating the token

**Requirements**: Company address and invoice data must be filled in before generating token.

### Basic Integration

Add to your HTML page header:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://sandbox-global-geowidget-sdk.easypack24.net/inpost-geowidget.css"/>

<!-- JavaScript -->
<script src='https://sandbox-global-geowidget-sdk.easypack24.net/inpost-geowidget.js' defer></script>

<!-- Callback function -->
<script> 
  function afterPointSelected(point) { 
    console.log('Selected point:', point.name);
    // Handle point selection
    // point.name - point identifier (e.g., "KRA010")
    // point.location - coordinates
    // point.address - address details
  } 
</script>
```

Embed the widget:

```html
<inpost-geowidget 
  token='your-token-here' 
  country='PL,NL' 
  language='pl' 
  config='parcelcollect'
></inpost-geowidget>
```

### Complete Integration with Event Listener

```html
<!-- CSS and JS -->
<link rel="stylesheet" href="https://sandbox-global-geowidget-sdk.easypack24.net/inpost-geowidget.css"/>
<script src='https://sandbox-global-geowidget-sdk.easypack24.net/inpost-geowidget.js' defer></script>

<!-- Event listener -->
<script>
  document.addEventListener('onpointselect', (event) => {
    const point = event.details;
    console.log('Selected point:', point.name);
    // Handle point selection
  });
</script>

<!-- Widget -->
<inpost-geowidget 
  onpoint="onpointselect" 
  token='your-token-here' 
  country='PL,NL' 
  language='pl' 
  config='parcelcollect'
></inpost-geowidget>
```

### Next.js/React Integration

For Next.js, you need to use dynamic imports and handle the custom element:

```tsx
'use client';

import { useEffect, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'inpost-geowidget': {
        token: string;
        country: string;
        language?: string;
        config?: string;
        onpoint?: string;
        id?: string;
      };
    }
  }
}

interface Point {
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

export function InPostGeowidget({ 
  token, 
  onPointSelect 
}: { 
  token: string; 
  onPointSelect: (point: Point) => void;
}) {
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://sandbox-global-geowidget-sdk.easypack24.net/inpost-geowidget.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://sandbox-global-geowidget-sdk.easypack24.net/inpost-geowidget.js';
    script.defer = true;
    document.head.appendChild(script);

    // Event listener
    const handlePointSelect = (event: CustomEvent) => {
      onPointSelect(event.detail);
    };

    document.addEventListener('onpointselect', handlePointSelect as EventListener);

    return () => {
      document.removeEventListener('onpointselect', handlePointSelect as EventListener);
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, [onPointSelect]);

  return (
    <inpost-geowidget
      ref={widgetRef}
      token={token}
      country="PL"
      language="pl"
      config="parcelcollect"
      onpoint="onpointselect"
    />
  );
}
```

### Using Geowidget API

Access the API object for programmatic control:

```html
<inpost-geowidget 
  id="geowidget" 
  onpoint="handlePointSelection" 
  token='your-token-here' 
  country='PL,NL' 
  language='pl' 
  config='parcelCollect'
></inpost-geowidget>

<script>
  const geowidget = document.getElementById('geowidget');
  
  // Wait for widget initialization
  geowidget.addEventListener('inpost.geowidget.init', (event) => {
    const api = event.detail.api;
    
    // Change map position
    api.changePosition({ 
      longitude: 20.318968, 
      latitude: 49.731131 
    }, 16);
    
    // Other API methods available
    // See: https://sandbox-global-geowidget-sdk.easypack24.net/docs/interfaces/ApiInterface.html
  });
</script>
```

### Widget Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `token` | PUBLIC token from Parcel Manager | Yes |
| `country` | Comma-separated country codes (PL,BE,IT,FR,LU,PT,ES,NL). First value is default map location | Yes |
| `language` | Widget language: `pl`, `en`, `uk`, `es`, `fr`, `pt`, `it` | No |
| `config` | Configuration for point types (see below) | No |
| `onpoint` | Event name or function name for point selection callback | No |
| `id` | Element ID for API access | No |

### Configuration Options

| Config Value | Description | Functions | Countries |
|--------------|-------------|-----------|-----------|
| `parcelCollect` | Collection points for prepaid orders | `parcel_collect` | All |
| `parcelCollectPayment` | Collection points for COD orders | `parcel_collect` | PL |
| `parcelCollect247` | 24/7 collection points for Weekend shipments | `parcel_collect` | PL |
| `parcelSend` | Sender points | `parcel_send` | PL |
| `cooledDeposit` | APMX (Fridge modules) | `cool_parcel_collect` | PL |

### Supported Countries

- **PL** - Poland
- **BE** - Belgium
- **IT** - Italy
- **FR** - France
- **LU** - Luxembourg
- **PT** - Portugal
- **ES** - Spain
- **NL** - Netherlands

## Geowidget v5 (PL Market)

Geowidget v5 is designed specifically for the Polish market. It's simpler than International version and doesn't require country parameter.

**Documentation**: 
- [English](https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/pages/Geowidget+v5+ENG+PL+Market) 
- [Polish](https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/pages/Geowidget+v5+PL+Market)

### Environments

#### Production
- **Widget URL**: `https://geowidget.inpost.pl`
- **Manager**: https://manager.paczkomaty.pl
- **Examples**: https://geowidget.inpost.pl/examples/index.html

#### Test/Sandbox
- **Widget URL**: `https://sandbox-easy-geowidget-sdk.easypack24.net`
- **Manager**: https://sandbox-manager.paczkomaty.pl
- **Examples**: https://sandbox-easy-geowidget-sdk.easypack24.net/examples/index.html
- **API Docs**: https://geowidget.inpost.pl/docs/interfaces/ApiInterface.html

### Generating Access Token

1. Go to Parcel Manager (production or sandbox)
2. Login with your credentials
3. Go to **My Account** → **API** tab
4. Expand **Geowidget** section
5. Click **Generate** to create a PUBLIC token
6. **Important for sandbox**: When using localhost, do NOT indicate the domain when generating the token

**Requirements**: Company address and invoice data must be filled in before generating token.

### Basic Integration

Add to your HTML page header:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://geowidget.inpost.pl/inpost-geowidget.css"/>

<!-- JavaScript -->
<script src='https://geowidget.inpost.pl/inpost-geowidget.js' defer></script>

<!-- Callback function -->
<script> 
  function afterPointSelected(point) { 
    console.log('Selected point:', point.name);
  } 
</script>
```

Embed the widget:

```html
<inpost-geowidget 
  token='your-token-here' 
  language='pl' 
  config='parcelcollect'
></inpost-geowidget>
```

### Complete Integration with Event Listener

```html
<!-- CSS and JS -->
<link rel="stylesheet" href="https://geowidget.inpost.pl/inpost-geowidget.css"/>
<script src='https://geowidget.inpost.pl/inpost-geowidget.js' defer></script>

<!-- Event listener -->
<script>
  document.addEventListener('onpointselect', (event) => {
    const point = event.details;
    console.log('Selected point:', point.name);
  });
</script>

<!-- Widget -->
<inpost-geowidget 
  onpoint="onpointselect" 
  token='your-token-here' 
  language='pl' 
  config='parcelcollect'
></inpost-geowidget>
```

### Using Geowidget API

```html
<inpost-geowidget 
  id="geowidget" 
  onpoint="handlePointSelection" 
  token='your-token-here' 
  language='pl' 
  config='parcelCollect'
></inpost-geowidget>

<script>
  const geowidget = document.getElementById('geowidget');
  
  geowidget.addEventListener('inpost.geowidget.init', (event) => {
    const api = event.detail.api;
    // Change map position
    api.changePosition({ longitude: 20.318968, latitude: 49.731131 }, 16);
  });
</script>
```

### Widget Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `token` | PUBLIC token from Parcel Manager | Yes |
| `language` | Widget language: `pl`, `en`, `uk` | No |
| `config` | Configuration for point types (see below) | No |
| `onpoint` | Event name or function name for point selection callback | No |
| `id` | Element ID for API access | No |

**Note**: Geowidget v5 does NOT use `country` parameter (only for PL market).

### Configuration Options

| Config Value | Description | Functions | Point Types |
|--------------|-------------|-----------|-------------|
| `parcelCollect` | Collection points for prepaid orders | `parcel_collect` | Paczkomat®, PaczkoPunkt |
| `parcelCollectPayment` | Collection points for COD orders | `parcel_collect` | Paczkomat®, PaczkoPunkt |
| `parcelCollect247` | 24/7 collection points for Weekend shipments | `parcel_collect` | Paczkomat® and PaczkoPunkty available 24/7 |
| `parcelSend` | Sender points | `parcel_send` | Paczkomat®, PaczkoPunkt |

### Supported Languages

- `pl` - Polish
- `en` - English
- `uk` - Ukrainian

### Next.js/React Integration

```tsx
'use client';

import { InPostGeowidget } from '@/components/shipping/InPostGeowidget';

export function CheckoutPage() {
  const handlePointSelect = (point: InPostPoint) => {
    console.log('Selected point:', point.name);
  };

  return (
    <InPostGeowidget
      token={process.env.NEXT_PUBLIC_INPOST_GEO_TOKEN!}
      version="v5"  // Use v5 for PL Market
      language="pl"
      config="parcelCollect"
      onPointSelect={handlePointSelect}
      sandbox={true}
    />
  );
}
```

### Angular Package

InPost provides an Angular package for Geowidget v5:
- **npm**: https://www.npmjs.com/package/inpost-geowidget-angular

## Backend API Support

Our backend supports all Geowidget requirements through the `/api/v1/shipping/paczkomats` endpoint.

### Endpoint: `GET /api/v1/shipping/paczkomats`

Supports all Geowidget parameters:

#### Basic Filters
- `name` - Point name (e.g., "KRA012")
- `city` - City name
- `post_code` - Postal code

#### Point Type Filters
- `type` - Point type: `parcel_locker`, `parcel_locker_only`, `parcel_locker_superpop`, `pop`
- `partner_id` - Partner ID
- `functions` - Function filter (e.g., `parcel_collect`, `parcel_send`, `cool_parcel_collect`)
- `payment_available` - Filter points that support COD (true/false)
- `province` - Province name
- `location_247` - Filter 24/7 points for Weekend Parcels (true/false)

#### Location-Based Search
- `relative_point` - Search near coordinates: `"lat,lng"` (e.g., `"52.123,19.321"`)
- `relative_post_code` - Search near postal code
- `max_distance` - Max distance in meters (1-50000, default 10000)
- `limit` - Limit results for relative searches

#### Sorting
- `sort_by` - Sort field: `name`, `distance_to_relative_point`, `status`
- `sort_order` - Sort order: `asc`, `desc`

#### Paging
- `page` - Page number (default: 1)
- `per_page` - Items per page (1-500, default: 100)

#### Field Selection
- `fields` - Comma-separated field names to return

### Example Requests

#### Search by city
```bash
GET /api/v1/shipping/paczkomats?city=Warszawa&per_page=50
```

#### Search near coordinates
```bash
GET /api/v1/shipping/paczkomats?relative_point=52.2297,21.0122&max_distance=5000&sort_by=distance_to_relative_point&sort_order=asc
```

#### Filter by function (for config='parcelCollect')
```bash
GET /api/v1/shipping/paczkomats?functions=parcel_collect&city=Kraków
```

#### Filter COD points (for config='parcelCollectPayment')
```bash
GET /api/v1/shipping/paczkomats?functions=parcel_collect&payment_available=true&city=Warszawa
```

#### Filter 24/7 points (for config='parcelCollect247')
```bash
GET /api/v1/shipping/paczkomats?functions=parcel_collect&location_247=true&city=Kraków
```

## Custom Implementation (Alternative)

If you prefer not to use the Geowidget, you can build your own point selector:

```typescript
// React component example
import { useState, useEffect } from 'react';

interface Point {
  id: string;
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    city: string;
    post_code: string;
  };
}

export function InPostPointSelector({ onSelect }: { onSelect: (point: Point) => void }) {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchPointsNearLocation(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  const fetchPointsNearLocation = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/shipping/paczkomats?relative_point=${lat},${lng}&max_distance=10000&sort_by=distance_to_relative_point&sort_order=asc&limit=20`
      );
      const data = await response.json();
      setPoints(data.items || []);
    } catch (error) {
      console.error('Failed to fetch points:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading points...</p>}
      {points.map((point) => (
        <div key={point.id} onClick={() => onSelect(point)}>
          <h3>{point.name}</h3>
          <p>{point.address.street}, {point.address.city}</p>
        </div>
      ))}
    </div>
  );
}
```

## Response Format

The API returns a collection response:

```json
{
  "href": "https://api-shipx-pl.easypack24.net/v1/points?page=1&per_page=100",
  "count": 1024,
  "page": 1,
  "per_page": 100,
  "items": [
    {
      "href": "https://api-shipx-pl.easypack24.net/v1/points/KRA010",
      "id": "KRA010",
      "name": "KRA010",
      "type": "parcel_locker",
      "location": {
        "latitude": 50.0647,
        "longitude": 19.9450
      },
      "address": {
        "street": "ul. Example",
        "building_number": "1",
        "city": "Kraków",
        "post_code": "30-001",
        "country_code": "PL"
      },
      "payment_available": true,
      "location_247": true,
      "functions": ["parcel_collect", "parcel_send"]
    }
  ]
}
```

## Use Cases

### 1. Checkout Page - Point Selection

```tsx
// In checkout component
const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

const handlePointSelect = (point: Point) => {
  setSelectedPoint(point.name); // e.g., "KRA010"
  // Save to order
};
```

### 2. Integration with Order Form

```tsx
// Example: Adding Geowidget to checkout
import { InPostGeowidget } from '@/components/shipping/InPostGeowidget';

export function CheckoutForm() {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  
  return (
    <form>
      {/* Other form fields */}
      
      <div>
        <label>Select pickup point</label>
        <InPostGeowidget
          token={process.env.NEXT_PUBLIC_INPOST_GEO_TOKEN!}
          onPointSelect={(point) => setSelectedPoint(point.name)}
        />
      </div>
      
      <button type="submit" disabled={!selectedPoint}>
        Complete Order
      </button>
    </form>
  );
}
```

## Environment Variables

Add to your `.env` file:

```env
# InPost Geowidget Token (PUBLIC token from Parcel Manager)
NEXT_PUBLIC_INPOST_GEO_TOKEN=your-token-here

# Geowidget version: 'v5' or 'international' (default: 'international')
NEXT_PUBLIC_INPOST_GEO_VERSION=international

# Use sandbox for development
NEXT_PUBLIC_INPOST_GEO_SANDBOX=true
```

## Choosing Between Versions

### Use Geowidget International when:
- You need to support multiple countries (PL, BE, IT, FR, LU, PT, ES, NL)
- You want the latest features and updates
- You need more language options (pl, en, uk, es, fr, pt, it)

### Use Geowidget v5 when:
- You only serve Polish market (PL)
- You want simpler integration (no country parameter)
- You prefer the Polish-specific version
- You need Angular package support

## Notes

- Geowidget International is recommended for new integrations
- The widget is responsive and works on mobile devices
- Widget code runs on InPost servers (widget-type software)
- For sandbox with localhost, don't specify domain when generating token
- Language preference is remembered per user
- Widget supports multiple countries simultaneously
- API methods available after widget initialization event

## Resources

### Documentation
- **InPost Documentation**: https://dokumentacja-inpost.atlassian.net/
- **Geowidget International API Docs**: https://sandbox-global-geowidget-sdk.easypack24.net/docs/interfaces/ApiInterface.html
- **Geowidget v5 API Docs**: https://geowidget.inpost.pl/docs/interfaces/ApiInterface.html
- **Geowidget v5 ENG Documentation**: https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/pages/Geowidget+v5+ENG+PL+Market
- **Geowidget v5 PL Documentation**: https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/pages/Geowidget+v5+PL+Market

### Examples
- **Geowidget International Examples**: https://sandbox-global-geowidget-sdk.easypack24.net/examples/index.html
- **Geowidget v5 Examples (Production)**: https://geowidget.inpost.pl/examples/index.html
- **Geowidget v5 Examples (Sandbox)**: https://sandbox-easy-geowidget-sdk.easypack24.net/examples/index.html

### Managers
- **Parcel Manager (Production)**: https://manager.paczkomaty.pl
- **Parcel Manager (Sandbox)**: https://sandbox-manager.paczkomaty.pl

### Packages
- **Angular Package (v5)**: https://www.npmjs.com/package/inpost-geowidget-angular

### Backend API
- **Points API**: `/api/v1/shipping/paczkomats`
