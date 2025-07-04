# Packages Management

## Overview
The Packages Management page allows administrators to create, view, edit, and delete coin packages that users can purchase. Each package includes a set number of coins at a specific price, with optional discounts and promotional features.

## Features

### Package Creation & Editing
- Create new coin packages with customizable details
- Edit existing packages to update pricing or features
- Set discount percentages (0-100%)
- Mark packages as "Famous" for special promotion
- Toggle package status (Active/Inactive)

### Package List
- View all available packages in a sortable table
- See original and discounted prices
- Identify famous packages with visual indicators
- Quick status toggling
- Edit and delete actions

### Form Validation
- Required field validation
- Price and discount validation
- Real-time discount calculation
- Form feedback for errors

## Data Structure

### Package Object
```typescript
{
  id: string;             // Unique identifier
  name: string;           // Package name
  coins: number;          // Number of coins in package
  price: number;          // Base price in USD
  discount: number;       // Discount percentage (0-100)
  isFamous: boolean;      // Whether package is marked as famous
  isActive: boolean;      // Whether package is available for purchase
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}
```

## Components

### PackageForm
Handles the creation and editing of packages.

#### Props
- `initialData`: Object containing package data for editing (optional)
- `onSubmit`: Function to call when form is submitted
- `onCancel`: Function to call when editing is cancelled
- `isSubmitting`: Boolean indicating if form is submitting

### PackageList
Displays all packages in a sortable, filterable table.

#### Props
- `packages`: Array of package objects
- `onEdit`: Function called when edit button is clicked
- `onDelete`: Function called when delete button is clicked
- `onToggleStatus`: Function called when status is toggled

## State Management

### Form State
```javascript
{
  name: string;
  coins: string | number;
  price: string | number;
  discount: number;
  isFamous: boolean;
  isActive: boolean;
}
```

### UI State
- `editingPkg`: ID of package being edited (null if creating new)
- `isSubmitting`: Boolean indicating if form is submitting
- `error`: Error message (if any)
- `success`: Success message (if any)

## API Integration

### Fetch Packages
```javascript
const { data, error } = await supabase
  .from('packages')
  .select('*');
```

### Create Package
```javascript
const { data, error } = await supabase
  .from('packages')
  .insert([packageData])
  .select();
```

### Update Package
```javascript
const { error } = await supabase
  .from('packages')
  .update(updatedData)
  .eq('id', packageId);
```

### Delete Package
```javascript
const { error } = await supabase
  .from('packages')
  .delete()
  .eq('id', packageId);
```

## Future Enhancements
- Bulk import/export of packages
- Package categories and tags
- Time-limited discounts
- Purchase analytics
- Package preview for users
- Multi-currency support
- Tax calculation
- Coupon code integration

## Dependencies
- @coreui/react
- @coreui/icons-react
- react
- react-router-dom
- @supabase/supabase-js
