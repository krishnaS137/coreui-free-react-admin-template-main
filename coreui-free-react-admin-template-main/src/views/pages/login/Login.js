
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginAdmin, isAuthenticated } from '../../../services/authService'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await loginAdmin(formData.email, formData.password)
      // Reset loading state before navigation
      setIsLoading(false)
      // Navigate to dashboard after successful login
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    
                    {error && <CAlert color="danger">{error}</CAlert>}
                    
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        name="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <CSpinner component="span" size="sm" aria-hidden="true" />
                              <span className="ms-2">Loading...</span>
                            </>
                          ) : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Welcome</h2>
                    <p>
                      Admin Dashboard - Manage your platform with powerful tools and comprehensive analytics.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
