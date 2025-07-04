import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CFormLabel,
  CFormInput,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CBadge,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { cilArrowLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const NotificationHistory = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: 'all',
    fromDate: '',
    toDate: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    // Filter logic will be implemented here
    console.log('Applying filters:', filters);
  };

  // Mock data for the table
  const notifications = [
    { id: 1, title: 'System Update', type: 'all', date: '2025-06-20', status: 'sent' },
    { id: 2, title: 'Feedback Received', type: 'feedback', date: '2025-06-19', status: 'read' },
    { id: 3, title: 'New Feature', type: 'all', date: '2025-06-18', status: 'sent' },
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <CButton 
                  color="link" 
                  className="p-0 me-2"
                  onClick={() => navigate(-1)}
                >
                  <CIcon icon={cilArrowLeft} />
                </CButton>
                <span className="h4">Notification History</span>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <div className="mb-4">
              <CRow className="g-3 align-items-end">
                <CCol md={3}>
                  <CFormLabel>Type</CFormLabel>
                  <CFormSelect 
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="single">Single</option>
                    <option value="competition">Competition</option>
                    <option value="selective_user">Selective User</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormLabel>From</CFormLabel>
                  <CFormInput 
                    type="date" 
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>To</CFormLabel>
                  <CFormInput 
                    type="date" 
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol md={3} className="d-flex align-items-end">
                  <CButton 
                    color="primary" 
                    className="w-100"
                    onClick={handleFilter}
                  >
                    Filter
                  </CButton>
                </CCol>
              </CRow>
            </div>

            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {notifications.map((notification) => (
                  <CTableRow key={notification.id}>
                    <CTableDataCell>{notification.id}</CTableDataCell>
                    <CTableDataCell>{notification.title}</CTableDataCell>
                    <CTableDataCell>
                      {notification.type === 'feedback' ? 'Feedback Reply' : 'All'}
                    </CTableDataCell>
                    <CTableDataCell>{notification.date}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={notification.status === 'sent' ? 'info' : 'success'}>
                        {notification.status}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NotificationHistory;
