# InPost Webhook Integration Guide

## Overview

InPost webhooks are used to receive real-time notifications about changes in shipment status. This allows your system to automatically update order statuses and tracking information without polling the API.

## Webhook Endpoint

### URL Structure

Your webhook URL must:
1. Have correct URL structure
2. Be accessible from the internet
3. Respond with HTTP 200 on GET request (for verification)

**Endpoint**: `GET/POST /api/v1/shipping/inpost/webhook`

**Full URL example**: 
- Production: `https://your-domain.com/api/v1/shipping/inpost/webhook`
- Development: `http://your-domain.com:8000/api/v1/shipping/inpost/webhook`

### IP Address Validation

InPost webhooks are sent from IP address range: **91.216.25.0/24**

This IP range applies to both production and sandbox environments.

**Note**: IP validation is implemented but commented out by default. Enable it in production for security.

## Configuration

### Setting Up Webhook in Parcel Manager

1. Go to Parcel Manager:
   - Production: https://manager.paczkomaty.pl
   - Sandbox: https://sandbox-manager.paczkomaty.pl

2. Login and go to **My Account** → **API** tab

3. Find **Webhooks** section

4. Add your webhook URL:
   ```
   https://your-domain.com/api/v1/shipping/inpost/webhook
   ```

5. Save the configuration

**Important**: 
- URL must be accessible from the internet
- URL must respond with HTTP 200 on GET request
- Use HTTPS in production
- For sandbox with localhost, use tools like ngrok for testing

## Webhook Events

### 1. shipment_confirmed

Sent when a shipment is created and confirmed.

**Payload**:
```json
{
  "event_ts": "2020-03-20 15:08:06 +0100",
  "event": "shipment_confirmed",
  "organization_id": 1,
  "payload": {
    "shipment_id": 49,
    "tracking_number": "602677439331630337653846"
  }
}
```

**What happens**:
- Shipment tracking number is updated
- Shipment status set to `LABEL_CREATED`
- Order status set to `PROCESSING`
- InPost shipment_id stored in `provider_data`

### 2. shipment_status_changed

Sent when shipment status changes.

**Payload**:
```json
{
  "event_ts": "2020-03-20 15:08:42 +0100",
  "event": "shipment_status_changed",
  "organization_id": 1,
  "payload": {
    "shipment_id": 49,
    "status": "delivered",
    "tracking_number": "602677439331630337653846",
    "return_tracking_number": "520107015145404000176000"  // Optional, for returns
  }
}
```

**Status Mapping**:
- `created`, `confirmed` → `LABEL_CREATED`
- `picked_up` → `PICKED_UP` (Order → `SHIPPED`)
- `in_transit`, `dispatched` → `IN_TRANSIT` (Order → `SHIPPED`)
- `out_for_delivery` → `OUT_FOR_DELIVERY` (Order → `SHIPPED`)
- `delivered` → `DELIVERED` (Order → `DELIVERED`)
- `returned_to_sender` → `RETURNED` (Order → `CANCELLED`)
- `exception`, `failed` → `EXCEPTION` (Order → `PROCESSING`)

**What happens**:
- Shipment status updated
- Order status updated accordingly
- Tracking events history updated
- `delivered_at` timestamp set when delivered
- `shipped_at` timestamp set when picked up
- Return tracking number stored if present

### 3. offers_prepared

Sent when offers are prepared for a shipment (offer mode).

**Payload**:
```json
{
  "event_ts": "2023-12-18 12:31:58 +0100",
  "event": "offers_prepared",
  "organization_id": 1,
  "payload": {
    "shipment_id": 1234567890,
    "offers": [
      {
        "id": 1421884568,
        "status": "available",
        "expires_at": "2023-12-18T12:36:58.279+01:00",
        "rate": null,
        "currency": "PLN",
        "carrier": {...},
        "service": {...}
      }
    ]
  }
}
```

**What happens**:
- Offers stored in `provider_data`
- Can be used to display available shipping options to user

## Implementation Details

### Shipment Matching

Webhook handler matches shipments by:
1. **Tracking number** (primary)
2. **InPost shipment_id** stored in `provider_data` (fallback)

This ensures webhooks work even if tracking number is not yet available.

### Error Handling

- Webhook always returns HTTP 200 to acknowledge receipt
- Errors are logged but don't cause webhook retry
- Database rollback on errors
- Shipment not found is logged but doesn't fail

### Logging

All webhook events are logged with:
- Event type
- Client IP address
- Shipment ID
- Processing status

## Testing Webhooks

### Using ngrok (for localhost)

1. Install ngrok: https://ngrok.com/

2. Start your backend server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

3. Start ngrok tunnel:
   ```bash
   ngrok http 8000
   ```

4. Use ngrok URL in Parcel Manager:
   ```
   https://your-ngrok-url.ngrok.io/api/v1/shipping/inpost/webhook
   ```

### Manual Testing

You can test webhook endpoint manually:

```bash
# GET request (verification)
curl -X GET https://your-domain.com/api/v1/shipping/inpost/webhook

# POST request (event)
curl -X POST https://your-domain.com/api/v1/shipping/inpost/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_ts": "2020-03-20 15:08:06 +0100",
    "event": "shipment_confirmed",
    "organization_id": 1,
    "payload": {
      "shipment_id": 49,
      "tracking_number": "602677439331630337653846"
    }
  }'
```

## Security Considerations

1. **IP Validation**: Enable IP validation in production:
   ```python
   if not _validate_inpost_ip(client_ip):
       raise HTTPException(status_code=403, detail="Unauthorized IP")
   ```

2. **HTTPS**: Always use HTTPS in production

3. **Rate Limiting**: Consider adding rate limiting to prevent abuse

4. **Logging**: Monitor webhook logs for suspicious activity

## Database Schema

Webhook data is stored in:
- `shipments.provider_data` - JSON field storing InPost-specific data
- `shipments.tracking_events` - JSON array of status change events
- `shipments.status` - Current shipment status
- `orders.status` - Order status (updated based on shipment status)

## Troubleshooting

### Webhook not received

1. Check webhook URL is accessible from internet
2. Verify URL responds with HTTP 200 on GET
3. Check Parcel Manager webhook configuration
4. Review server logs for errors

### Shipment not found

1. Verify `inpost_shipment_id` is stored when creating shipment
2. Check tracking number matches
3. Review webhook logs for matching attempts

### Status not updating

1. Check webhook event is being received
2. Verify shipment matching logic
3. Review database transaction logs
4. Check for exceptions in logs

## Example Webhook Handler Flow

```
1. InPost sends webhook → POST /api/v1/shipping/inpost/webhook
2. Validate IP (optional)
3. Parse event payload
4. Find shipment by tracking_number or shipment_id
5. Process event:
   - shipment_confirmed: Update tracking, set status
   - shipment_status_changed: Update status, order status, timestamps
   - offers_prepared: Store offers
6. Update database
7. Return HTTP 200
```

## Resources

- **InPost Documentation**: https://dokumentacja-inpost.atlassian.net/
- **Parcel Manager (Production)**: https://manager.paczkomaty.pl
- **Parcel Manager (Sandbox)**: https://sandbox-manager.paczkomaty.pl
- **Webhook Endpoint**: `/api/v1/shipping/inpost/webhook`

