import { supabase } from '../api/supabaseClient';

/**
 * Logs out the current admin user
 * Clears local storage and redirects to login page
 */
export const handleLogout = () => {
  try {
    // Clear any stored session data
    localStorage.removeItem('admin');
    
    // Call Supabase sign out if using Supabase Auth
    supabase.auth.signOut().catch(console.error);
    
    // Redirect to login page with a full page reload to clear all state
    window.location.href = '/#/login';
  } catch (error) {
    console.error('Error during logout:', error);
    // Still redirect even if there's an error
    window.location.href = '/#/login';
  }
};

/**
 * Checks if the current user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  try {
    const admin = localStorage.getItem('admin');
    return !!admin;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Gets the current admin user data
 * @returns {Object|null} The admin user object or null if not authenticated
 */
export const getCurrentAdmin = () => {
  try {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
};
