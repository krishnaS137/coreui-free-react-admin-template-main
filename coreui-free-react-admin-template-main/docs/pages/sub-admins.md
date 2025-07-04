# Sub-Admin Management

This document provides an overview of the Sub-Admin management feature in the admin panel.

## Overview
The Sub-Admin Management section allows administrators to grant and manage administrative access to other users. This feature helps in delegating administrative tasks while maintaining control over access levels.

## Features

### User Search and Selection
- Search for users by username, email, or phone number
- View search results in a sortable table
- Select a user to grant sub-admin access

### Access Level Assignment
- Choose between different access levels:
  - **Limited Access**: Predefined set of permissions (Notifications, Competitions, Videos, Feedback)
  - **Full Access**: Complete administrative privileges across all sections
  - **Custom Access**: Granular control over specific permissions

### Permission Management
- Granular control over access to each management section:
  - User Management
  - Sub-Admin Management
  - Notifications Management
  - Competitions Management
  - Coins Management
  - Videos Management
  - Withdraw Management
  - Feedback Management

### Current Sub-Admins List
- View all current sub-admins in a sortable table
- See assigned access levels and permission counts
- View last updated timestamp
- Edit existing sub-admin permissions
- Remove sub-admin access when no longer needed

### Current Implementation
- Mock data is currently used for demonstration
- Ready to be connected to a real API
- Responsive design that works on all screen sizes
- Real-time updates when adding, editing, or removing sub-admins
- Confirmation dialogs for destructive actions
- Loading states during operations

## Components

### SubAdmin.js
Main component that handles the sub-admin management interface.

#### State
- `subAdmins`: Array of current sub-admin users
- `editingSubAdmin`: ID of sub-admin being edited (null if adding new)
- `searchTerm`: Current search query
- `selectedUser`: Currently selected user for sub-admin assignment
- `isAdding`: Boolean to track if in "add sub-admin" mode
- `isLoading`: Loading state for API calls
- `message`: Status messages (success/error)
- `accessLevel`: Currently selected access level
- `permissions`: Object containing all permission toggles

#### Methods
- `handleSearch`: Handles search form submission
- `handleUserSelect`: Selects a user for sub-admin assignment
- `handleSubmit`: Submits a new sub-admin assignment
- `handleUpdate`: Updates an existing sub-admin's permissions
- `handleEdit`: Loads a sub-admin's data into the edit form
- `handleRemove`: Removes a sub-admin's access
- `handleCancel`: Cancels the current operation
- `handlePermissionChange`: Toggles individual permission checkboxes
- `getPermissionCount`: Counts the number of active permissions
- `formatDate`: Formats timestamps for display

## Data Structure

### User Object
```javascript
{
  id: string,              // Unique user identifier (e.g., 'USR1001')
  username: string,        // User's username
  email: string,           // User's email address
  phone: string,           // User's phone number
  status: 'active' | 'suspended'  // Account status
}
```

### Sub-Admin Object
```javascript
{
  userId: string,         // Reference to user ID
  username: string,        // Username for display
  email: string,          // Email for reference
  accessLevel: 'limited' | 'full' | 'custom',  // Access level
  status: 'active' | 'suspended'  // Sub-admin status
}
```

## UI Components
- **Search Bar**: For finding users by various criteria
- **Results Table**: Displays matching users with action buttons
- **Access Level Form**: For assigning access levels to new sub-admins
- **Status Alerts**: Show success/error messages
- **Loading States**: For better user feedback during operations

## Future Enhancements
- Implement role-based access control (RBAC)
- Add bulk operations for multiple users
- Include sub-admin activity logs
- Add email notifications for access grants/updates/revocations
- Implement two-factor authentication for sensitive actions
- Add IP whitelisting for sub-admin access
- Include permission inheritance and role hierarchies
- Add export functionality for audit purposes

## Dependencies
- CoreUI React components
- React Router for navigation
- CoreUI Icons

## Navigation
- Accessible via the sidebar menu under "Sub-Admins"
- Direct link: `/sub-admins`

## Error Handling
- Form validation for required fields
- Error messages for failed operations
- Loading states during API calls
