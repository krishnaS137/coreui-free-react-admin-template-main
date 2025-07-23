# Sub-Admin Management

This document provides an overview of the Sub-Admin management feature in the admin panel.

## Overview
The Sub-Admin Management section allows administrators to manage administrative access for other users. This feature helps in delegating administrative tasks while maintaining control over access levels.

> **Note:** This feature is currently in development and uses mock data. The UI is ready for backend integration.

## Features

### User Management
- View list of all sub-admins
- Add new sub-admins from existing employees
- Edit existing sub-admin permissions
- Remove sub-admin access when needed

### Role-Based Access Control (RBAC)
- **Super Admin**: Full access to all features
- **Admin**: Customizable access based on permissions
- **Employee**: Basic access with limited permissions

### Permission Management (Planned)
- Granular control over access to each management section:
  - User Management
  - Sub-Admin Management
  - Notifications Management
  - Competitions Management
  - Videos Management
  - Withdraw Management
  - Feedback Management

## Current Implementation Status

### Data Storage
- Currently uses mock data stored in `src/views/sub-admins/SubAdmin.js`
- Ready for backend integration with the `employees` table

### UI Components
- **SubAdmin.js**: Main component for managing sub-admins
- **User Search**: Search functionality to find employees
- **Permission Toggles**: UI for managing access levels
- **Confirmation Dialogs**: For critical actions like removal

### Technical Details
- Built with React and CoreUI components
- Uses React hooks for state management
- Responsive design that works on all screen sizes
- Loading states during operations
- Error handling for API interactions

## Database Schema (Planned)

```sql
-- Employees table (existing)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'employee'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions table (planned)
CREATE TABLE employee_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  permission_key VARCHAR(100) NOT NULL,
  has_permission BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, permission_key)
);
```

## Integration Points

### Backend API Endpoints (To Be Implemented)
- `GET /api/sub-admins` - List all sub-admins
- `POST /api/sub-admins` - Create new sub-admin
- `PUT /api/sub-admins/:id` - Update sub-admin permissions
- `DELETE /api/sub-admins/:id` - Remove sub-admin access

### Frontend Integration
- Uses Axios for API calls (to be implemented)
- Error handling and user feedback
- Loading states during API operations

## Security Considerations
- Role-based access control for all operations
- Input validation on both client and server
- Audit logging for all administrative actions
- Rate limiting for API endpoints

## Future Enhancements
1. **Real-time Updates**
   - WebSocket integration for live updates
   - Notification system for permission changes

2. **Advanced Search**
   - Filter sub-admins by role/permission
   - Search by name, email, or permission

3. **Bulk Operations**
   - Bulk import/export of sub-admins
   - Batch permission updates

4. **Audit Logs**
   - Track all permission changes
   - Exportable activity reports
