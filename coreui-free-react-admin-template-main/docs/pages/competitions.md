# Competitions Management

This document provides an overview of the Competitions management feature in the admin panel.

## Overview
The Competitions section allows administrators to create and manage competitions, including setting up competition details, tracking status, and viewing existing competitions.

## Features

### Create Competition
- Form to create new competitions with the following fields:
  - Competition Name
  - Live On (Start Date)
  - End On (End Date)
  - Competition Type
  - Competition Criteria
  - Entry Fee
  - Rules
  - Prize Money for 1st, 2nd, and 3rd positions

### View Competitions
- Displays all competitions in a sortable and searchable table
- Shows key information: Name, Type, Start Date, End Date, and Status
- Status is automatically calculated as:
  - Upcoming: Start date is in the future
  - Live: Current date is between start and end dates
  - Finished: End date is in the past

### Filtering and Search
- **Date Range Filter**:
  - From Date: Filter competitions starting after this date
  - To Date: Filter competitions ending before this date
- **Status Filter**: View competitions by status (All, Upcoming, Live, Finished)
- **Search**: Search across competition names, types, and statuses

## Components

### Competitions.js
Handles the creation of new competitions.

#### State
- `formData`: Object containing all form field values
- Form validation states for required fields

### ViewCompetitions.js
Displays and manages the list of competitions.

#### State
- `filters`: Object containing current filter values
  - `search`: Search term
  - `fromDate`: Start date filter
  - `toDate`: End date filter
  - `status`: Selected status filter

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
  type: string,
  startDate: string (ISO date),
  endDate: string (ISO date),
  status: 'Upcoming' | 'Live' | 'Finished',
  entryFee: number,
  rules: string,
  prizeMoney: {
    first: number,
    second: number,
    third: number
  },
  criteria: string
}
```

## API Integration
Currently using mock data. Replace with actual API calls when backend is available.

## Dependencies
- CoreUI React components
- React Router for navigation
- Date-fns for date manipulation and formatting

## Future Enhancements
- Add competition editing functionality
- Implement bulk actions for competitions
- Add participant management
- Include competition statistics and analytics
- Add image upload for competition banners
- Implement CSV/Excel export for competition data
