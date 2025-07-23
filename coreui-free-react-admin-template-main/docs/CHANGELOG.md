# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Redesigned Withdraw Requests with an improved workflow:
  - Added new status options: Pending, Approved, Processing, Completed, Rejected, Cancelled
  - Created a dedicated detail page for each withdraw request
  - Removed inline approve/decline buttons in favor of a detail view
  - Added admin notes and status tracking
  - Improved status filtering and search functionality
  - Added visual indicators for different statuses

- Renamed 'Feedbacks' to 'Tickets' throughout the application
- Completely redesigned Tickets system with the following improvements:
  - Added subject-based categorization with 6 predefined types:
    - Others
    - Competition
    - Account
    - Withdraw coins
    - Purchase Packages
    - Account Deactivation
  - Removed ratings column and replaced with subject badges
  - Added image upload support with thumbnail previews
  - Enhanced ticket details view with better organization
  - Improved search functionality to include subject and message content
  - Updated status indicators and action buttons for better UX
  - Added visual indicators for tickets with attachments
  - Improved mobile responsiveness of the tickets table
- Renamed 'Coins' to 'Packages' in the navigation menu
- Updated route from '/coins' to '/packages' for better semantics
- Completely redesigned Packages page with new coin calculation system:
  - Implemented 1 INR = 10 coins conversion rate
  - Replaced discount system with bonus coins percentage
  - Added real-time coin calculation based on price
  - Improved UI to show base coins and bonus coins clearly
  - Updated form validation and error messages
  - Changed Active status from switch to checkbox for better UX
  
### Notification System Updates
- **Notification Creation**:
  - Added date and time picker for scheduled notifications
  - Improved form layout for better user experience
  - Added validation for scheduled dates (must be in the future)
- **Notification History**:
  - Removed status column from the notifications table
  - Simplified the table view for better readability
  - Updated mock data to match the new structure

### Competitions Page Updates
- **Create Competition Form**:
  - Added max participants field (optional number input)
  - Added competition description (rich text area)
  - Added disqualification criteria field
  - Added image upload functionality with preview
  - Improved form layout and spacing
  - Added form validation and user feedback
  - Added registration start date field with date-time picker
  - Implemented date validation to ensure: Current time < registration start date < live date < end date
  - Added visual feedback for date validation errors
  - Disabled date pickers until previous date is selected
  - Added minimum date constraints to prevent selecting invalid dates
  - Improved form layout with responsive grid for date fields
  - Added clear error messages for date validation failures
- **View Competitions**:
  - Updated status options to: Draft, Registration Open, Live, Completed, Cancelled
  - Added color-coded status badges for better visibility
  - Updated status filtering to match new status options
  - Enhanced mock data with new status values
- **Documentation**:
  - Updated CHANGELOG.md to reflect all competition-related changes
  - Added documentation for new form fields and their validation rules
  - Documented new status options and their meanings
  - Documented date validation changes in the Competitions form

### Added
- User Status Management system with four status types: normal, warned, suspended_7days, suspended_indefinite
- Automatic expiration for 7-day suspensions
- Database schema for user status tracking and action history
- User Actions page with status management and action history
- Action logging for all status changes
- Action history table showing complete audit trail
- Documentation for status management and action history

### Changed
- Enhanced User Actions page with action history section
- Improved status change workflow with required reason/message
- Updated database schema to include action tracking
- Improved error handling and user feedback
- **BREAKING**: Completely redesigned authentication system
  - Removed Supabase Auth dependency
  - Simplified to use direct database checks against `employees` table
  - Removed password requirements and email confirmation
  - Updated session management to use localStorage
  - Removed registration page and related components
  - Updated documentation to reflect new authentication flow
- Refactored UserProfile component with custom hook for better code organization
- Improved video player behavior with proper cleanup on modal close
- Enhanced error handling and user feedback in video components
- Optimized performance with React.memo and useCallback
- Improved mobile responsiveness and touch controls
- Updated routing to include new User Actions page

### Removed
- Supabase Auth integration
- Password requirements and hashing
- Email confirmation flow
- Registration functionality
- Unused authentication-related components

### Fixed
- Fixed form validation in User Actions page
- Improved error handling for status updates
- Fixed UI issues in action history table
- Added "Actions" button to User Profile page
- Documentation for User Actions feature
- Resolved React Hooks order violation in UserProfile component
- Fixed video playback cleanup when closing modal
- Addressed potential memory leaks in video components
- Fixed duplicate function declarations in UserProfile.js
- Fixed RLS policy issues preventing admin registration
- Resolved duplicate function declarations in auth service
- Improved error messages for authentication failures

## [1.3.0] - 2025-06-29
### Added
- Renamed Coins page to Packages with enhanced functionality
- Added discount percentage field to packages
- Added IsFamous flag for featured packages
- Implemented Active/Inactive status toggle for packages
- Added comprehensive package management (CRUD operations)
- Created package list view with sorting and filtering
- Added real-time discount calculation
- Included detailed documentation for Packages feature
- Withdraw Requests management page with status filtering (Pending, Completed, Declined)
- Search functionality for withdraw requests by username or request ID
- Approve/Decline actions for pending requests
- Detailed view of withdraw request information
- Comprehensive documentation for the Withdraw Requests feature
- Feedback management system with reply functionality
- Status filtering (Pending, History)
- Reply modal for responding to feedback
- Documentation for Feedbacks feature
- Sub-Admin Management page with granular permissions
- Employee search and selection
- Access level assignment
- Permissions management with checkboxes
- List view of current sub-admins with edit/remove actions
- Comprehensive documentation for Sub-Admin Management
- Tasks Management page for assigning and tracking employee tasks
- Employee search functionality
- Task assignment with priority levels
- Task status tracking (Pending, In Progress, Completed)
- Comprehensive documentation for Tasks Management

### Changed
- Updated Notification History page with new notification types:
  - Single
  - Competition
  - Selective User
- Updated notifications documentation to reflect new notification types

## [1.2.0] - 2025-06-22
### Added
- Competitions management feature with create and view functionality
- Competitions filtering by status (Upcoming, Live, Finished) and date range
- Videos management page with filtering by status (Public, Private, Draft, Rejected)
- Username search functionality for videos
- Delete functionality for videos with confirmation dialog
- Documentation for new features

### Changed
- Updated navigation to include Competitions and Videos sections
- Improved form validation and user feedback
- Enhanced UI/UX for better usability

## [1.1.0] - 2025-06-22
### Added
- Initial documentation structure
- Notifications page with filtering and read/unread functionality
- CHANGELOG.md to track all changes

### Changed
- Improved project organization with better file structure
- Updated navigation to include new Notifications page

## [1.0.0] - 2025-06-22
### Added
- Initial project setup with CoreUI React Admin Template
- Basic routing and navigation structure
- User management pages
