# Withdraw Requests Management

This document provides an overview of the Withdraw Requests management feature in the admin panel.

## Overview
The Withdraw Requests section allows administrators to manage withdrawal requests from users, including viewing request details, approving, and declining requests.

## Features

### Withdraw Requests List
- Displays all withdrawal requests in a paginated table
- Filter requests by status: Pending, Completed, or Declined
- Search functionality to find requests by username or request ID
- Pagination for easy navigation through the list
- Detailed view of each request including:
  - Request ID
  - Username
  - Amount
  - Payment method and account details
  - Request and processing timestamps
  - Current status with visual indicators

### Request Actions
- **Approve**: Mark a pending request as completed
- **Decline**: Reject a pending request (with optional reason)
- **View Details**: See complete request information

## Components

### WithdrawRequests.js
Main component that handles the display and management of withdrawal requests.

#### State
- `filters`: Object containing current filter values
  - `status`: Selected status filter (All, Pending, Completed, Declined)
  - `search`: Current search term
- `currentPage`: Current page number for pagination
- `isProcessing`: Loading state during request processing

#### Methods
- `handleFilterChange`: Updates filters when dropdown or search input changes
- `handleStatusUpdate`: Handles approving or declining requests
- `getStatusBadge`: Returns a styled badge based on request status
- `getStatusIcon`: Returns an icon based on request status
- `formatDate`: Formats date strings for display
- `formatCurrency`: Formats currency values consistently

## Data Structure

### Withdraw Request Object
```javascript
{
  id: string,              // Unique request identifier (e.g., 'WD001')
  userId: string,          // ID of the user making the request
  username: string,         // Username of the requester
  amount: number,           // Withdrawal amount
  paymentMethod: string,    // Payment method (e.g., 'Bank Transfer', 'PayPal')
  accountDetails: string,  // Masked account details
  status: string,           // 'Pending', 'Completed', or 'Declined'
  requestedAt: string,      // ISO timestamp of request
  processedAt: string,      // ISO timestamp of processing (if completed/declined)
  declineReason: string    // Optional reason for decline
}
```

## UI Components
- **Status Badges**: Color-coded indicators for request status
- **Action Buttons**: Conditional buttons based on request status
- **Search and Filter**: Combined search and filter controls
- **Responsive Table**: Adapts to different screen sizes

## API Integration
- Currently uses mock data
- Ready to be connected to a real API
- Includes loading states and error handling

## Navigation
- Accessible via the sidebar menu under "Withdraw Requests"
- Direct link: `/withdraw-requests`

## Error Handling
- Displays error messages for failed operations
- Shows loading states during API calls
- Confirmation dialogs for destructive actions

## Dependencies
- CoreUI React components
- React Router for navigation
- Date-fns for date formatting
- CoreUI Icons

## Future Enhancements
- Bulk actions for multiple requests
- Export functionality (CSV/Excel)
- Advanced filtering options
- Request notes/comments
- Audit trail for request changes
- Email notifications for status updates
