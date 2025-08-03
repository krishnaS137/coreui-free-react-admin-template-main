# Admin Authentication System

## Overview
This document outlines the simplified admin authentication system implemented for the admin dashboard. The system uses a direct database check against the `employees` table for authentication with comprehensive routing guards and proper session management.

## Current Implementation

### Authentication Flow
1. **Initial Access**: Any unauthenticated user visiting the site is automatically redirected to the login page
2. **Login Process**: User enters email and password in the login form
3. **Validation**: System checks if email exists in the `employees` table (password validation simplified for development)
4. **Success**: If email exists, user is authenticated and redirected to the dashboard
5. **Session Management**: Authentication state is maintained using localStorage
6. **Route Protection**: All admin routes are protected by authentication guards

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

## Authentication Guards
- **DefaultLayout Protection**: All protected routes check authentication status on mount
- **Automatic Redirects**: Unauthenticated users are redirected to `/login`
- **Login Page Guard**: Already authenticated users accessing `/login` are redirected to `/dashboard`
- **Real-time Validation**: Authentication status is checked on every protected route access

## Session Management
- User session is stored in localStorage with the key 'admin'
- Session contains: `{ id, email, role, full_name }`
- Session is cleared on logout and user is redirected to login page
- Session persistence across browser sessions until explicit logout

## URL Structure & Routing
- Uses **HashRouter** for client-side routing compatibility
- Login page: `http://localhost:3001/#/login`
- Dashboard: `http://localhost:3001/#/dashboard`  
- All admin routes: `http://localhost:3001/#/[route-path]`

## Role-Based Access Control (RBAC)
- `super_admin`: Full access to all features
- `admin`: Customizable access based on permissions  
- `employee`: Basic access with limited permissions

## API Reference

### `loginAdmin(email, password)`
Authenticates a user by email and password.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password (currently not validated in development)

**Returns:**
- User object on successful authentication
- Stores user session in localStorage
- Throws error on authentication failure

**Implementation:**
```javascript
try {
  await loginAdmin(formData.email, formData.password)
  navigate('/dashboard') // Redirects to dashboard on success
} catch (err) {
  setError(err.message) // Shows error message
}
```

### `handleLogout()`
Clears the current user session and redirects to login page.

**Implementation:**
- Removes 'admin' key from localStorage
- Redirects to `#/login` using HashRouter navigation
- Compatible with HashRouter URL structure

### `isAuthenticated()`
Checks if a user is currently authenticated.

**Returns:**
- `true` if user session exists in localStorage
- `false` if no valid session found

**Usage:**
- Used by DefaultLayout to protect routes
- Used by Login component to redirect authenticated users

### `getCurrentAdmin()`
Retrieves the currently authenticated user data.

**Returns:**
- Parsed user object if authenticated
- `null` if no valid session exists

## Recent Fixes & Improvements

### Authentication System Fixes (Latest Update)
1. **Fixed JSX Structure**: Resolved malformed JSX in Login.js causing build failures
2. **Added Missing Imports**: Fixed `CAlert` and `CSpinner` import issues
3. **Proper Navigation**: Implemented React Router navigation instead of window.location
4. **Authentication Guards**: Added comprehensive route protection in DefaultLayout
5. **HashRouter Compatibility**: Fixed logout redirects to work properly with HashRouter
6. **Registration Removal**: Completely removed registration functionality as planned
7. **Import Path Fixes**: Corrected authUtils import path to authService

### File Structure Changes
- **Removed**: `src/views/pages/register/Register.js`
- **Fixed**: `src/views/pages/login/Login.js` - Complete restructure and fix
- **Updated**: `src/components/header/AppHeaderDropdown.js` - Fixed import paths
- **Enhanced**: `src/layout/DefaultLayout.js` - Added authentication guards
- **Updated**: `src/services/authService.js` - Fixed HashRouter navigation
