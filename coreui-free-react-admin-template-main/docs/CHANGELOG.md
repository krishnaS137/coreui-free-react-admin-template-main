# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- **Admin Authentication System**
  - Dedicated `admins` table for admin accounts
  - Secure login and registration flow
  - Session management with localStorage
  - Protected routes and authentication checks
  - Comprehensive documentation in `docs/admin-authentication.md`
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

### Fixed
- Fixed form validation in User Actions page
- Improved error handling for status updates
- Fixed UI issues in action history table
- Added "Actions" button to User Profile page
- Documentation for User Actions feature

### Changed
- Refactored UserProfile component with custom hook for better code organization
- Improved video player behavior with proper cleanup on modal close
- Enhanced error handling and user feedback in video components
- Optimized performance with React.memo and useCallback
- Improved mobile responsiveness and touch controls
- Updated routing to include new User Actions page

### Fixed
- Resolved React Hooks order violation in UserProfile component
- Fixed video playback cleanup when closing modal
- Addressed potential memory leaks in video components
- Fixed duplicate function declarations in UserProfile.js

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
