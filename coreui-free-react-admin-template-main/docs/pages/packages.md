# Packages Management

## Overview
The Packages Management page allows administrators to create, view, edit, and delete coin packages that users can purchase. Each package includes a set number of coins at a specific price, with bonus coins and promotional features.

## Features

### Package Creation & Editing
- Create new coin packages with customizable details
- Edit existing packages to update pricing or features
- Automatic coin calculation (1 INR = 10 coins)
- Set bonus coin percentage (0-100%)
- Mark packages as "Famous" for special promotion
- Toggle package status (Active/Inactive) using a checkbox

### Package List
- View all available packages in a sortable table
- See price, coin amount, and bonus coins
- Identify famous packages with visual indicators
- Quick status toggling
- Edit and delete actions
- Search and filter functionality

### Form Validation
- Required field validation
- Price and bonus percentage validation
- Real-time coin calculation
- Form feedback for errors
- Duplicate package name prevention

## Data Structure

### Package Object
```typescript
{
  id: string;             // Unique identifier
  name: string;           // Package name (must be unique)
  price: number;          // Base price in INR (minimum 10 INR)
  coins: number;          // Number of coins (auto-calculated: price * 10)
  bonusPercent: number;   // Bonus coin percentage (0-100)
  bonusCoins: number;     // Bonus coins (auto-calculated: coins * (bonusPercent/100))
  totalCoins: number;     // Total coins (coins + bonusCoins)
  isFamous: boolean;      // Whether package is marked as famous
  isActive: boolean;      // Whether package is available for purchase
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}
```

### Coin Calculation
- Base coins: `coins = price * 10`
- Bonus coins: `bonusCoins = Math.floor(coins * (bonusPercent / 100))`
- Total coins: `totalCoins = coins + bonusCoins`

### Example
For a package with:
- Price: 100 INR
- Bonus: 20%

Calculation:
- Base coins: 100 * 10 = 1,000 coins
- Bonus coins: 1,000 * 0.20 = 200 coins
- Total coins: 1,000 + 200 = 1,200 coins

## Recent Updates
- Changed coin calculation to be based on price (1 INR = 10 coins)
- Replaced discount system with bonus coins percentage
- Updated status toggle from switch to checkbox for better UX
- Added real-time calculation of coins and bonus coins
- Improved form validation and error messages
- Added visual indicators for famous and active packages
- Enhanced responsive design for all screen sizes

## Components

### PackageForm
Handles the creation and editing of packages.

#### State
- `formData`: Contains all form field values
- `errors`: Validation error messages
- `isSubmitting`: Loading state during form submission
- `isEditMode`: Whether the form is in edit mode

#### Validation Rules
- **Name**: Required, must be unique
- **Price**: Required, minimum 10 INR
- **Bonus %**: Optional, 0-100
- **Status**: Checkbox for active/inactive
- **Famous**: Checkbox for marking as featured package

### PackageList
Displays all packages in a sortable and searchable table.

#### Features
- Sort by name, price, coins, or date
- Filter by status (active/inactive)
- Search by package name
- Quick actions (edit, delete, toggle status)
- Responsive design for all screen sizes

## API Integration
All package data is managed through Supabase, with the following operations:
- `fetchPackages()`: Get all packages
- `createPackage(data)`: Create new package
- `updatePackage(id, data)`: Update existing package
- `deletePackage(id)`: Delete a package
- `togglePackageStatus(id, isActive)`: Toggle package status

## Error Handling
- Displays user-friendly error messages
- Handles network errors gracefully
- Prevents duplicate submissions
- Validates data before submission

## Future Enhancements
- Bulk import/export of packages
- Package categories and tags
- Time-limited promotional packages
- Package analytics and popularity metrics
- Integration with payment gateways
- Support for multiple currencies
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
