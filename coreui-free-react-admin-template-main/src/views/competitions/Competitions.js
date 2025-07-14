import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CFormTextarea,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CImage
} from '@coreui/react';
import { cilCloudUpload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
const Competitions = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    competitionName: '',
    registrationStartDate: '',
    liveOn: '',
    endOn: '',
    competitionType: '',
    competitionCriteria: '',
    maxParticipants: '',
    description: '',
    disqualificationCriteria: '',
    entryFee: '',
    rules: '',
    position1Prize: '',
    position2Prize: '',
    position3Prize: '',
    image: null
  });
  
  const [dateErrors, setDateErrors] = useState({
    registrationStartDate: '',
    liveOn: '',
    endOn: ''
  });
  
  const [previewUrl, setPreviewUrl] = useState('');

  const validateDates = (name, value) => {
    const errors = { ...dateErrors };
    const currentDate = new Date();
    
    if (name === 'registrationStartDate') {
      const registrationDate = new Date(value);
      if (registrationDate < currentDate) {
        errors.registrationStartDate = 'Registration start date must be in the future';
      } else {
        errors.registrationStartDate = '';
      }
      
      // If live date is already set, re-validate it
      if (formData.liveOn) {
        const liveDate = new Date(formData.liveOn);
        if (liveDate <= registrationDate) {
          errors.liveOn = 'Live date must be after registration start date';
        } else {
          errors.liveOn = '';
        }
      }
    }
    
    if (name === 'liveOn') {
      const liveDate = new Date(value);
      const registrationDate = formData.registrationStartDate ? new Date(formData.registrationStartDate) : null;
      
      if (registrationDate && liveDate <= registrationDate) {
        errors.liveOn = 'Live date must be after registration start date';
      } else if (liveDate < currentDate) {
        errors.liveOn = 'Live date must be in the future';
      } else {
        errors.liveOn = '';
      }
      
      // If end date is already set, re-validate it
      if (formData.endOn) {
        const endDate = new Date(formData.endOn);
        if (endDate <= liveDate) {
          errors.endOn = 'End date must be after live date';
        } else {
          errors.endOn = '';
        }
      }
    }
    
    if (name === 'endOn') {
      const endDate = new Date(value);
      const liveDate = formData.liveOn ? new Date(formData.liveOn) : null;
      
      if (liveDate && endDate <= liveDate) {
        errors.endOn = 'End date must be after live date';
      } else if (endDate < currentDate) {
        errors.endOn = 'End date must be in the future';
      } else {
        errors.endOn = '';
      }
    }
    
    setDateErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Validate dates when they change
      if (['registrationStartDate', 'liveOn', 'endOn'].includes(name)) {
        validateDates(name, value);
      }
    }
  };
  
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPreviewUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Form submission logic will go here
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Create New Competition</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="competitionName">Competition Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="competitionName"
                  name="competitionName"
                  value={formData.competitionName}
                  onChange={handleInputChange}
                  placeholder="Enter competition name"
                  required
                />
              </div>

              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="registrationStartDate">Registration Start</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="registrationStartDate"
                    name="registrationStartDate"
                    value={formData.registrationStartDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                  {dateErrors.registrationStartDate && (
                    <div className="text-danger small">{dateErrors.registrationStartDate}</div>
                  )}
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="liveOn">Live On</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="liveOn"
                    name="liveOn"
                    value={formData.liveOn}
                    onChange={handleInputChange}
                    min={formData.registrationStartDate || new Date().toISOString().slice(0, 16)}
                    required
                    disabled={!formData.registrationStartDate}
                  />
                  {dateErrors.liveOn && (
                    <div className="text-danger small">{dateErrors.liveOn}</div>
                  )}
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="endOn">End On</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endOn"
                    name="endOn"
                    value={formData.endOn}
                    onChange={handleInputChange}
                    min={formData.liveOn || (formData.registrationStartDate || new Date().toISOString().slice(0, 16))}
                    required
                    disabled={!formData.liveOn}
                  />
                  {dateErrors.endOn && (
                    <div className="text-danger small">{dateErrors.endOn}</div>
                  )}
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel htmlFor="competitionType">Competition Type</CFormLabel>
                <CFormInput
                  type="text"
                  id="competitionType"
                  name="competitionType"
                  value={formData.competitionType}
                  onChange={handleInputChange}
                  placeholder="Enter competition type"
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="competitionCriteria">Competition Criteria</CFormLabel>
                <CFormInput
                  type="text"
                  id="competitionCriteria"
                  name="competitionCriteria"
                  value={formData.competitionCriteria}
                  onChange={handleInputChange}
                  placeholder="Enter competition criteria"
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="maxParticipants">Max Participants</CFormLabel>
                <CFormInput
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="Enter maximum number of participants"
                  min="1"
                />
                <CFormText>Leave empty for unlimited participants</CFormText>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="description">Competition Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed competition description"
                  rows="4"
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="disqualificationCriteria">Disqualification Criteria</CFormLabel>
                <CFormTextarea
                  id="disqualificationCriteria"
                  name="disqualificationCriteria"
                  value={formData.disqualificationCriteria}
                  onChange={handleInputChange}
                  placeholder="Enter criteria for disqualification"
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Competition Image</CFormLabel>
                <div 
                  className={`border rounded p-4 text-center ${previewUrl ? 'border-0' : 'border-secondary'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => document.getElementById('competitionImage').click()}
                >
                  {previewUrl ? (
                    <div className="position-relative">
                      <CImage 
                        src={previewUrl} 
                        alt="Competition Preview" 
                        className="img-fluid mb-3"
                        style={{ maxHeight: '200px' }}
                      />
                      <CButton 
                        color="danger" 
                        size="sm" 
                        className="position-absolute top-0 end-0 m-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        Remove
                      </CButton>
                    </div>
                  ) : (
                    <>
                      <CIcon icon={cilCloudUpload} size="3xl" className="mb-2" />
                      <p className="mb-1">Click to upload competition image</p>
                      <p className="text-muted small mb-0">Recommended size: 1200x630px (JPG, PNG, max 5MB)</p>
                    </>
                  )}
                  <input
                    type="file"
                    id="competitionImage"
                    name="image"
                    className="d-none"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="entryFee">Entry Fee</CFormLabel>
                <CFormInput
                  type="number"
                  id="entryFee"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  placeholder="Enter entry fee"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="rules">Rules</CFormLabel>
                <CFormInput
                  as="textarea"
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  placeholder="Enter competition rules"
                  rows="4"
                />
              </div>

              <h6 className="mb-3">Prize Money</h6>
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="position1Prize">1st Position</CFormLabel>
                  <CFormInput
                    type="number"
                    id="position1Prize"
                    name="position1Prize"
                    value={formData.position1Prize}
                    onChange={handleInputChange}
                    placeholder="Enter prize amount"
                    min="0"
                    step="0.01"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="position2Prize">2nd Position</CFormLabel>
                  <CFormInput
                    type="number"
                    id="position2Prize"
                    name="position2Prize"
                    value={formData.position2Prize}
                    onChange={handleInputChange}
                    placeholder="Enter prize amount"
                    min="0"
                    step="0.01"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="position3Prize">3rd Position</CFormLabel>
                  <CFormInput
                    type="number"
                    id="position3Prize"
                    name="position3Prize"
                    value={formData.position3Prize}
                    onChange={handleInputChange}
                    placeholder="Enter prize amount"
                    min="0"
                    step="0.01"
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-end mt-4 gap-2">
                <CButton 
                  color="secondary" 
                  variant="outline" 
                  onClick={() => navigate('/competitions/view')}
                >
                  View Competitions
                </CButton>
                <CButton color="primary" type="submit">
                  Save Competition
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Competitions;
