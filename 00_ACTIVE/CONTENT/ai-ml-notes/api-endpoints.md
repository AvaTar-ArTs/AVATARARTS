# CleanConnect Pro API Endpoints
## AI-Powered Airbnb Cleaning Marketplace

### Base URL: `https://api.cleanconnectpro.com/v1`

---

## 🔐 Authentication Endpoints

### POST `/auth/register`
Register a new user (host or cleaner)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+13525551234",
  "userType": "host", // or "cleaner"
  "profileData": {
    // Host-specific or cleaner-specific data
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "userType": "host",
    "isVerified": false,
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST `/auth/login`
Login user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### POST `/auth/refresh`
Refresh access token

### POST `/auth/logout`
Logout user

---

## 👤 User Management Endpoints

### GET `/users/profile`
Get current user profile

### PUT `/users/profile`
Update user profile

### POST `/users/upload-avatar`
Upload profile image

### GET `/users/cleaners`
Get list of verified cleaners (for hosts)

**Query Parameters:**
- `lat` - Latitude for location-based search
- `lng` - Longitude for location-based search
- `radius` - Search radius in miles (default: 25)
- `specialties` - Comma-separated list of specialties
- `minRating` - Minimum rating filter
- `maxRate` - Maximum hourly rate filter

---

## 🏠 Property Management Endpoints

### GET `/properties`
Get user's properties

### POST `/properties`
Create new property

**Request Body:**
```json
{
  "propertyName": "Downtown Apartment",
  "propertyType": "apartment",
  "addressLine1": "123 Main St",
  "city": "Gainesville",
  "state": "FL",
  "zipCode": "32601",
  "bedrooms": 2,
  "bathrooms": 1.5,
  "squareFeet": 1200,
  "accessInstructions": "Key under mat",
  "specialRequirements": "No pets, eco-friendly products only"
}
```

### PUT `/properties/{propertyId}`
Update property

### DELETE `/properties/{propertyId}`
Delete property

### POST `/properties/{propertyId}/photos`
Upload property photos

---

## 🧹 Cleaning Request Endpoints

### POST `/requests`
Submit cleaning request (main ticket submission)

**Request Body:**
```json
{
  "propertyId": "uuid",
  "requestType": "turnover",
  "urgency": "same_day",
  "preferredDate": "2025-01-28",
  "preferredTime": "morning",
  "specialRequirements": "Deep clean kitchen, eco-friendly products",
  "budgetMin": 100,
  "budgetMax": 200,
  "contactMethod": "app"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "uuid",
    "status": "pending",
    "estimatedMatches": 5,
    "quotesExpectedBy": "2025-01-27T15:30:00Z"
  }
}
```

### GET `/requests`
Get user's cleaning requests

**Query Parameters:**
- `status` - Filter by status
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

### GET `/requests/{requestId}`
Get specific cleaning request details

### PUT `/requests/{requestId}`
Update cleaning request

### DELETE `/requests/{requestId}`
Cancel cleaning request

---

## 💰 Quote Management Endpoints

### GET `/requests/{requestId}/quotes`
Get quotes for a cleaning request

### POST `/requests/{requestId}/quotes`
Submit quote (cleaners only)

**Request Body:**
```json
{
  "quoteAmount": 150.00,
  "estimatedHours": 3.5,
  "quoteMessage": "I can provide same-day service with eco-friendly products",
  "includesSupplies": true,
  "includesEquipment": true
}
```

### PUT `/quotes/{quoteId}`
Update quote

### DELETE `/quotes/{quoteId}`
Withdraw quote

---

## 📅 Booking Management Endpoints

### POST `/bookings`
Create booking from accepted quote

**Request Body:**
```json
{
  "quoteId": "uuid",
  "scheduledDate": "2025-01-28",
  "scheduledTime": "09:00:00"
}
```

### GET `/bookings`
Get user's bookings

### GET `/bookings/{bookingId}`
Get specific booking details

### PUT `/bookings/{bookingId}/status`
Update booking status

### POST `/bookings/{bookingId}/start`
Mark job as started (cleaners only)

### POST `/bookings/{bookingId}/complete`
Mark job as completed (cleaners only)

### POST `/bookings/{bookingId}/photos`
Upload job completion photos

---

## ⭐ Review & Rating Endpoints

### POST `/reviews`
Submit review and rating

**Request Body:**
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "reviewText": "Excellent service, very professional!",
  "isPublic": true
}
```

### GET `/reviews`
Get reviews for user

### GET `/reviews/{reviewId}`
Get specific review

---

## 💬 Messaging Endpoints

### GET `/bookings/{bookingId}/messages`
Get messages for a booking

### POST `/bookings/{bookingId}/messages`
Send message

**Request Body:**
```json
{
  "messageText": "I'll be there at 9 AM as scheduled",
  "messageType": "text"
}
```

### PUT `/messages/{messageId}/read`
Mark message as read

---

## 💳 Payment Endpoints

### POST `/payments/process`
Process payment for booking

**Request Body:**
```json
{
  "bookingId": "uuid",
  "paymentMethodId": "pm_1234567890",
  "amount": 150.00
}
```

### GET `/payments`
Get payment history

### POST `/payments/refund`
Request refund

---

## 🤖 AI Matching Endpoints

### POST `/ai/match-cleaners`
Trigger AI matching for a request

**Request Body:**
```json
{
  "requestId": "uuid",
  "maxDistance": 25,
  "maxResults": 10,
  "preferences": {
    "minRating": 4.0,
    "maxRate": 50,
    "specialties": ["turnover", "deep_clean"]
  }
}
```

### GET `/ai/matching-log/{requestId}`
Get AI matching results for a request

---

## 📊 Analytics Endpoints

### GET `/analytics/dashboard`
Get user dashboard analytics

### GET `/analytics/earnings`
Get earnings data (cleaners only)

### GET `/analytics/performance`
Get performance metrics

---

## 🔔 Notification Endpoints

### GET `/notifications`
Get user notifications

### PUT `/notifications/{notificationId}/read`
Mark notification as read

### PUT `/notifications/mark-all-read`
Mark all notifications as read

---

## ⚙️ System Endpoints

### GET `/system/settings`
Get public system settings

### GET `/system/health`
Health check endpoint

### GET `/system/stats`
Platform statistics (public)

---

## 📱 Mobile App Specific Endpoints

### POST `/mobile/location/update`
Update user location for matching

### GET `/mobile/cleaners/nearby`
Get nearby cleaners with real-time location

### POST `/mobile/push-token`
Register push notification token

---

## 🔍 Search & Filter Endpoints

### GET `/search/cleaners`
Advanced cleaner search

**Query Parameters:**
- `q` - Search query
- `lat` - Latitude
- `lng` - Longitude
- `radius` - Search radius
- `specialties` - Comma-separated specialties
- `minRating` - Minimum rating
- `maxRate` - Maximum hourly rate
- `available` - Available for specific date/time
- `sort` - Sort by: distance, rating, rate, experience

### GET `/search/requests`
Search cleaning requests (cleaners only)

---

## 📈 Reporting Endpoints

### GET `/reports/earnings`
Generate earnings report

### GET `/reports/bookings`
Generate booking report

### GET `/reports/performance`
Generate performance report

---

## 🛡️ Security & Compliance

### POST `/security/verify-identity`
Submit identity verification documents

### GET `/security/verification-status`
Check verification status

### POST `/security/report-issue`
Report security issue or violation

---

## 📋 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "timestamp": "2025-01-27T10:30:00Z",
  "requestId": "req_123456789"
}
```

### Common Error Codes:
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - User not authenticated
- `AUTHORIZATION_DENIED` - User not authorized
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PAYMENT_FAILED` - Payment processing failed
- `BOOKING_CONFLICT` - Booking time conflict
- `QUOTE_EXPIRED` - Quote has expired
- `SYSTEM_ERROR` - Internal server error

---

## 🔄 Webhook Endpoints

### POST `/webhooks/stripe`
Stripe payment webhooks

### POST `/webhooks/twilio`
Twilio SMS webhooks

### POST `/webhooks/sendgrid`
SendGrid email webhooks

---

## 📊 Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General API**: 100 requests per minute per user
- **Search endpoints**: 20 requests per minute per user
- **File upload**: 10 requests per minute per user

---

## 🔐 Authentication

All endpoints (except public ones) require Bearer token authentication:

```
Authorization: Bearer <jwt_token>
```

## 📱 Mobile App Headers

Mobile apps should include:

```
X-App-Version: 1.0.0
X-Platform: ios|android
X-Device-ID: unique_device_id
```

---

*This API documentation is for CleanConnect Pro v1.0. All endpoints are subject to change during development.*