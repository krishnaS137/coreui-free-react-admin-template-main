# User Status Management

## Overview
This document outlines the user status management system, which allows administrators to manage user account statuses including warnings, suspensions, and account restrictions.

## Database Schema

### Users Table Additions
```sql
-- Status column with allowed values
ALTER TABLE users 
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'normal';

-- For tracking 7-day suspensions
ALTER TABLE users 
ADD COLUMN suspended_until TIMESTAMP WITH TIME ZONE;

-- Constraint to ensure valid status values
ALTER TABLE users 
ADD CONSTRAINT valid_status 
CHECK (status IN ('normal', 'warned', 'suspended_7days', 'suspended_indefinite'));

-- Auto-expiry function for 7-day suspensions
CREATE OR REPLACE FUNCTION check_expired_suspensions()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET status = 'normal',
        suspended_until = NULL
    WHERE status = 'suspended_7days'
    AND suspended_until IS NOT NULL
    AND suspended_until < NOW();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run the expiry check
CREATE TRIGGER check_suspension_trigger
AFTER INSERT OR UPDATE ON users
FOR EACH STATEMENT
EXECUTE FUNCTION check_expired_suspensions();
```

### User Actions Table
```sql
CREATE TABLE public.user_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  admin_id uuid NOT NULL,
  action_type text NOT NULL,
  action_details jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT user_actions_pkey PRIMARY KEY (id),
  CONSTRAINT user_actions_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_actions_admin_id_fkey FOREIGN KEY (admin_id) 
    REFERENCES public.users(id) ON DELETE SET NULL
);

-- Index for faster lookups
CREATE INDEX idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX idx_user_actions_created_at ON public.user_actions(created_at);
```

## Status Types

1. **Normal**
   - Default status for all users
   - No restrictions

2. **Warned**
   - User has received a warning
   - No functional restrictions, just a status indicator

3. **Suspended (7 days)**
   - Account is temporarily suspended
   - Auto-expires after 7 days
   - Uses `suspended_until` to track expiration

4. **Suspended (Indefinite)**
   - Account is permanently suspended
   - Requires manual intervention to restore

## UserActions Component
- **Location**: `/src/views/users/UserActions.js`
- **Purpose**: Manage user account status and restrictions

### Features
- View current user status
- Update status with reason
- Set 7-day or indefinite suspensions
- Send warnings to users
- Automatic handling of suspension expirations

### Status Change Flow

1. **Status Selection**
   - Admin selects the desired status from the dropdown
   - UI updates to show relevant fields based on selection
   - For 'normal' status, no additional input is required

2. **Reason/Message Input**
   - Required for all non-'normal' status changes
   - Minimum length: 10 characters
   - Maximum length: 500 characters
   - Purpose:
     - Documents the reason for the status change
     - Provides context for other administrators
     - Can be used for audit trails
     - Potential future use for user notifications

3. **Action Logging**
   - Every status change is recorded in the `user_actions` table
   - Includes:
     - Previous and new status
     - Timestamp
     - Admin who made the change
     - Any provided message/reason
   - Actions are displayed in the Action History section

3. **Suspension Duration (if applicable)**
   - For 'suspended_7days' status:
     - Default: 7 days
     - Configurable via number input
     - Minimum: 1 day
     - No maximum (but consider UX for very long durations)

4. **Validation**
   - Client-side validation ensures:
     - Required fields are filled
     - Reason meets length requirements
     - Suspension duration is valid
   - Server-side validation provides additional security

5. **Submission**
   - On successful submission:
     - Status is updated in the database
     - Suspension end time is calculated and stored (if applicable)
     - Success message is displayed
     - Form resets (except status field)
   - On error:
     - Error message is displayed
     - Form remains in edit mode
     - User can correct and retry

6. **Automatic Expiration**
   - For 7-day suspensions:
     - System automatically reverts to 'normal' after expiration
     - `suspended_until` is set to NULL
     - No action required from administrators

## Message/Reason Field

### Purpose
The message/reason field serves multiple important functions:

1. **Administrative Record**
   - Documents why a status change was made
   - Provides context for future reference
   - Helps maintain accountability

2. **Communication**
   - Can be used to inform users about policy violations (future implementation)
   - Sets clear expectations about account status

3. **Audit Trail**
   - Creates a record of administrative actions
   - Helps track patterns of user behavior
   - Useful for compliance and reporting

### Implementation Details

#### Storage
- Currently, the message is only displayed in the UI after submission
- Future implementation could store these messages in a separate `user_actions` table:
  ```sql
  CREATE TABLE user_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```

#### Validation Rules
1. **Client-Side**
   - Required for all non-'normal' status changes
   - Minimum length: 10 characters
   - Maximum length: 500 characters
   - Real-time feedback as user types

2. **Server-Side**
   - Additional validation for security
   - Sanitization to prevent XSS attacks
   - Rate limiting to prevent spam

#### Future Enhancements
1. **User Notifications**
   - Email notifications with the provided message
   - In-app notifications
   - Read receipts

2. **Message Templates**
   - Predefined templates for common scenarios
   - Custom variables (e.g., {username}, {date})
   - Multi-language support

3. **Message History**
   - View all messages sent to a user
   - Filter by date, type, or administrator
   - Export functionality

## Action History

The Action History section provides a complete audit trail of all status changes and administrative actions for a user.

### Features
- Displays the 10 most recent actions
- Shows date/time of each action
- Indicates the action type (status change, warning, etc.)
- Displays the status change (from → to) with color-coded badges
- Includes the reason/message provided
- Shows which administrator performed the action

### Sorting and Filtering
- Actions are sorted by creation date (newest first)
- Can be extended to include:
  - Date range filtering
  - Action type filtering
  - Search functionality

## Best Practices
- **Be Specific**: Clearly explain the reason for the status change
- **Be Professional**: Maintain a professional tone in all messages
- **Be Consistent**: Use similar language for similar situations
- **Be Timely**: Update statuses and provide reasons promptly
- **Document Everything**: All actions are logged for accountability

## Monitoring and Maintenance
- Regularly review status changes in the system
- Monitor the `suspended_until` column for pending expirations
- Consider implementing automated reports for:
  - Recently suspended accounts
  - Accounts approaching suspension expiration
  - Frequent status changers

## Troubleshooting
- If a 7-day suspension doesn't expire, check the `check_suspension_trigger`
- Ensure the database server timezone is correctly set
- Verify the trigger is active with `\d users` command
