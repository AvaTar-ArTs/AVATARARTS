# Authentication API Testing Guide

## Overview

This guide shows how to test the authentication endpoints using `curl` or Postman.

**Base URL**: `http://localhost:5000/api/v1/auth`

---

## 1. User Signup

**Endpoint**: `POST /signup`

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "tier": "free",
      "created_at": "2024-12-26T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. User Login

**Endpoint**: `POST /login`

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "tier": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Get Current User (Protected Route)

**Endpoint**: `GET /me`

**Requires**: Authorization header with Bearer token

```bash
TOKEN="your-jwt-token-here"

curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "tier": "free",
      "is_active": true,
      "email_verified": false,
      "created_at": "2024-12-26T10:00:00.000Z",
      "last_login_at": "2024-12-26T10:05:00.000Z"
    }
  }
}
```

---

## 4. Google OAuth Login

**Endpoint**: `POST /google`

```bash
curl -X POST http://localhost:5000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "googleId": "google-user-id-123",
    "email": "test@gmail.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "test@gmail.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "tier": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 5. Logout

**Endpoint**: `POST /logout`

**Requires**: Authorization header

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

Note: Since we're using stateless JWT, logout is handled client-side by removing the token.

---

## 6. Deactivate Account

**Endpoint**: `DELETE /account`

**Requires**: Authorization header

```bash
curl -X DELETE http://localhost:5000/api/v1/auth/account \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": "Invalid or expired token. Please login again."
}
```

### User Exists Error (500)
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists"
  }
}
```

---

## Testing Workflow

### 1. Create User
```bash
# Signup
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe"}'
```

### 2. Save Token
```bash
# Extract token from response and save it
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Access Protected Routes
```bash
# Use token to access protected endpoints
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Hookmark Pro Auth",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Signup",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"Test123!\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/v1/auth/signup",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "v1", "auth", "signup"]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/v1/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "v1", "auth", "login"]
        }
      }
    },
    {
      "name": "Get Me",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": {
          "raw": "http://localhost:5000/api/v1/auth/me",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "v1", "auth", "me"]
        }
      }
    }
  ]
}
```

---

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Examples:
- ✅ `Password123`
- ✅ `Test@123`
- ✅ `MyPass1`
- ❌ `password` (no uppercase, no number)
- ❌ `PASSWORD123` (no lowercase)
- ❌ `Test` (too short, no number)

---

## Next Steps

1. Test all endpoints locally
2. Verify JWT tokens are working
3. Test error cases (invalid email, wrong password, etc.)
4. Integrate with Chrome extension frontend

---

**Status**: Authentication module complete and ready for testing
**Last Updated**: December 26, 2024
