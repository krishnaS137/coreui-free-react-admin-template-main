# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Admin authentication system with dedicated `admins` table
- Row Level Security (RLS) policies for secure admin authentication
- Registration flow for the first admin user
- Login/logout functionality for admin users
- Documentation for the admin authentication system in `docs/admin-authentication.md`

### Changed
- Updated registration logic to work with RLS policies
- Improved error handling in authentication flows
- Enhanced security by restricting admin registration to first-time setup only

### Fixed
- Fixed RLS policy issues preventing admin registration
- Resolved duplicate function declarations in auth service
- Improved error messages for authentication failures
