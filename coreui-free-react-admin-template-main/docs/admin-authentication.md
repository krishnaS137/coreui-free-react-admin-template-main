# Admin Authentication System

## Overview
This document outlines the simplified admin authentication system implemented for the admin dashboard. The system uses a direct database check against the `employees` table for authentication.

## Current Implementation

### Authentication Flow
1. User enters email in the login form
2. System checks if email exists in the `employees` table
3. If email exists, user is authenticated and redirected to the dashboard
4. Session is maintained using localStorage

### Database Schema

#### Employees Table
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'employee'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Notes
- This is a simplified implementation for development purposes
- In production, consider implementing:
  - Password hashing and verification
  - Rate limiting
  - Account lockout after failed attempts
  - Session management with secure, HTTP-only cookies

## Session Management
- User session is stored in localStorage with the key 'admin'
- Session contains: `{ id, email, role, full_name }`
- Session is cleared on logout or browser close

## Role-Based Access Control (RBAC)
- `super_admin`: Full access to all features
- `admin`: Customizable access based on permissions
- `employee`: Basic access with limited permissions

## API Reference

### `loginAdmin(email)`
Authenticates a user by email.

**Parameters:**
- `email` (string): User's email address

**Returns:**
- User object on success
- Throws error on failure

### `handleLogout()`
Clears the current user session and redirects to login page.

### `isAuthenticated()`
Checks if a user is currently authenticated.

**Returns:**
- `true` if user is authenticated, `false` otherwise

### `getCurrentAdmin()`
Retrieves the currently authenticated user.

**Returns:**
- User object if authenticated, `null` otherwise
