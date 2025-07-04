
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
  CPaginationItem,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import { cilChatBubble, cilSearch, cilArrowRight, cilCheckCircle, cilClock } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Mock data - replace with actual API call
const mockFeedbacks = [
  {
    id: 'FB001',
    userId: 'USR1001',
    username: 'johndoe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    message: 'The app keeps crashing when I try to upload a video. Please fix this issue as soon as possible.',
    rating: 2,
    status: 'pending',
    createdAt: '2025-06-22T09:30:00Z',
    repliedAt: null,
    adminReply: null
  },
  {
    id: 'FB002',
    userId: 'USR1002',
    username: 'janedoe',
    phone: '+1 (555) 987-6543',
    email: 'jane.doe@example.com',
    message: 'Great app! Really enjoying the new features in the latest update.',
    rating: 5,
    status: 'replied',
    createdAt: '2025-06-21T14:15:00Z',
    repliedAt: '2025-06-21T16:30:00Z',
    adminReply: 'Thank you for your positive feedback! We\'re glad you\'re enjoying the new features.'
  },
  {
    id: 'FB003',
    userId: 'USR1003',
    username: 'bobsmith',
    phone: '+1 (555) 456-7890',
    email: 'bob.smith@example.com',
    message: 'How do I change my profile picture? The option seems to be missing.',
    rating: 3,
    status: 'pending',
    createdAt: '2025-06-22T10:45:00Z',
    repliedAt: null,
    adminReply: null
  },
  {
    id: 'FB004',
    userId: 'USR1004',
    username: 'alicej',
    phone: '+1 (555) 234-5678',
    email: 'alice.j@example.com',
    message: 'The video quality is very poor when I stream. Is there a way to improve this?',
    rating: 2,
    status: 'replied',
    createdAt: '2025-06-20T16:20:00Z',
    repliedAt: '2025-06-21T09:15:00Z',
    adminReply: 'We\'re looking into the streaming quality issues. In the meantime, you can try switching to a lower resolution in the app settings.'
  },
  {
    id: 'FB005',
    userId: 'USR1005',
    username: 'mikeb',
    phone: '+1 (555) 876-5432',
    email: 'mike.b@example.com',
    message: 'I would like to request a feature to download videos for offline viewing.',
    rating: 4,
    status: 'pending',
    createdAt: '2025-06-22T11:10:00Z',
    repliedAt: null,
    adminReply: null
  }
];

const ITEMS_PER_PAGE = 10;

const Feedbacks = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: 'pending', // Default to showing pending feedbacks
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const filteredFeedbacks = mockFeedbacks.filter(feedback => {
    const matchesStatus = filters.status === 'all' || feedback.status === filters.status;
    const matchesSearch = !filters.search || 
      feedback.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      feedback.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      feedback.id.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE);
  const paginatedFeedbacks = filteredFeedbacks.slice(
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

  const handleReplyClick = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.adminReply || '');
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    // In a real app, you would make an API call here to save the reply
    console.log(`Replying to feedback ${selectedFeedback.id}:`, replyText);
    
    // Simulate API call
    setTimeout(() => {
      // Update the feedback status to 'replied' and set the reply
      const updatedFeedback = {
        ...selectedFeedback,
        status: 'replied',
        adminReply: replyText,
        repliedAt: new Date().toISOString()
      };
      
      // In a real app, you would update the feedback in the state or refetch from the API
      console.log('Reply sent:', updatedFeedback);
      
      // Close the modal
      setShowReplyModal(false);
      setReplyText('');
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'replied':
        return <CBadge color="success">Replied</CBadge>;
      case 'pending':
      default:
        return <CBadge color="warning">Pending</CBadge>;
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <CIcon icon={cilChatBubble} className="me-2" />
                Feedbacks
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
                    <option value="all">All Feedbacks</option>
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
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
                      placeholder="Search by username, message, or ID..." 
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
                      setFilters({ status: 'all', search: '' });
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
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                    <CTableHeaderCell>Rating</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedFeedbacks.length > 0 ? (
                    paginatedFeedbacks.map(feedback => (
                      <CTableRow key={feedback.id}>
                        <CTableDataCell>
                          <small className="text-muted">{feedback.id}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div><strong>@{feedback.username}</strong></div>
                          <small className="text-muted">{feedback.phone}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-truncate" style={{ maxWidth: '300px' }} title={feedback.message}>
                            {feedback.message}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-warning">{getRatingStars(feedback.rating)}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{formatDate(feedback.createdAt)}</div>
                          {feedback.repliedAt && (
                            <small className="text-muted">
                              Replied: {formatDate(feedback.repliedAt)}
                            </small>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(feedback.status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton 
                              color={feedback.status === 'replied' ? 'info' : 'primary'}
                              size="sm" 
                              onClick={() => handleReplyClick(feedback)}
                            >
                              <CIcon icon={feedback.status === 'replied' ? cilCheckCircle : cilArrowRight} className="me-1" />
                              {feedback.status === 'replied' ? 'View Reply' : 'Reply'}
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="7" className="text-center">
                        No feedback found matching your criteria
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

      {/* Reply Modal */}
      <CModal 
        visible={showReplyModal} 
        onClose={() => setShowReplyModal(false)}
        size="lg"
      >
        <CModalHeader onDismiss={() => setShowReplyModal(false)}>
          <CModalTitle>
            {selectedFeedback?.status === 'replied' ? 'View Reply' : 'Reply to Feedback'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedFeedback && (
            <>
              <div className="mb-3">
                <h6>From: @{selectedFeedback.username}</h6>
                <p className="mb-2"><strong>Feedback:</strong></p>
                <div className="p-3 bg-light rounded">
                  {selectedFeedback.message}
                </div>
                <div className="mt-2 small text-muted">
                  Submitted on: {formatDate(selectedFeedback.createdAt)}
                </div>
                {selectedFeedback.status === 'replied' && selectedFeedback.repliedAt && (
                  <div className="mt-3">
                    <p className="mb-2"><strong>Previous Reply:</strong></p>
                    <div className="p-3 bg-light rounded">
                      {selectedFeedback.adminReply}
                    </div>
                    <div className="mt-2 small text-muted">
                      Replied on: {formatDate(selectedFeedback.repliedAt)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <CFormLabel htmlFor="replyText">
                  {selectedFeedback.status === 'replied' ? 'Edit Reply' : 'Your Reply'}
                </CFormLabel>
                <CFormTextarea
                  id="replyText"
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isReplying}
                  placeholder="Type your response here..."
                />
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setShowReplyModal(false)}
            disabled={isReplying}
          >
            Close
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleSendReply}
            disabled={isReplying || !replyText.trim()}
          >
            {isReplying ? (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" className="me-2" />
                Sending...
              </>
            ) : selectedFeedback?.status === 'replied' ? (
              'Update Reply'
            ) : (
              'Send Reply'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Feedbacks;
