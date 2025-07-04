import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { registerAdmin, checkAdminExists } from '../../../services/authService'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const exists = await checkAdminExists()
        if (exists) {
          navigate('/login')
        }
      } catch (err) {
        setError('Error checking admin status')
      } finally {
        setIsLoading(false)
      }
    }
    checkAdmin()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password strength (example: at least 8 characters)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    setIsLoading(true)
    
    try {
      await registerAdmin(
        formData.email,
        formData.password,
        formData.fullName
      )
      setSuccess(true)
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { registrationSuccess: true } 
        })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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

  if (isLoading) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8} className="text-center">
              <CSpinner color="primary" variant="grow" />
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8} className="text-center">
              <CCard>
                <CCardBody>
                  <div className="mb-4">
                    <CIcon icon={cilUser} size="4xl" className="text-success" />
                  </div>
                  <h2>Registration Successful!</h2>
                  <p className="text-body-secondary">
                    Your admin account has been created successfully. Redirecting to login...
                  </p>
                  <CSpinner color="success" variant="grow" />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Admin Registration</h1>
                  <p className="text-body-secondary">Create your admin account</p>
                  
                  {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}
                  
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      name="fullName"
                      placeholder="Full Name" 
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      name="email"
                      type="email"
                      placeholder="Email" 
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton 
                      color="success" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                    </CButton>
                  </div>
                  <div className="text-center mt-3">
                    Already have an account?{' '}
                    <a href="/#/login" className="text-decoration-none">
                      Login here
                    </a>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            <div className="text-center mt-3">
              <small className="text-body-secondary">
                By registering, you agree to our terms and conditions.
              </small>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
