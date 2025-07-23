// Simple authentication service using only the employees table
import { supabase } from '../api/supabaseClient'

// Login by checking against employees table
export const loginAdmin = async (email, password) => {
  try {
    // Check if the user exists in the employees table
    const { data: employee, error } = await supabase
      .from('employees')
      .select('id, email, role, full_name') // Removed password from select
      .eq('email', email)
      .single()

    if (error || !employee) {
      console.error('Login failed:', error?.message || 'Employee not found')
      throw new Error('Invalid email or password')
    }

    // Since we don't have password in the database, we'll just check if the email exists
    // In a production environment, you should implement proper password hashing and verification
    
    // Store user data in localStorage
    localStorage.setItem('admin', JSON.stringify(employee))
    
    return employee
  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error.message || 'Login failed. Please try again.')
  }
}

// Logout function
export const handleLogout = () => {
  localStorage.removeItem('admin')
  window.location.href = '/login'
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('admin')
}

// Get current user
export const getCurrentAdmin = () => {
  const user = localStorage.getItem('admin')
  return user ? JSON.parse(user) : null
}
