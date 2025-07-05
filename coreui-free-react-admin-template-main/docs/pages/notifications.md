# Notifications Management

## Overview
Created on: 2025-06-22  
Last Updated: 2025-07-05  

## Purpose
The Notifications system allows administrators to create and manage notifications that can be sent to users. It supports various notification types including instant and scheduled notifications, with rich content and images.

## Features

### Create Notification
- **Notification Type**:
  - Single User
  - All Users
  - Competition Participants
  - Schedule (for future delivery)
  - Schedule Multiple (recurring)
- **Content**:
  - Title (required)
  - Message (rich text supported)
  - Image upload with preview (optional)
    - Supports drag & drop or click to select
    - Shows preview of selected image
    - Can be removed before sending
- **Scheduling**:
  - For "Schedule" and "Schedule Multiple" types:
    - Date and time picker appears
    - Only future dates/times can be selected
    - Timezone-aware scheduling
- **Form Validation**:
  - All required fields must be filled
  - Image size and type validation
  - Date validation for scheduled notifications

### Notification History
- Displays all sent notifications in a sortable table
- Shows key information:
  - Title
  - Type
  - Date Sent
  - Status (Sent, Pending, Failed)
  - Number of recipients
- **Filtering**:
  - Search by title or content
  - Filter by notification type
  - Filter by date range
  - Filter by status
- **Actions**:
  - View notification details
  - Resend failed notifications
  - Export notification history (CSV/Excel)

## Implementation Details

### File Structure
```
src/
  views/
    notifications-page/       # Create notifications
      Notifications.js       # Main component for creating notifications
      index.js               # Export file
      
    notification-history/    # View notification history
      NotificationHistory.js # Main component for viewing history
      index.js               # Export file
      
    components/              # Shared components (if any)
    hooks/                   # Custom hooks
    utils/                   # Utility functions
```

### Data Structure
```javascript
// Notification Object
{
  id: string,
  type: 'single' | 'all' | 'competition' | 'schedule' | 'schedule_multiple',
  title: string,
  content: string,
  imageUrl: string | null,
  scheduledFor: string | null,  // ISO date string
  status: 'draft' | 'scheduled' | 'sent' | 'failed',
  createdAt: string,            // ISO date string
  sentAt: string | null,        // ISO date string
  recipients: number,
  failedRecipients: number
}
```

## Recent Updates
- Added support for scheduled notifications
- Implemented image upload with preview
- Added date picker for scheduling
- Improved form validation and error handling
- Enhanced notification history with better filtering
- Added status tracking for notifications
- Improved responsive design for all screen sizes

## Future Enhancements
- Add support for notification templates
- Implement notification preview before sending
- Add bulk notification management
- Include read receipts and engagement metrics
- Add support for rich media content (videos, GIFs)
- Implement notification scheduling with timezones
- Add user segmentation for targeted notifications

### Component Structure
```jsx
<Notifications>
  <NotificationFilters />
  <NotificationList>
    <NotificationItem />
    <NotificationItem />
    ...
  </NotificationList>
  <NotificationActions />
</Notifications>
```

### Data Structure
```javascript
{
  id: string | number,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  date: string, // ISO date string
  read: boolean
}
```

## Integration

### Routing
- Path: `/notifications`
- Lazy loaded for better performance
- Added to main navigation

### Dependencies
- CoreUI components for UI
- React hooks for state management
- (Future) API integration for real data

## Future Enhancements
1. Real-time updates using WebSocket
2. Notification preferences
3. Bulk actions
4. Pagination for large notification sets
5. Notification sounds

## Related Files
- `src/views/notifications/Notifications.js`
- `src/routes.js`
- `src/_nav.js`
