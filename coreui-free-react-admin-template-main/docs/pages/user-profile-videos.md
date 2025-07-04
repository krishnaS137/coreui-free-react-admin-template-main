# User Profile Videos

## Overview
This document outlines the implementation of video display functionality in the User Profile page. The feature allows admins to view videos associated with a user's profile.

## Database Schema

### Videos Table
```sql
CREATE TABLE public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'pending',
  duration INTEGER,  -- in seconds
  size INTEGER,      -- in bytes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for user queries
CREATE INDEX idx_videos_user_id ON public.videos(user_id);
```

## Implementation Details

### Frontend Components
- **UserProfile.js**: Main component displaying user details and videos
  - Refactored with a custom hook (`useUserProfile`) for better code organization and hook management
  - Added video tab with responsive grid layout (1-3 columns based on screen size)
  - Implemented video loading states and error handling with proper cleanup
  - Added interactive video cards with hover effects and play button overlay
  - Implemented modal video player with full details and proper cleanup on close
  - Added utility functions for formatting duration and file size
  - Included smooth animations and transitions using CSS
  - Ensured mobile responsiveness with touch-friendly controls
  - Added keyboard accessibility for modal controls (Escape to close, Space/Enter to play/pause)
  - Optimized performance with React.memo and useCallback where appropriate
  - Added proper cleanup of event listeners and video resources
  - Improved error handling and user feedback

## Features

### Video Grid
- Responsive grid layout (1 column on mobile, 2 on tablets, 3 on desktops)
- Hover effects with smooth transitions
- Clean card-based design with thumbnails
- Shows video duration overlay
- Displays title and truncated description
- Shows upload date and file size

### Video Player Modal
- Click any video to open in a full-screen modal
- Clean, modern player with controls
- Shows video title and full description
- Displays video metadata (duration, size, upload date)
- Click outside the modal to close
- Smooth animations and transitions

### States
- Loading state with spinner
- Error handling with user-friendly messages
- "No videos" state with helpful message
- Empty state with icon when no videos available

### Storage
- Uses Supabase Storage with a public bucket
- Videos are stored in a bucket named `user_videos`
- No direct upload from the UI - videos are uploaded manually via Supabase dashboard

## How to Use

### Adding Videos
1. Upload video file to Supabase Storage in the `user_videos` bucket
2. Insert a record into the `videos` table with the following details:
   ```sql
   INSERT INTO public.videos (
     user_id,
     title,
     description,
     video_url,
     thumbnail_url,
     duration,
     size
   ) VALUES (
     'user-uuid-here',
     'Video Title',
     'Optional video description',
     'https://your-supabase-url.supabase.co/storage/v1/object/public/user_videos/path/to/video.mp4',
     'https://your-supabase-url.supabase.co/storage/v1/object/public/thumbnails/thumbnail.jpg',
     120,  -- duration in seconds
     5000000  -- size in bytes
   );
   ```

### Viewing Videos
1. Navigate to a user's profile
2. Click on the "Videos" tab
3. Browse videos in the responsive grid
4. Click any video to open it in the modal player
5. Use the player controls to play/pause, adjust volume, etc.
6. Click outside the video or press Escape to close the modal

## Dependencies
- @coreui/react components
- react-player or native HTML5 video player
- Supabase client for data fetching

## Notes
- The bucket is set to public for video viewing
- No user-facing upload functionality - all uploads are managed by admins via Supabase dashboard
- Videos are automatically associated with users via the `user_id` foreign key
