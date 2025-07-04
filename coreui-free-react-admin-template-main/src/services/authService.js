// Auth service for handling admin authentication
import { supabase } from '../api/supabaseClient'
import { handleLogout, isAuthenticated as checkAuth, getCurrentAdmin } from '../utils/authUtils'

// Check if any admin exists
export const checkAdminExists = async () => {
  try {
    const { count } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })
    return count > 0
  } catch (error) {
    console.error('Error checking if admin exists:', error)
    throw error
  }
}

// Register new admin
export const registerAdmin = async (email, password, fullName) => {
  try {
    // First check if any admin exists using the RLS function
    const { data: isEmpty, error: checkError } = await supabase
      .rpc('is_admins_table_empty')
    
    if (checkError) {
      console.error('Error checking for existing admin:', checkError)
      throw new Error('Failed to check for existing admin')
    }
    
    if (isEmpty === false) {
      throw new Error('Admin registration is disabled. Please contact an existing admin for access.')
    }
    
    // In production, you should hash the password before sending
    const hashedPassword = password // In production, use: await bcrypt.hash(password, 10)
    
    // Insert the first admin - RLS policy will verify this is the first admin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin'
        }
      }
    })
    
    if (error) {
      console.error('Supabase auth signup error:', error)
      if (error.code === 'user_already_exists') {
        throw new Error('An admin with this email already exists')
      } else if (error.code === 'email_not_allowed' || error.code === 'admin_signup_disabled') {
        throw new Error('Admin registration is disabled. Please contact an existing admin for access.')
      } else if (error.code === 'weak_password') {
        throw new Error('Password is too weak. Please use a stronger password.')
      }
      throw new Error(error.message || 'Failed to register admin')
    }
    
    if (!data || !data.user) {
      throw new Error('No user data returned after registration')
    }
    
    // Create the admin record in the admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert({
        id: data.user.id,
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (adminError) {
      console.error('Error creating admin record:', adminError)
      throw new Error('Failed to create admin record')
    }
    
    // Return the created admin data without the password hash
    const { password_hash: _, ...adminDataWithoutPassword } = adminData
    return adminDataWithoutPassword
  } catch (error) {
    console.error('Error in registerAdmin:', error)
    throw new Error(error.message || 'An error occurred during registration')
  }
}

// Login admin
export const loginAdmin = async (email, password) => {
  try {
    // In production, you should hash the password before comparing
    const hashedPassword = password // Replace with actual hashing in production
    
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password_hash', hashedPassword)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    
    // Don't store the password hash in localStorage
    const { password_hash, ...adminData } = data
    
    // Store admin data in localStorage
    localStorage.setItem('admin', JSON.stringify(adminData))
    
    // Update last login time (don't wait for this to complete)
    supabase
      .from('admins')
      .update({ 
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', adminData.id)
      .then(({ error: updateError }) => {
        if (updateError) {
          console.error('Error updating last login time:', updateError)
        }
      })
    
    return adminData
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
// Re-export utility functions for backward compatibility
export { handleLogout, checkAuth as isAuthenticated, getCurrentAdmin }

// Deprecated: Use handleLogout from authUtils instead
export const logout = handleLogout
