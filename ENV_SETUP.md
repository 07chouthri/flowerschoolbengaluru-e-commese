# SMS & WhatsApp Notification Setup

This document outlines the environment variables and setup required for the SMS and WhatsApp notification system integrated into the Bouquet Bar order processing workflow.

## Required Environment Variables

Add these environment variables to your `.env` file or deployment environment:

### Twilio Configuration (Required)
```bash
# Twilio Account Credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

# SMS Configuration
TWILIO_SMS_FROM=+1234567890  # Your Twilio phone number for SMS
# OR use your existing phone number variable
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Configuration  
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Twilio WhatsApp Sandbox number
# For production, use your verified WhatsApp Business number:
# TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
```

### Optional Configuration
```bash
# Twilio Verify Service (already configured for OTP)
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here
```

## Twilio Setup Instructions

### 1. SMS Setup
1. **Get Twilio Phone Number**: Purchase a phone number from Twilio Console
2. **Configure SMS**: Ensure SMS is enabled for your phone number
3. **Set Environment Variable**: Add `TWILIO_SMS_FROM` with your phone number

### 2. WhatsApp Setup

#### For Development/Testing (Twilio Sandbox)
1. **Access WhatsApp Sandbox**: Go to Twilio Console > WhatsApp > Sandbox
2. **Get Sandbox Number**: Use the provided sandbox number (usually `+1 415 523 8886`)
3. **Join Sandbox**: Send "join [sandbox-keyword]" to the sandbox number from your test phone
4. **Set Environment Variable**: 
   ```bash
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```

#### For Production (WhatsApp Business API)
1. **Apply for WhatsApp Business**: Submit application through Twilio
2. **Business Verification**: Complete business verification process
3. **Get Approved Number**: Receive your verified WhatsApp Business number
4. **Update Environment Variable**:
   ```bash
   TWILIO_WHATSAPP_FROM=whatsapp:+your_business_number
   ```

## Testing the Integration

### Method 1: Server Test Script
```bash
# Run the test script to verify notification functionality
cd server
npx tsx test-notification.ts
```

### Method 2: Place Test Order
1. Go to the application checkout page
2. Place an order with a valid phone number
3. Check console logs for notification status
4. Verify SMS/WhatsApp delivery

## Notification Flow

### When Order is Placed
1. **Order Created**: Order successfully saved to database
2. **Extract Phone**: Phone number extracted from order data
3. **Format Number**: Phone number formatted for Indian market (+91)
4. **Send SMS**: Order confirmation SMS sent via Twilio
5. **Send WhatsApp**: Order confirmation WhatsApp message sent
6. **Log Results**: Success/failure logged with message IDs

### Error Handling
- **Invalid Phone**: Order succeeds, notification fails gracefully
- **Twilio API Error**: Order succeeds, error logged for debugging
- **Network Issues**: Order succeeds, retry logic can be added later

## Phone Number Support

### Supported Formats
- **Indian Mobile**: `9876543210` → `+919876543210`
- **With Country Code**: `919876543210` → `+919876543210`
- **Already Formatted**: `+919876543210` → `+919876543210`
- **International**: `+1234567890` → `+1234567890`

### Validation Rules
- Minimum 10 digits required
- Indian numbers must start with 9 (mobile)
- Auto-adds +91 for Indian numbers
- Preserves international formatting

## Message Templates

### SMS Template Features
- Order number and customer name
- Item summary (limited for SMS length)
- Total amount with Indian currency formatting
- Delivery estimate and address
- Business contact information
- Professional Bouquet Bar branding

### WhatsApp Template Features
- Rich formatting with emojis and sections
- Complete order details and item list
- Payment status and delivery information
- Professional business messaging
- Interactive elements (reply options)
- Tracking and support information

## Troubleshooting

### Common Issues

#### "SMS from number not configured"
- **Solution**: Set `TWILIO_SMS_FROM` or `TWILIO_PHONE_NUMBER` environment variable

#### "Cannot find module '../templates/whatsapp-templates'"
- **Solution**: TypeScript development warning, application runs correctly

#### "Invalid phone number"
- **Solution**: Ensure phone number in order data follows supported format

#### WhatsApp delivery failures
- **Solution**: For sandbox, ensure recipient joined sandbox first
- **Production**: Verify WhatsApp Business API approval status

### Debug Logs
Enable detailed logging by checking server console for:
- `[NOTIFICATION]` - General notification flow
- `[SMS]` - SMS-specific operations  
- `[WHATSAPP]` - WhatsApp-specific operations
- `[ORDER PLACEMENT]` - Order processing with notifications

## Security Notes

- **Environment Variables**: Never commit Twilio credentials to version control
- **Phone Data**: Phone numbers are validated but not stored in logs
- **Error Messages**: Sensitive data excluded from error logs
- **API Keys**: Rotate Twilio tokens regularly for production

## Cost Considerations

### SMS Costs
- Twilio SMS rates apply per message sent
- Indian SMS rates typically lower than international
- Failed deliveries may still incur charges

### WhatsApp Costs  
- WhatsApp Business API has per-conversation pricing
- Sandbox usage is free for development
- Production rates vary by region and volume

## Future Enhancements

1. **Notification Preferences**: Allow users to opt-out of specific channels
2. **Delivery Receipts**: Track message delivery status
3. **Retry Logic**: Automatic retry for failed notifications
4. **Templates**: Admin interface for customizing message templates
5. **Analytics**: Dashboard for notification delivery rates