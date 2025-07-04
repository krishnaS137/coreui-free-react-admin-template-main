# Feedbacks Management

This document provides an overview of the Feedbacks management feature in the admin panel.

## Overview
The Feedbacks section allows administrators to view, manage, and respond to user feedback. It provides tools to track feedback status and maintain communication with users.

## Features

### Feedback List
- Displays all feedback in a sortable and paginated table
- Filter feedback by status: Pending or Replied
- Search functionality to find feedback by username, message, or ID
- Pagination for easy navigation

### Feedback Details & Reply
- View detailed feedback information
- Reply to feedback directly from the interface
- View reply history
- Mark feedback as resolved

## Components

### Feedbacks.js
Main component that handles the display and management of feedback.

#### State
- `filters`: Object containing current filter values
  - `status`: Selected status filter ('all', 'pending', 'replied')
  - `search`: Current search term
- `currentPage`: Current page number for pagination
- `isReplying`: Loading state during reply submission
- `replyText`: Current reply text
- `selectedFeedback`: Currently selected feedback item
- `showReplyModal`: Controls visibility of the reply modal

#### Methods
- `handleFilterChange`: Updates filters when dropdown or search input changes
- `handleReplyClick`: Opens the reply modal for a feedback item
- `handleSendReply`: Submits the admin's reply
- `formatDate`: Formats date strings for display
- `getStatusBadge`: Returns a styled status badge
- `getRatingStars`: Converts numeric rating to star display

## Data Structure

### Feedback Object
```javascript
{
  id: string,              // Unique feedback identifier (e.g., 'FB001')
  userId: string,          // ID of the user who submitted the feedback
  username: string,         // Username of the submitter
  phone: string,            // User's phone number
  email: string,            // User's email
  message: string,          // Feedback content
  rating: number,           // User rating (1-5)
  status: 'pending' | 'replied',  // Current status
  createdAt: string,        // ISO timestamp of submission
  repliedAt: string,        // ISO timestamp of reply (if any)
  adminReply: string       // Admin's reply (if any)
}
```

## UI Components
- **Status Badges**: Visual indicators for feedback status
- **Rating Stars**: Visual representation of user ratings
- **Reply Modal**: Popup for viewing and responding to feedback
- **Search and Filter**: Combined search and filter controls
- **Responsive Table**: Adapts to different screen sizes

## API Integration
- Currently uses mock data
- Ready to be connected to a real API
- Includes loading states and error handling

## Navigation
- Accessible via the sidebar menu under "Feedbacks"
- Direct link: `/feedbacks`

## Error Handling
- Displays error messages for failed operations
- Shows loading states during API calls
- Input validation for reply messages

## Dependencies
- CoreUI React components
- React Router for navigation
- Date-fns for date formatting
- CoreUI Icons

## Future Enhancements
- Email notifications for new feedback and replies
- Feedback categories and tags
- Export functionality (CSV/Excel)
- User notification when their feedback receives a reply
- Integration with help desk/ticketing systems
- Feedback analytics and reporting
