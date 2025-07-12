# Withdraw Requests Management

This document provides an overview of the Withdraw Requests management feature in the admin panel, which has been recently updated with a new workflow and additional status options.

## Overview
The Withdraw Requests section allows administrators to manage withdrawal requests from users through a streamlined workflow. The updated system now includes a dedicated detail view for each request and supports additional status options for better tracking of the withdrawal process.

## Features

### Withdraw Requests List
- Displays all withdrawal requests in a sortable and paginated table
- Filter requests by status: Pending, Approved, Processing, Completed, Rejected, or Cancelled
- Search functionality to find requests by username, request ID, or amount
- Pagination for easy navigation through the list
- Visual indicators for different request statuses
- Quick view of essential information:
  - Request ID
  - Username
  - Amount
  - Payment method
  - Request date
  - Current status with color-coded badges

### Request Details Page
- **Comprehensive Request Information**:
  - User details (username, email, user ID)
  - Transaction details (amount, payment method, account details)
  - Status history and timeline
  - User-provided notes
  - Admin notes and internal comments

- **Status Management**:
  - Update status through a dedicated interface
  - All status transitions are supported:
    - Pending → Approved/Rejected/Cancelled
    - Approved → Processing/Rejected/Cancelled
    - Processing → Completed/Rejected
  - Add admin notes with each status update

- **Timeline View**:
  - Track the complete history of the request
  - View timestamps for each status change
  - See which admin processed each update

## Components

### WithdrawRequests.js
Main component that displays the list of withdrawal requests with filtering and search capabilities.

#### State
- `filters`: Object containing current filter values
  - `status`: Selected status filter (All, Pending, Approved, Processing, Completed, Rejected, Cancelled)
  - `search`: Current search term
- `currentPage`: Current page number for pagination
- `isLoading`: Loading state during data fetching

### WithdrawRequestDetail.js
Component that handles the detailed view and processing of individual withdrawal requests.

#### State
- `request`: Current request data
- `loading`: Loading state during data fetching
- `saving`: Loading state during save operations
- `error`: Error message if any
- `success`: Success message after updates
- `formData`: Current form data for status updates

#### Methods
- `handleStatusChange`: Updates form data when inputs change
- `handleSubmit`: Submits the status update
- `getStatusBadge`: Returns a styled badge based on request status
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
