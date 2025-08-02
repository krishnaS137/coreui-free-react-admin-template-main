import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
  CButton,
  CForm,
  CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons'

const Notifications = ({ embeddedMode = false, currentUserName = '' }) => {
  const navigate = useNavigate();
  const [numberOfNotifications, setNumberOfNotifications] = useState(1);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [notifications, setNotifications] = useState([{
    id: 0,
    notificationType: '',
    user: '',
    title: '',
    content: '',
    image: null,
    scheduleDate: ''
  }]);
  
  const formData = notifications[currentNotificationIndex] || {};
  
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for number of notifications
    if (name === 'numberOfNotifications') {
      const num = parseInt(value) || 1;
      setNumberOfNotifications(Math.max(1, num));
      
      // If increasing the number, add new notification objects
      if (num > notifications.length) {
        const newNotifications = [...notifications];
        for (let i = notifications.length; i < num; i++) {
          newNotifications.push({
            id: i,
            notificationType: 'schedule-multiple',
            user: '',
            title: '',
            content: '',
            image: null,
            scheduleDate: ''
          });
        }
        setNotifications(newNotifications);
      } else if (num < notifications.length) {
        // If decreasing, just update the state but keep the array as is
        // This prevents data loss if user changes their mind
        setNotifications(prev => prev.slice(0, num));
      }
      return;
    }
    
    // Update the current notification's data
    const updatedNotifications = [...notifications];
    updatedNotifications[currentNotificationIndex] = {
      ...updatedNotifications[currentNotificationIndex],
      [name]: value
    };
    setNotifications(updatedNotifications);
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedNotifications = [...notifications];
      updatedNotifications[currentNotificationIndex] = {
        ...updatedNotifications[currentNotificationIndex],
        image: file
      };
      setNotifications(updatedNotifications);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      setPreviewUrl(URL.createObjectURL(file))
    }
  }
  
  const removeImage = () => {
    const updatedNotifications = [...notifications];
    updatedNotifications[currentNotificationIndex] = {
      ...updatedNotifications[currentNotificationIndex],
      image: null
    };
    setNotifications(updatedNotifications);
    setPreviewUrl('');
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all notifications
    const hasErrors = notifications.some(notification => {
      return !notification.title || !notification.content || 
             (notification.notificationType.includes('schedule') && !notification.scheduleDate);
    });
    
    if (hasErrors) {
      alert('Please fill in all required fields for all notifications');
      setIsSubmitting(false);
      return;
    }
    
    // Here you would typically send the notifications to your backend
    console.log('Submitting notifications:', notifications);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Notifications scheduled successfully!');
      // Reset form after successful submission
      setNumberOfNotifications(1);
      setCurrentNotificationIndex(0);
      setNotifications([{
        id: 0,
        notificationType: '',
        user: '',
        title: '',
        content: '',
        image: null,
        scheduleDate: ''
      }]);
    }, 1500);
  };
  
  // Handle navigation between notifications
  const goToNotification = (index) => {
    setCurrentNotificationIndex(index);
    // Reset preview when changing notifications
    setPreviewUrl('');
  };
  
  // Update preview URL when notification changes
  React.useEffect(() => {
    if (formData.image && typeof formData.image !== 'string') {
      setPreviewUrl(URL.createObjectURL(formData.image));
    } else if (formData.image) {
      setPreviewUrl(formData.image);
    } else {
      setPreviewUrl('');
    }
  }, [currentNotificationIndex, formData.image]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {embeddedMode ? 'Send Notification to User' : 'Create Notification'}
              {notifications.length > 1 && (
                <small className="ms-2 text-muted">
                  (Notification {currentNotificationIndex + 1} of {notifications.length})
                </small>
              )}
            </h4>
            {notifications.length > 1 && (
              <div className="d-flex gap-2">
                <CButton 
                  color="secondary" 
                  size="sm" 
                  disabled={currentNotificationIndex === 0}
                  onClick={() => goToNotification(currentNotificationIndex - 1)}
                >
                  Previous
                </CButton>
                <CButton 
                  color="primary" 
                  size="sm"
                  disabled={currentNotificationIndex === notifications.length - 1}
                  onClick={() => goToNotification(currentNotificationIndex + 1)}
                >
                  Next
                </CButton>
              </div>
            )}
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-4">
                <CRow className="g-3">
                  {formData.notificationType === 'schedule-multiple' && embeddedMode && (
                    <CCol xs={12}>
                      <CFormLabel htmlFor="numberOfNotifications">Number of Notifications to Schedule</CFormLabel>
                      <CFormInput
                        type="number"
                        id="numberOfNotifications"
                        name="numberOfNotifications"
                        min="1"
                        value={numberOfNotifications}
                        onChange={handleInputChange}
                        className="mb-3"
                      />
                      {notifications.length > 1 && (
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {notifications.map((_, index) => (
                            <CButton 
                              key={index}
                              color={currentNotificationIndex === index ? 'primary' : 'secondary'}
                              size="sm"
                              className="rounded-pill"
                              onClick={() => goToNotification(index)}
                            >
                              {index + 1}
                            </CButton>
                          ))}
                        </div>
                      )}
                    </CCol>
                  )}
                  
                  <CCol md={6}>
                    <CFormLabel htmlFor="notificationType">Type</CFormLabel>
                    <CFormSelect 
                      id="notificationType"
                      name="notificationType"
                      value={formData.notificationType}
                      onChange={handleInputChange}
                      disabled={notifications.length > 1}
                    >
                      <option value="">Select Type</option>
                      <option value="instant">Instant</option>
                      <option value="schedule">Schedule</option>
                      {embeddedMode && <option value="schedule-multiple">Schedule Multiple</option>}
                    </CFormSelect>
                  </CCol>
                  {embeddedMode ? (
                    <CCol md={6}>
                      <CFormLabel>User</CFormLabel>
                      <div className="form-control">
                        <strong>{currentUserName || 'Current User'}</strong>
                      </div>
                      <input type="hidden" name="user" value="current" />
                    </CCol>
                  ) : (
                    <CCol md={6}>
                      <CFormLabel htmlFor="userSelect">Users</CFormLabel>
                      <CFormSelect 
                        id="userSelect" 
                        name="user"
                        value={formData.user}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Users</option>
                        <option value="all">All</option>
                        <option value="single">Single</option>
                        <option value="competition">Competition</option>
                        <option value="selected">Selected Users</option>
                      </CFormSelect>
                    </CCol>
                  )}
                  
                  <CCol xs={12}>
                    <CFormLabel htmlFor="title">Notification Title</CFormLabel>
                    <CFormInput
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter notification title"
                    />
                  </CCol>
                  
                  {(formData.notificationType === 'schedule' || formData.notificationType === 'schedule-multiple') && (
                    <CCol xs={12}>
                      <CFormLabel htmlFor="scheduleDate">
                        {formData.notificationType === 'schedule' ? 'Schedule Date & Time' : 'Start Date & Time'}
                      </CFormLabel>
                      <CFormInput
                        type="datetime-local"
                        id="scheduleDate"
                        name="scheduleDate"
                        value={formData.scheduleDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                      {formData.notificationType === 'schedule-multiple' && (
                        <small className="text-muted">
                          For multiple schedules, you'll be able to set additional dates after this one.
                        </small>
                      )}
                    </CCol>
                  )}
                  
                  <CCol xs={12}>
                    <CFormLabel htmlFor="content">Notification Content</CFormLabel>
                    <CFormTextarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter notification content"
                      rows={5}
                    />
                  </CCol>
                  
                  <CCol xs={12}>
                    <CFormLabel>Notification Image</CFormLabel>
                    <div 
                      className={`border rounded p-5 text-center ${dragActive ? 'border-primary bg-light' : 'border-secondary'}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      style={{ cursor: 'pointer' }}
                    >
                      {previewUrl ? (
                        <div className="position-relative">
                          <CImage 
                            src={previewUrl} 
                            alt="Preview" 
                            className="img-fluid mb-3"
                            style={{ maxHeight: '200px' }}
                          />
                          <CButton 
                            color="danger" 
                            size="sm" 
                            className="position-absolute top-0 end-0 m-2"
                            onClick={removeImage}
                          >
                            Remove
                          </CButton>
                        </div>
                      ) : (
                        <>
                          <CIcon icon={cilCloudUpload} size="3xl" className="mb-2" />
                          <p className="mb-1">Drag and drop an image here, or click to select</p>
                          <p className="text-muted small mb-0">Supports JPG, JPEG, PNG (Max 5MB)</p>
                          <input
                            type="file"
                            className="d-none"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <CButton 
                            color="primary" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => document.getElementById('image-upload').click()}
                          >
                            Select Image
                          </CButton>
                        </>
                      )}
                    </div>
                  </CCol>
                  

                </CRow>
              </div>
              
              <div className="d-flex justify-content-end gap-3 mt-4">
                <CButton 
                  color="secondary" 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/notifications/history')}
                >
                  Notification History
                </CButton>
                <CButton 
                  color="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {formData.notificationType.includes('schedule') ? 'Scheduling...' : 'Sending...'}
                    </>
                  ) : (
                    formData.notificationType.includes('schedule') 
                      ? `Schedule ${notifications.length > 1 ? `All ${notifications.length} Notifications` : 'Notification'}`
                      : `Send ${notifications.length > 1 ? `All ${notifications.length} Notifications` : 'Notification'}`
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Notifications
