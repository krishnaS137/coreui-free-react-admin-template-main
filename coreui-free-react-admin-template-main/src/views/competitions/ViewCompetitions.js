import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CForm
} from '@coreui/react';
import { cilArrowLeft, cilSearch, cilCalendar } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Mock data - replace with actual API call
const mockCompetitions = [
  {
    id: 1,
    name: 'Summer Tournament',
    type: 'Public',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    entryFee: 50,
    status: 'Draft',
    registrationOpen: false
  },
  {
    id: 2,
    name: 'Winter Championship',
    type: 'Private',
    startDate: '2025-12-01',
    endDate: '2025-12-15',
    entryFee: 100,
    status: 'Registration Open',
    registrationOpen: true
  },
  {
    id: 3,
    name: 'Spring Open',
    type: 'Public',
    startDate: '2025-03-15',
    endDate: '2025-04-15',
    entryFee: 75,
    status: 'Completed',
    registrationOpen: false
  },
  {
    id: 4,
    name: 'Autumn Classic',
    type: 'Public',
    startDate: '2025-09-10',
    endDate: '2025-09-20',
    entryFee: 60,
    status: 'Live',
    registrationOpen: false
  },
  {
    id: 5,
    name: 'Winter Cup',
    type: 'Private',
    startDate: '2025-01-10',
    endDate: '2025-01-20',
    entryFee: 80,
    status: 'Cancelled',
    registrationOpen: false
  },
];

const ViewCompetitions = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    fromDate: '',
    toDate: '',
    status: ''
  });
  
  const [competitions] = useState(mockCompetitions);

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = !filters.search || 
      comp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      comp.type.toLowerCase().includes(filters.search.toLowerCase()) ||
      comp.status.toLowerCase().includes(filters.search.toLowerCase());
      
    const matchesFromDate = !filters.fromDate || new Date(comp.startDate) >= new Date(filters.fromDate);
    const matchesToDate = !filters.toDate || new Date(comp.endDate) <= new Date(filters.toDate);
    
    let matchesStatus = true;
    if (filters.status === 'Draft') {
      matchesStatus = comp.status === 'Draft';
    } else if (filters.status === 'Registration Open') {
      matchesStatus = comp.status === 'Registration Open';
    } else if (filters.status === 'Live') {
      matchesStatus = comp.status === 'Live';
    } else if (filters.status === 'Completed') {
      matchesStatus = comp.status === 'Completed';
    } else if (filters.status === 'Cancelled') {
      matchesStatus = comp.status === 'Cancelled';
    }
    
    return matchesSearch && matchesFromDate && matchesToDate && matchesStatus;
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <CButton 
                  color="secondary" 
                  variant="outline" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate(-1)}
                >
                  <CIcon icon={cilArrowLeft} className="me-1" /> Back
                </CButton>
                <span className="h5 mb-0">View Competitions</span>
              </div>
              <CButton 
                color="primary" 
                onClick={() => navigate('/competitions')}
              >
                Create New Competition
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-4">
              <CRow className="g-3">
                <CCol md={3}>
                  <CFormLabel>Search</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput 
                      name="search"
                      placeholder="Search competitions..." 
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={2}>
                  <CFormLabel>From</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput 
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={2}>
                  <CFormLabel>To</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput 
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                      min={filters.fromDate}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Registration Open">Registration Open</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2} className="d-flex align-items-end">
                  <CButton 
                    color="secondary" 
                    variant="outline" 
                    onClick={() => setFilters({ search: '', fromDate: '', toDate: '', status: '' })}
                  >
                    Clear Filters
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
            
            <div className="table-responsive">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                    <CTableHeaderCell>Entry Fee</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredCompetitions.length > 0 ? (
                    filteredCompetitions.map((comp) => (
                      <CTableRow key={comp.id}>
                        <CTableDataCell>{comp.name}</CTableDataCell>
                        <CTableDataCell>{comp.type}</CTableDataCell>
                        <CTableDataCell>{formatDate(comp.startDate)}</CTableDataCell>
                        <CTableDataCell>{formatDate(comp.endDate)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(comp.entryFee)}</CTableDataCell>
                        <CTableDataCell>
                          <span className={`badge bg-${
                            comp.status === 'Completed' ? 'success' : 
                            comp.status === 'Live' ? 'warning' :
                            comp.status === 'Draft' ? 'secondary' :
                            comp.status === 'Registration Open' ? 'info' :
                            'danger' // Cancelled
                          }`}>
                            {comp.status}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton 
                            color="info" 
                            size="sm"
                            onClick={() => navigate(`/competitions/${comp.id}`)}
                          >
                            View Details
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="7" className="text-center">
                        No competitions found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewCompetitions;
