# Tasks Management

## Overview
Created on: 2025-06-22  
Last Updated: 2025-06-22  

## Purpose
The Tasks Management page allows administrators to assign, track, and manage tasks for employees. It provides a comprehensive interface for creating tasks, assigning them to employees, and monitoring their completion status.

## Features

### Task Assignment
- **Employee Search**: Quickly find employees by name or email
- **Task Details**: Add title, description, due date, and priority
- **Priority Levels**: Set task priority (Low, Medium, High, Urgent)
- **Status Tracking**: Monitor task progress (Pending, In Progress, Completed)

### Task Management
- **Task List**: View all tasks in a sortable table
- **Status Updates**: Mark tasks as complete/incomplete with checkboxes
- **Edit/Delete**: Modify or remove tasks as needed
- **Filtering**: Filter tasks by status or search by title/description

### Employee Features
- **Task Assignment**: Assign tasks to specific employees
- **Clear Deadlines**: Set and track due dates
- **Priority Indicators**: Visual indicators for task priority

## Data Structure

### Task Object
```typescript
{
  id: string;             // Unique identifier
  title: string;          // Task title
  description: string;    // Detailed task description
  assignedTo: string;     // Name of assigned employee
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;       // ISO date string
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;     // ISO timestamp
  completedAt?: string;   // ISO timestamp (if completed)
}
```

## Components

### TaskForm
Handles the creation and editing of tasks.

#### Props
- `onSubmit`: Function to handle form submission
- `initialData`: Object containing task data for editing (optional)
- `onCancel`: Function to handle form cancellation
- `isSubmitting`: Boolean indicating if form is submitting

### TaskList
Displays all tasks in a sortable, filterable table.

#### Props
- `tasks`: Array of task objects
- `onStatusChange`: Function called when task status changes
- `onEdit`: Function called when edit button is clicked
- `onDelete`: Function called when delete button is clicked

## API Integration

### Fetch Tasks
```javascript
// Example API call to fetch tasks
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .order('createdAt', { ascending: false });
```

### Create/Update Task
```javascript
// Example API call to create/update a task
const { data, error } = await supabase
  .from('tasks')
  .upsert([taskData])
  .select();
```

### Delete Task
```javascript
// Example API call to delete a task
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId);
```

## Usage

### Assigning a New Task
1. Click the "Assign New Task" button
2. Search for an employee by name or email
3. Fill in the task details (title, description, due date, priority)
4. Click "Assign Task" to save

### Updating Task Status
1. Locate the task in the task list
2. Click the checkbox to mark as complete/incomplete

### Editing a Task
1. Click the edit (pencil) icon next to the task
2. Make the necessary changes
3. Click "Update Task" to save changes

### Deleting a Task
1. Click the delete (trash) icon next to the task
2. Confirm the deletion in the dialog

## Future Enhancements
- Task categories and tags
- Task dependencies
- Recurring tasks
- Task comments and discussions
- File attachments
- Email notifications for task assignments and updates
- Time tracking
- Task templates
- Bulk operations
- Export/import functionality
