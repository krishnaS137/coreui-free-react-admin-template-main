# Notifications Page

## Overview
Created on: 2025-06-22  
Last Updated: 2025-06-25  

## Purpose
The Notifications page provides users with a centralized location to view and manage system notifications. This includes features for filtering, marking notifications as read, and viewing notification details.

## Implementation Details

### File Structure
```
src/
  views/
    notifications-page/    # Main notifications feature
      Notifications.js    # Main component
      index.js            # Export file
      components/         # Sub-components (if any)
      hooks/              # Custom hooks
      utils/              # Utility functions
```

### Migration Notes
- Moved from `src/views/notifications/` to `src/views/notifications-page/` on 2025-06-22
- Old notification components (alerts, badges, modals, toasts) were removed as they were part of the template examples
- The new structure follows a feature-based organization pattern

### Features
1. **Notification List**
   - Displays notifications in a sortable table
   - Shows notification title, message, type, and timestamp
   - Visual indicators for read/unread status

2. **Filtering**
   - Search by notification content
   - Filter by notification type:
     - All
     - Single
     - Competition
     - Selective User
   - Filter by date range (From/To)

3. **Actions**
   - Mark individual notifications as read
   - Mark all notifications as read
   - (Future) Delete notifications

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
