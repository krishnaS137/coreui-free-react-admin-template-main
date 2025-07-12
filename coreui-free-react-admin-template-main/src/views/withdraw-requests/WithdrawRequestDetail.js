import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CAlert,
  CSpinner,
  CBadge,
  CContainer,
  CLink
} from '@coreui/react';
import { cilArrowLeft, cilCheckCircle, cilXCircle, cilClock, cilSave } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Mock function to simulate API call
const fetchWithdrawRequest = async (id) => {
  // In a real app, this would be an API call
  const mockRequests = [
    {
      id: 'WD001',
      userId: 'USR1001',
      username: 'johndoe',
      email: 'john.doe@example.com',
      amount: 250.00,
      paymentMethod: 'Bank Transfer',
      accountDetails: 'XXXX-XXXX-7890',
      status: 'Pending',
      requestedAt: '2025-06-20T10:30:00Z',
      processedAt: null,
      adminNotes: '',
      userNotes: 'Need this for an urgent payment',
    },
    // Add more mock data as needed
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = mockRequests.find(req => req.id === id) || null;
      resolve(request);
    }, 500);
  });
};

const WithdrawRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    status: '',
    adminNotes: ''
  });

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setLoading(true);
        const data = await fetchWithdrawRequest(id);
        if (data) {
          setRequest(data);
          setFormData({
            status: data.status,
            adminNotes: data.adminNotes || ''
          });
        } else {
          setError('Withdraw request not found');
        }
      } catch (err) {
        setError('Failed to load withdraw request');
        console.error('Error loading withdraw request:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local state to reflect changes
      const updatedRequest = {
        ...request,
        status: formData.status,
        adminNotes: formData.adminNotes,
        processedAt: formData.status !== 'Pending' ? new Date().toISOString() : null
      };
      
      setRequest(updatedRequest);
      setSuccess('Withdraw request updated successfully');
    } catch (err) {
      setError('Failed to update withdraw request');
      console.error('Error updating withdraw request:', err);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <CSpinner />
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">{error}</CAlert>
        <CButton color="secondary" onClick={() => navigate('/withdraw-requests')} className="mt-3">
          <CIcon icon={cilArrowLeft} className="me-1" />
          Back to Withdraw Requests
        </CButton>
      </CContainer>
    );
  }

  if (!request) {
    return (
      <CContainer>
        <CAlert color="warning">Withdraw request not found</CAlert>
        <CButton color="secondary" onClick={() => navigate('/withdraw-requests')} className="mt-3">
          <CIcon icon={cilArrowLeft} className="me-1" />
          Back to Withdraw Requests
        </CButton>
      </CContainer>
    );
  }

  return (
    <CContainer fluid>
      <CButton 
        color="secondary" 
        variant="outline" 
        onClick={() => navigate('/withdraw-requests')} 
        className="mb-3"
      >
        <CIcon icon={cilArrowLeft} className="me-1" />
        Back to Withdraw Requests
      </CButton>

      {success && <CAlert color="success" className="mb-4">{success}</CAlert>}
      {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}

      <CRow>
        <CCol md={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5>Withdraw Request #{request.id}</h5>
              <div className="small text-muted">
                Requested on {formatDate(request.requestedAt)}
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <div><strong>User:</strong> {request.username}</div>
                  <div><strong>Email:</strong> {request.email}</div>
                  <div><strong>User ID:</strong> {request.userId}</div>
                </CCol>
                <CCol md={6}>
                  <div><strong>Amount:</strong> {formatCurrency(request.amount)}</div>
                  <div><strong>Payment Method:</strong> {request.paymentMethod}</div>
                  <div><strong>Account Details:</strong> {request.accountDetails}</div>
                </CCol>
              </CRow>

              <div className="mb-3">
                <h6>User Notes</h6>
                <div className="p-3 bg-light rounded">
                  {request.userNotes || 'No notes provided'}
                </div>
              </div>

              <div className="mb-3">
                <h6>Admin Notes</h6>
                <CFormTextarea
                  name="adminNotes"
                  value={formData.adminNotes}
                  onChange={handleStatusChange}
                  placeholder="Add any notes or instructions for this request..."
                  rows="3"
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader>
              <h6>Update Status</h6>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel>Current Status</CFormLabel>
                  <div className="p-2 bg-light rounded">
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                <div className="mb-3">
                  <CFormLabel>Update Status</CFormLabel>
                  <CFormSelect
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </CFormSelect>
                </div>

                <div className="d-grid gap-2">
                  <CButton 
                    type="submit" 
                    color="primary" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <CSpinner size="sm" className="me-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-1" />
                        Update Status
                      </>
                    )}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>

          <CCard>
            <CCardHeader>
              <h6>Timeline</h6>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <div className="small text-muted">Requested</div>
                <div>{formatDate(request.requestedAt)}</div>
              </div>
              
              {request.processedAt && (
                <div className="mb-3">
                  <div className="small text-muted">Processed</div>
                  <div>{formatDate(request.processedAt)}</div>
                </div>
              )}
              
              {request.completedAt && (
                <div className="mb-3">
                  <div className="small text-muted">Completed</div>
                  <div>{formatDate(request.completedAt)}</div>
                </div>
              )}
              
              {request.cancelledAt && (
                <div className="mb-3">
                  <div className="small text-muted">Cancelled</div>
                  <div>{formatDate(request.cancelledAt)}</div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default WithdrawRequestDetail;
