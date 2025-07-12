import React, { useState } from 'react';
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
  CFormSelect,
  CFormLabel,
  CButton,
  CBadge,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CForm,
  CSpinner,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { 
  cilDollar, 
  cilSearch, 
  cilInfo, 
  cilClock, 
  cilCheckCircle, 
  cilXCircle 
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Mock data - replace with actual API call
const mockWithdrawRequests = [
  {
    id: 'WD001',
    userId: 'USR1001',
    username: 'johndoe',
    amount: 250.00,
    paymentMethod: 'Bank Transfer',
    accountDetails: 'XXXX-XXXX-7890',
    status: 'Pending',
    requestedAt: '2025-06-20T10:30:00Z',
    processedAt: null,
    adminNotes: ''
  },
  {
    id: 'WD002',
    userId: 'USR1002',
    username: 'janedoe',
    amount: 150.50,
    paymentMethod: 'PayPal',
    accountDetails: 'jane.doe@example.com',
    status: 'Approved',
    requestedAt: '2025-06-19T14:20:00Z',
    processedAt: '2025-06-19T14:30:00Z',
    adminNotes: 'Auto-approved, meets all criteria'
  },
  {
    id: 'WD003',
    userId: 'USR1003',
    username: 'bobsmith',
    amount: 500.00,
    paymentMethod: 'Crypto',
    accountDetails: '0x1234...abcd',
    status: 'Processing',
    requestedAt: '2025-06-18T09:15:00Z',
    processedAt: '2025-06-18T11:30:00Z',
    adminNotes: 'Pending bank transfer'
  },
  {
    id: 'WD004',
    userId: 'USR1004',
    username: 'alicej',
    amount: 75.25,
    paymentMethod: 'Bank Transfer',
    accountDetails: 'XXXX-XXXX-1234',
    status: 'Completed',
    requestedAt: '2025-06-21T16:45:00Z',
    processedAt: '2025-06-21T17:30:00Z',
    completedAt: '2025-06-22T09:15:00Z',
    adminNotes: 'Payment processed successfully'
  },
  {
    id: 'WD005',
    userId: 'USR1005',
    username: 'mikeb',
    amount: 320.75,
    paymentMethod: 'PayPal',
    accountDetails: 'mike.b@example.com',
    status: 'Rejected',
    requestedAt: '2025-06-20T11:20:00Z',
    processedAt: '2025-06-20T12:10:00Z',
    adminNotes: 'Insufficient verification documents provided'
  },
  {
    id: 'WD006',
    userId: 'USR1006',
    username: 'sarahk',
    amount: 120.00,
    paymentMethod: 'Bank Transfer',
    accountDetails: 'XXXX-XXXX-5678',
    status: 'Cancelled',
    requestedAt: '2025-06-22T09:30:00Z',
    cancelledAt: '2025-06-22T10:15:00Z',
    adminNotes: 'Cancelled by user'
  }
];

const ITEMS_PER_PAGE = 10;

const WithdrawRequests = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredRequests = mockWithdrawRequests.filter(request => {
    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesSearch = !filters.search || 
      request.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.id.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this request as ${newStatus}?`)) {
      setIsProcessing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the request status via API
      console.log(`Request ${requestId} updated to ${newStatus}`);
      
      setIsProcessing(false);
      // You would typically refetch the data here
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <CBadge color="success">{status}</CBadge>;
      case 'Approved':
        return <CBadge color="info">{status}</CBadge>;
      case 'Processing':
        return <CBadge color="primary">{status}</CBadge>;
      case 'Rejected':
      case 'Cancelled':
        return <CBadge color="danger">{status}</CBadge>;
      case 'Pending':
      default:
        return <CBadge color="warning">{status}</CBadge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CIcon icon={cilCheckCircle} className="me-1" />;
      case 'Approved':
        return <CIcon icon={cilCheckCircle} className="me-1" />;
      case 'Processing':
        return <CIcon icon={cilClock} className="me-1" />;
      case 'Rejected':
      case 'Cancelled':
        return <CIcon icon={cilXCircle} className="me-1" />;
      case 'Pending':
      default:
        return <CIcon icon={cilClock} className="me-1" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
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
              <h5 className="mb-0">
                <CIcon icon={cilDollar} className="me-2" />
                Withdraw Requests
              </h5>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-4">
              <CRow className="g-3">
                <CCol md={3}>
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Search</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput 
                      name="search"
                      placeholder="Search by username or request ID..." 
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={3} className="d-flex align-items-end">
                  <CButton 
                    color="secondary" 
                    variant="outline" 
                    onClick={() => {
                      setFilters({ status: '', search: '' });
                      setCurrentPage(1);
                    }}
                    className="w-100"
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
                    <CTableHeaderCell>Request ID</CTableHeaderCell>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Requested At</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedRequests.length > 0 ? (
                    paginatedRequests.map(request => (
                      <CTableRow key={request.id}>
                        <CTableDataCell>
                          <strong>{request.id}</strong>
                        </CTableDataCell>
                        <CTableDataCell>@{request.username}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(request.amount)}</CTableDataCell>
                        <CTableDataCell>
                          <div>{request.paymentMethod}</div>
                          <small className="text-muted">{request.accountDetails}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{formatDate(request.requestedAt)}</div>
                          {request.processedAt && (
                            <small className="text-muted">
                              Processed: {formatDate(request.processedAt)}
                            </small>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                          {request.declineReason && (
                            <div className="small text-danger">
                              {request.declineReason}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton 
                            color="primary" 
                            size="sm" 
                            onClick={() => navigate(`/withdraw-requests/${request.id}`)}
                          >
                            <CIcon icon={cilInfo} className="me-1" />
                            View Details
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="7" className="text-center">
                        No withdraw requests found matching your criteria
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <CPagination aria-label="Page navigation">
                  <CPaginationItem 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <CPaginationItem
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default WithdrawRequests;
