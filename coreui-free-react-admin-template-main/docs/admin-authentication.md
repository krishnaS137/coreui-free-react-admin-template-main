# Admin Authentication System

## Overview
This document outlines the admin authentication system implemented for the admin dashboard. The system uses Supabase with a dedicated `admins` table and Row Level Security (RLS) for secure authentication.

## Database Schema

### Admins Table
```sql
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS admins_email_idx ON public.admins (email);

-- Enable RLS (Row Level Security)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Function to check if admins table is empty
CREATE OR REPLACE FUNCTION public.is_admins_table_empty()
RETURNS boolean AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.admins);
$$ LANGUAGE sql SECURITY DEFINER;

-- Policy to allow first admin registration
CREATE POLICY "Allow first admin registration"
ON public.admins
FOR INSERT
TO anon, authenticated
WITH CHECK (public.is_admins_table_empty());

-- Policy to allow admins to view all admins
CREATE POLICY "Allow select all admins"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow admins to update their own record
CREATE POLICY "Allow update self"
ON public.admins
FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```

### Database Functions

#### Update Timestamp Function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Authentication Flow

### Registration Process
1. The system checks if the admins table is empty using the `is_admins_table_empty()` function
2. If the table is empty, the registration form is shown
3. When the form is submitted:
   - The password is hashed (in production, use proper password hashing)
   - A new auth user is created using Supabase Auth
   - A corresponding admin record is created in the `admins` table
   - The admin is automatically logged in and redirected to the dashboard

### Login Process
1. User submits email and password on the login page
2. Client sends credentials to Supabase
3. Server verifies credentials against the `admins` table
4. On success, admin data is stored in localStorage
5. User is redirected to the dashboard

### Logout Process
1. User clicks logout
2. Local storage is cleared
3. User is redirected to the login page

## Key Files

### `src/services/authService.js`
Contains authentication-related functions:
- `loginAdmin(email, password)` - Handles admin login
- `registerAdmin(email, password, fullName)` - Registers a new admin
- `getCurrentAdmin()` - Gets the currently logged-in admin
- `logout()` - Handles admin logout

### `src/utils/authUtils.js`
Utility functions for authentication:
- `handleLogout()` - Centralized logout handler
- `isAuthenticated()` - Checks if user is authenticated
- `getCurrentAdmin()` - Gets current admin data

### `src/views/pages/login/Login.js`
Login page component with form handling and validation.

### `src/views/pages/register/Register.js`
Admin registration page (only accessible when no admins exist).

## Environment Variables
Required environment variables in `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Considerations
- Passwords are hashed before storage
- Row Level Security (RLS) is enabled on the admins table
- Session is stored in localStorage (consider using httpOnly cookies in production)
- Input validation is performed on both client and server

## Setup Instructions

1. Run the SQL migrations to create the `admins` table and related functions
2. Set up the required environment variables
3. The first user to register will be granted admin privileges
4. Subsequent registrations can be controlled through the `is_active` flag

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure your Supabase URL is correctly configured in CORS settings
2. **Authentication Failures**: Verify that the admin email exists and is active
3. **Database Connection Issues**: Check Supabase connection settings and network connectivity

## Future Improvements
- Implement password reset functionality
- Add two-factor authentication
- Implement session management with refresh tokens
- Add audit logging for admin actions
- Implement role-based access control (RBAC) for different admin levels
