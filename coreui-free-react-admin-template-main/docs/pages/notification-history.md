# Notification History

## Overview
The Notification History page provides administrators with a comprehensive view of all sent notifications, including their status, recipients, and delivery details. This allows for tracking and management of all notification activities.

## Features

### Notification List
- Displays all sent notifications in a sortable and searchable table
- Shows key information for each notification:
  - Title
  - Type (Single, All Users, Competition, etc.)
  - Date Sent
  - Recipient Count
  - Status (Sent, Failed, Pending)
  - Actions (View Details, Resend)

### Filtering and Search
- **Search**: Filter notifications by title or content
- **Type Filter**:
  - All Types
  - Single User
  - All Users
  - Competition Participants
  - Scheduled
- **Date Range**:
  - From Date
  - To Date
- **Status Filter**:
  - All Statuses
  - Sent
  - Failed
  - Pending

### Actions
- **View Details**: See complete notification details
- **Resend**: Resend failed notifications
- **Export**: Export notification history (CSV/Excel)

## Data Structure

### Notification Object
```typescript
{
  id: string;               // Unique identifier
  title: string;            // Notification title
  content: string;          // Full notification content
  type: 'single' | 'all' | 'competition' | 'scheduled';
  status: 'sent' | 'failed' | 'pending';
  recipients: number;       // Number of recipients
  failedRecipients: number; // Number of failed deliveries
  sentAt: string;           // ISO date string
  scheduledFor: string;     // ISO date string (for scheduled notifications)
  imageUrl?: string;        // URL of attached image (if any)
  createdBy: string;        // ID of admin who sent the notification
}
```

## Components

### NotificationList
Displays the table of notifications with sorting and filtering capabilities.

#### Features
- Sort by date, type, or status
- Pagination for large result sets
- Responsive design for all screen sizes
- Loading states and error handling
- Empty state when no notifications match filters

### NotificationFilters
Handles the filtering and search functionality.

#### Filter Options
- **Search**: Full-text search across title and content
- **Type**: Dropdown to filter by notification type
- **Status**: Toggle to show/hide different statuses
- **Date Range**: Calendar pickers for date filtering

### NotificationActions
Handles actions for individual notifications.

#### Available Actions
- **View**: Show full notification details
- **Resend**: Retry sending failed notifications
- **Copy**: Copy notification content to clipboard
- **Export**: Export notification details

## Recent Updates
- Removed status column from the main table for cleaner UI
- Added more detailed status information in the notification details view
- Improved filtering and search performance
- Added bulk actions for multiple notifications
- Enhanced mobile responsiveness
- Added loading states and error handling

## Error Handling
- Displays user-friendly error messages
- Provides retry options for failed operations
- Logs all actions for audit purposes
- Validates filter inputs

## Future Enhancements
- Add notification templates
- Implement detailed delivery reports
- Add recipient engagement tracking
- Support for notification scheduling
- Integration with analytics dashboard
- Webhook support for real-time updates
- Custom notification templates with variables

## API Integration
All notification data is managed through the following API endpoints:

### List Notifications
```
GET /api/notifications
Query Parameters:
  - search: string (optional)
  - type: string (optional)
  - status: string (optional)
  - fromDate: string (ISO date, optional)
  - toDate: string (ISO date, optional)
  - page: number (optional)
  - limit: number (optional)
```

### Get Notification Details
```
GET /api/notifications/:id
```

### Resend Notification
```
POST /api/notifications/:id/resend
```

### Export Notifications
```
GET /api/notifications/export
Query Parameters: (same as list)
```

## Permissions
- **View History**: All admin users
- **Resend Notifications**: Admin users with 'notifications:resend' permission
- **Export Data**: Admin users with 'data:export' permission
