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
} from '@coreui/react';

const Competitions = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    competitionName: '',
    liveOn: '',
    endOn: '',
    competitionType: '',
    competitionCriteria: '',
    entryFee: '',
    rules: '',
    position1Prize: '',
    position2Prize: '',
    position3Prize: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
                <CCol md={6}>
                  <CFormLabel htmlFor="liveOn">Live On</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="liveOn"
                    name="liveOn"
                    value={formData.liveOn}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endOn">End On</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endOn"
                    name="endOn"
                    value={formData.endOn}
                    onChange={handleInputChange}
                    required
                  />
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
