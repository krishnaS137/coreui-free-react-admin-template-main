# Competitions Management

This document provides an overview of the Competitions management feature in the admin panel.

## Overview
The Competitions section allows administrators to create and manage gaming competitions, including setting up competition details, tracking status, and viewing existing competitions.

## Features

### Create Competition
- Form to create new competitions with the following fields:
  - **Competition Name** (required)
  - **Registration Start Date & Time** (must be in the future)
  - **Live On** (must be after registration start)
  - **End On** (must be after live date)
  - **Competition Type** (Public/Private)
  - **Competition Criteria**
  - **Max Participants** (optional)
  - **Description** (rich text supported)
  - **Disqualification Criteria**
  - **Entry Fee**
  - **Rules**
  - **Prize Money** for 1st, 2nd, and 3rd positions
  - **Competition Image** (with preview)

### View Competitions
- Displays all competitions in a sortable and searchable table
- Shows key information: Name, Type, Registration Start, Live Date, End Date, and Status
- Color-coded status badges:
  - **Draft**: Gray (not yet open for registration)
  - **Registration Open**: Blue (players can register)
  - **Live**: Yellow (competition is active)
  - **Completed**: Green (competition has ended)
  - **Cancelled**: Red (competition was cancelled)

### Filtering and Search
- **Date Range Filter**:
  - From Date: Filter competitions starting after this date
  - To Date: Filter competitions ending before this date
- **Status Filter**: View competitions by status (All, Draft, Registration Open, Live, Completed, Cancelled)
- **Search**: Search across competition names and types

## Components

### Competitions.js
Handles the creation of new competitions.

#### State
- `formData`: Object containing all form field values
- `dateErrors`: Object containing validation errors for date fields
- `previewUrl`: URL for the uploaded competition image preview
- Form validation states for required fields

### ViewCompetitions.js
Displays and manages the list of competitions.

#### State
- `filters`: Object containing current filter values
  - `search`: Search term
  - `fromDate`: Start date filter
  - `toDate`: End date filter
  - `status`: Selected status filter (Draft, Registration Open, Live, Completed, Cancelled)

## Navigation
- **Create Competition**: `/competitions` or `/competitions/create`
- **View Competitions**: `/competitions/view`
- Accessible via the sidebar menu under the "Competitions" section

## Data Structure

### Competition Object
```javascript
{
  id: number,
  name: string,
  type: 'Public' | 'Private',
  registrationStartDate: string (ISO date),
  liveOn: string (ISO date),
  endOn: string (ISO date),
  status: 'Draft' | 'Registration Open' | 'Live' | 'Completed' | 'Cancelled',
  maxParticipants: number | null,
  description: string,
  disqualificationCriteria: string,
  entryFee: number,
  rules: string,
  position1Prize: number,
  position2Prize: number,
  position3Prize: number,
  image: string | null,
  registrationOpen: boolean
}
```

## API Integration
Currently using mock data. Replace with actual API calls when backend is available.

## Dependencies
- CoreUI React components
- React Router for navigation
- Date-fns for date manipulation and formatting

## Date Validation Rules
1. **Registration Start Date**:
   - Must be in the future
   - Sets the minimum date for Live On field
2. **Live On Date**:
   - Must be after registration start date
   - Must be in the future
   - Sets the minimum date for End On field
3. **End On Date**:
   - Must be after Live On date
   - Must be in the future

## Recent Updates
- Added registration start date with validation
- Implemented date dependency between registration, live, and end dates
- Added status management with five distinct states
- Added image upload with preview functionality
- Enhanced form validation and user feedback
- Improved responsive layout for all screen sizes

## Future Enhancements
- Add competition editing functionality
- Implement bulk actions for competitions
- Add participant management
- Include competition statistics and analytics
- Add CSV/Excel export for competition data
- Implement email notifications for status changes
- Add competition categories and tags for better organization
