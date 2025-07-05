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

const Notifications = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    notificationType: '',
    user: '',
    title: '',
    content: '',
    image: null,
    scheduleDate: ''
  })
  
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      setPreviewUrl(URL.createObjectURL(file))
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
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    setPreviewUrl('')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Create Notification</h4>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-4">
                <CRow className="g-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="notificationType">Type</CFormLabel>
                    <CFormSelect 
                      id="notificationType"
                      name="notificationType"
                      value={formData.notificationType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Type</option>
                      <option value="instant">Instant</option>
                      <option value="schedule">Schedule</option>
                      <option value="schedule-multiple">Schedule Multiple</option>
                    </CFormSelect>
                  </CCol>
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
                >
                  Send Notification
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
