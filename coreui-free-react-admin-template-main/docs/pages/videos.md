# Videos Management

This document provides an overview of the Videos management feature in the admin panel.

## Overview
The Videos page allows administrators to manage video content, including viewing, filtering, and deleting videos.

## Features

### Video List
- Displays all videos in a sortable and paginated table
- Shows key information: Title, Username, Status, Upload Date, and Views

### Filtering
- **Status Filter**: Filter videos by status:
  - Public
  - Private
  - Draft
  - Rejected
- **Username Search**: Search for videos by the uploader's username

### Actions
- **Delete**: Remove a video (with confirmation dialog)

## Components

### Videos.js
Main component that handles the display and management of videos.

#### State
- `videos`: Array of video objects
- `filters`: Object containing current filter values
  - `search`: Search term for username
  - `status`: Selected status filter

#### Methods
- `handleFilterChange`: Updates filters when filter inputs change
- `handleDelete`: Handles video deletion with confirmation

## API Integration
Currently using mock data. Replace with actual API calls when backend is available.

## Navigation
Accessible via the sidebar menu under the "Videos" section.

## Dependencies
- CoreUI React components
- React Router for navigation
- Date-fns for date formatting (if needed)

## Future Enhancements
- Add video preview functionality
- Implement bulk actions
- Add sorting by columns
- Include pagination for large datasets
- Add video details view
- Implement video editing functionality
