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

### User Object
```javascript
{
  id: string,          // Unique user identifier
  email: string,        // User's email address
  username: string,     // User's username
  full_name: string,    // User's full name
  avatar_url: string,   // URL to user's avatar
  status: string,       // 'active' or 'inactive'
  created_at: string,   // ISO date string
  last_login: string,   // ISO date string
  role: string,         // User role (e.g., 'admin', 'user')
  phone: string,       // User's phone number
  bio: string           // User's biography
}
```

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
