# Admin Dashboard Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat-square)](https://reactjs.org/)
[![CoreUI](https://img.shields.io/badge/CoreUI-4.3.0-blueviolet.svg?style=flat-square)](https://coreui.io/)

A modern, responsive admin dashboard template built with React and CoreUI, featuring a clean authentication system and role-based access control.

## Features

- 🔐 **Simple Authentication**
  - Email-based login system
  - Role-based access control (Super Admin, Admin, Employee)
  - Session management with localStorage

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
   The application will be available at `http://localhost:3000`

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

The application uses a simple email-based authentication system:

1. Users log in with their email
2. The system verifies the email against the employees table
3. On successful authentication, user data is stored in localStorage
4. Protected routes check for authentication status

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

- `npm start` - Start the development server
- `npm test` - Launch the test runner
- `npm run build` - Build the app for production
- `npm run eject` - Eject from create-react-app

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
