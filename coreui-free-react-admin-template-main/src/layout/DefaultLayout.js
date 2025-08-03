import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { isAuthenticated } from '../services/authService'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication status on component mount
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  // Don't render layout if not authenticated
  if (!isAuthenticated()) {
    return null
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
