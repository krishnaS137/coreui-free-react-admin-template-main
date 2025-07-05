import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CForm,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CSpinner,
  CFormLabel,
  CFormInput,
  CFormFeedback,
  CCardTitle,
  CCardText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge
} from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { 
  cilArrowLeft, 
  cilWarning, 
  cilCheckCircle, 
  cilBan,
  cilClock,
  cilHistory
} from '@coreui/icons'
import { supabase } from '../../api/supabaseClient'

const STATUS_OPTIONS = [
  { value: 'normal', label: 'Normal (No restrictions)' },
  { value: 'warned', label: 'Issue Warning' },
  { value: 'suspended_7days', label: 'Suspend for 7 Days' },
  { value: 'suspended_indefinite', label: 'Suspend Indefinitely' }
]

const UserActions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [actionHistory, setActionHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: 'normal',
    reason: '',
    customDays: 7
  })
  const [touched, setTouched] = useState({})
  const [formValid, setFormValid] = useState(false)

  // Fetch user data and action history
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        
        // Fetch user data and action history in parallel
        const [
          { data: userData, error: userError },
          { data: historyData, error: historyError }
        ] = await Promise.all([
          supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single(),
            
          supabase
            .from('user_actions')
            .select(`
              *,
              created_by_user:created_by (id, username, email)
            `)
            .eq('user_id', id)
            .order('created_at', { ascending: false })
            .limit(10)
        ])
        
        // Only update state if component is still mounted
        if (isMounted) {
          if (userError) throw userError
          if (historyError) throw historyError
          
          setUser(userData)
          setActionHistory(historyData || [])
          
          // Only update form status if it hasn't been modified by the user
          setFormData(prev => ({
            ...prev,
            status: prev.status || userData.status || 'normal'
          }))
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load data: ' + (err.message || 'Unknown error'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setHistoryLoading(false)
        }
      }
    }
    
    fetchData()
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [id]) // Only re-run when id changes

  // Validate form
  useEffect(() => {
    const isValid = formData.status !== 'normal' ? !!formData.reason.trim() : true
    setFormValid(isValid)
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (!id) throw new Error('No user ID provided')
      
      const oldStatus = user?.status || 'normal'
      const newStatus = formData.status
      
      // Validate status
      if (!['normal', 'warned', 'suspended_7days', 'suspended_indefinite'].includes(newStatus)) {
        throw new Error('Invalid status value')
      }

      // Get current session with retry logic
      let session = null;
      let sessionError = null;
      
      // Try to get session
      const { data: sessionData, error: sessionErrorData } = await supabase.auth.getSession()
      session = sessionData?.session
      sessionError = sessionErrorData
      
      // If no session, try to refresh it
      if (!session && !sessionError) {
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
        session = refreshedSession
        sessionError = refreshError
      }
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        // Redirect to login if not authenticated
        if (sessionError.message.includes('Invalid Refresh Token')) {
          window.location.href = '/#/login'
          return
        }
        throw new Error('Session error. Please log in again.')
      }
      
      if (!session?.user?.id) {
        window.location.href = '/#/login'
        return
      }
      
      const currentUserId = session.user.id

      // Log the update data for debugging
      console.log('Updating user with:', { 
        id, 
        status: newStatus,
        currentUserId,
        isAdmin: session.user.app_metadata?.role === 'admin'
      })
      
      // First, try to update just the status
      const updates = {
        status: newStatus
      }
      
      // Only include suspended_until if it's a 7-day suspension
      if (newStatus === 'suspended_7days') {
        updates.suspended_until = new Date(
          Date.now() + (parseInt(formData.customDays) || 7) * 24 * 60 * 60 * 1000
        ).toISOString()
      }
      
      // Make the update request
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error('Update error details:', updateError)
        // Handle specific Supabase errors
        if (updateError.code === '42501') {
          throw new Error('Permission denied. You do not have permission to update this user.')
        } else if (updateError.code === 'PGRST116') {
          throw new Error('User not found')
        } else {
          throw new Error(`Failed to update user: ${updateError.message}`)
        }
      }
      
      if (!updatedUser) {
        throw new Error('User not found or not updated')
      }

      // Log the action if status changed or there's a reason
      if (newStatus !== oldStatus || formData.reason.trim()) {
        const { error: logError } = await supabase
          .from('user_actions')
          .insert([{
            user_id: id,
            action_type: `status_change_${newStatus}`,
            message: formData.reason.trim() || `Status changed to ${newStatus}`,
            old_status: oldStatus,
            new_status: newStatus,
            created_by: currentUserId
          }])

        if (logError) console.error('Failed to log action:', logError)
      }

      // Refresh the action history
      const { data: historyData, error: historyError } = await supabase
        .from('user_actions')
        .select(`*, created_by_user:created_by (id, username, email)`)
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (historyError) throw historyError

      // Update state in a single batch to prevent multiple re-renders
      setUser(updatedUser)
      setActionHistory(historyData || [])
      setSuccess(`User status updated to ${newStatus.replace('_', ' ')}`)
      
      // Reset form but keep the status
      setFormData({
        status: newStatus,
        reason: '',
        customDays: 7
      })
      
    } catch (err) {
      setError('Failed to update user status: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      normal: { color: 'success', label: 'Normal' },
      warned: { color: 'warning', label: 'Warned' },
      suspended_7days: { color: 'danger', label: 'Suspended (7 days)' },
      suspended_indefinite: { color: 'danger', label: 'Suspended (Indefinite)' }
    }
    
    const statusInfo = statusMap[status] || { color: 'secondary', label: 'Unknown' }
    return (
      <span className={`badge bg-${statusInfo.color} text-white`}>
        {statusInfo.label}
      </span>
    )
  }

  const formatActionType = (actionType = '') => {
    return actionType
      .replace('status_change_', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <CContainer fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (!user) {
    return (
      <CContainer fluid>
        <CAlert color="danger">User not found</CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5>User Status Management</h5>
            <CButton color="secondary" onClick={() => navigate(-1)}>
              <CIcon icon={cilArrowLeft} className="me-1" /> Back to Profile
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          <div className="mb-4">
            <h6>User Information</h6>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Current Status:</strong> {getStatusBadge(user.status)}</p>
            {user.suspended_until && (
              <p className="text-muted">
                <small>
                  Suspension ends: {new Date(user.suspended_until).toLocaleString()}
                </small>
              </p>
            )}
          </div>

          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="status">Change Status</CFormLabel>
              <CFormSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mb-3"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CFormSelect>

              {formData.status === 'suspended_7days' && (
                <div className="mb-3">
                  <CFormLabel htmlFor="customDays">
                    Suspension Duration (days)
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="customDays"
                    name="customDays"
                    min="1"
                    value={formData.customDays}
                    onChange={handleChange}
                    className={touched.customDays && !formData.customDays ? 'is-invalid' : ''}
                  />
                  <CFormFeedback>Please enter a valid number of days</CFormFeedback>
                </div>
              )}

              {formData.status !== 'normal' && (
                <div className="mb-3">
                  <CFormLabel htmlFor="reason">
                    Reason for {formData.status.replace('_', ' ')}
                    <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormTextarea
                    id="reason"
                    name="reason"
                    rows="3"
                    value={formData.reason}
                    onChange={handleChange}
                    className={touched.reason && !formData.reason.trim() ? 'is-invalid' : ''}
                    placeholder={`Enter the reason for ${formData.status.replace('_', ' ')}...`}
                  />
                  <CFormFeedback>Please provide a reason for this action</CFormFeedback>
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <CButton 
                type="submit" 
                color="primary" 
                disabled={saving || !formValid}
              >
                {saving ? (
                  <>
                    <CSpinner component="span" size="sm" aria-hidden="true" className="me-2" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </CButton>
              
              <CButton 
                type="button" 
                color="secondary" 
                shape="outline" 
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Action History */}
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilHistory} className="me-2" />
            Action History
          </h5>
        </CCardHeader>
        <CCardBody>
          {historyLoading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
            </div>
          ) : actionHistory.length > 0 ? (
            <div className="table-responsive">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                    <CTableHeaderCell>From/To</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                    <CTableHeaderCell>By</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {actionHistory.map((action) => (
                    <CTableRow key={action.id}>
                      <CTableDataCell>
                        <small className="text-muted">
                          {formatDate(action.created_at)}
                        </small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">
                          {formatActionType(action.action_type)}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-1">
                          {action.old_status && (
                            <>
                              {getStatusBadge(action.old_status)}
                              <CIcon icon={cilArrowRight} className="mx-1" />
                            </>
                          )}
                          {getStatusBadge(action.new_status || action.action_type.replace('status_change_', ''))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <small>{action.message || '—'}</small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <small>
                          {action.created_by_user?.email || 
                           action.created_by_user?.username || 
                           (action.created_by ? 'System' : '—')}
                        </small>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <CIcon icon={cilClock} size="xl" className="mb-2" />
              <p>No action history found</p>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default UserActions
