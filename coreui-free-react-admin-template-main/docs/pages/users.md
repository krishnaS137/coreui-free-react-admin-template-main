# Users Management

This document provides an overview of the Users management feature in the admin panel.

## Overview
The Users section allows administrators to manage user accounts, view user details, and perform user-related actions.

## Features

### Users List (`Users.js`)
- Displays all users in a paginated table
- Search functionality to find users by name or email
- User status management (active/inactive)
- Pagination for easy navigation through user lists
- Actions:
  - View/Edit user details
  - Deactivate/Reactivate users

### User Profile (`UserProfile.js`)
- Detailed view of a user's information
- Editable user details
- Shows user activity and related data
- Save/Cancel functionality for edits

## Components

### Users.js
Main component for displaying and managing the list of users.

#### State
- `users`: Array of user objects
- `loading`: Loading state
- `searchTerm`: Current search term
- `currentPage`: Current page number for pagination
- `totalPages`: Total number of pages
- `statusFilter`: Current status filter (all/active/inactive)

#### Methods
- `fetchUsers`: Fetches users from the API
- `handleSearch`: Handles search functionality
- `handleStatusChange`: Updates user status
- `handlePageChange`: Handles pagination

### UserProfile.js
Displays and manages individual user details.

#### State
- `user`: Current user object
- `loading`: Loading state
- `error`: Error message if any
- `isSaving`: Saving state during updates
- `formData`: Form data for editing user details

#### Methods
- `fetchUserData`: Fetches user details
- `handleInputChange`: Handles form input changes
- `handleSubmit`: Submits user updates

## Data Structure

### Users Table Schema
```sql
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sr_no serial NOT NULL,
  first_name text NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  phone text NULL,
  birthday date NULL,
  wallet_coins integer NULL DEFAULT 0,
  joining_date timestamp with time zone NULL DEFAULT now(),
  image_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  status character varying(20) NOT NULL DEFAULT 'normal'::character varying,
  suspended_until timestamp with time zone NULL,
  
  -- Constraints
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT valid_status CHECK (
    (status)::text = ANY (
      ARRAY[
        'normal'::character varying,
        'warned'::character varying,
        'suspended_7days'::character varying,
        'suspended_indefinite'::character varying
      ]::text[]
    )
  )
);

-- Trigger for handling suspension expiration
CREATE TRIGGER check_suspension_trigger
AFTER INSERT OR UPDATE ON users
FOR EACH STATEMENT
EXECUTE FUNCTION check_expired_suspensions();
```

### User Object
```javascript
{
  id: 'uuid',           // Unique user identifier (UUID v4)
  sr_no: 1,             // Auto-incrementing serial number
  first_name: 'string',  // User's first name
  username: 'string',    // Unique username
  email: 'string',      // User's email address (unique)
  phone: 'string',      // User's phone number (optional)
  birthday: 'date',     // User's date of birth (optional)
  wallet_coins: 0,      // Number of coins in user's wallet (default: 0)
  joining_date: 'ISO date string',  // When user joined
  image_url: 'string',  // URL to user's profile image (optional)
  created_at: 'ISO date string',    // When record was created
  status: 'string',     // One of: 'normal', 'warned', 'suspended_7days', 'suspended_indefinite'
  suspended_until: 'ISO date string' // For temporary suspensions (nullable)
}
```

### Status Types
- `normal`: Default status for active users
- `warned`: User has been warned about policy violations
- `suspended_7days`: Temporary suspension (auto-expires after 7 days)
- `suspended_indefinite`: Permanent suspension (requires admin action to lift)

## API Integration
- Uses Supabase client for user management
- Handles authentication and authorization
- Implements error handling and loading states

## Navigation
- **Users List**: `/users`
- **User Profile**: `/users/:id`
- Accessible via the sidebar menu under the "Users" section

## Error Handling
- Displays error messages for failed API calls
- Shows loading states during data fetching
- Provides feedback for user actions

## Dependencies
- CoreUI React components
- React Router for navigation
- Supabase client for backend integration
- Date-fns for date formatting

## Future Enhancements
- Bulk user actions
- User role management
- Advanced filtering and sorting
- User activity logs
- Export user data (CSV/Excel)
- User impersonation for support
- Two-factor authentication management
