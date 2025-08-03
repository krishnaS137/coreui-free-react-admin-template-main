# Admin Dashboard Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat-square)](https://reactjs.org/)
[![CoreUI](https://img.shields.io/badge/CoreUI-4.3.0-blueviolet.svg?style=flat-square)](https://coreui.io/)

A modern, responsive admin dashboard template built with React and CoreUI, featuring a clean authentication system and role-based access control.

## Features

- 🔐 **Robust Authentication System**
  - Email-based login system with comprehensive validation
  - Role-based access control (Super Admin, Admin, Employee)
  - Session management with localStorage persistence
  - **Authentication Guards**: All routes protected with automatic redirects
  - **HashRouter Integration**: Clean URL structure with client-side routing
  - **Login/Logout Flow**: Seamless user experience with proper error handling

- 👥 **User Management**
  - Employee directory
  - Role assignment
  - Access control management

- 🛠 **Admin Features**
  - Dashboard with key metrics
  - Sub-admin management
  - Permission controls

- 🎨 **UI/UX**
  - Responsive design
  - Clean, modern interface
  - Built with CoreUI components

## Getting Started

### Prerequisites

- Node.js 16.14.0 or higher
- npm 8.3.1 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/admin-dashboard-template.git
   cd admin-dashboard-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=your_api_url_here
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```
   The application will be available at `http://localhost:3001`
   
   **Authentication**: First-time visitors will see the login page. After authentication, you'll have access to all admin features.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/       # Layout components
├── services/      # API and service layers
├── utils/         # Utility functions
└── views/         # Page components
    ├── dashboard/ # Dashboard views
    ├── pages/     # Authentication pages
    └── sub-admins/ # Admin management
```

## Authentication

The application uses a comprehensive email-based authentication system with route protection:

### Authentication Flow
1. **Initial Access**: Unauthenticated users are automatically redirected to login page
2. **Login Process**: Users log in with email and password
3. **Validation**: System verifies email against the employees table
4. **Session Creation**: User data is stored in localStorage on successful authentication  
5. **Route Protection**: All admin routes are protected by authentication guards
6. **Navigation**: Uses HashRouter for clean client-side routing (`/#/dashboard`, `/#/users`, etc.)

### Security Features
- **Route Guards**: DefaultLayout checks authentication on every protected route access
- **Automatic Redirects**: Unauthenticated access redirects to login
- **Session Management**: Persistent sessions until explicit logout
- **Login Guard**: Already authenticated users are redirected from login to dashboard

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'employee'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Available Scripts

- `npm start` - Start the development server (runs on port 3001)
- `npm run build` - Build the app for production
- `npm run lint` - Run ESLint for code quality checks

## Recent Updates & Fixes

### Latest Authentication System Overhaul
- **Fixed Critical Build Issues**: Resolved JSX corruption in Login.js causing build failures
- **Enhanced Route Protection**: Implemented comprehensive authentication guards
- **Improved User Experience**: Seamless login/logout flow with proper error handling
- **HashRouter Integration**: Clean URL structure with client-side routing compatibility
- **Registration Removal**: Completely removed registration functionality as planned
- **Import Resolution**: Fixed all missing import paths and dependencies

For detailed information about recent fixes, see [`docs/pages/authentication-fixes.md`](docs/pages/authentication-fixes.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoreUI](https://coreui.io/) for the admin template
- [React](https://reactjs.org/) for the UI library
- All contributors who have helped shape this project
