
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

// Allowed ticket subjects
const TICKET_SUBJECTS = [
  'Others',
  'Competition',
  'Account',
  'Withdraw coins',
  'Purchase Packages',
  'Account Deactivation'
];

// Mock data - replace with actual API call
const mockTickets = [
  {
    id: 'TKT001',
    userId: 'USR1001',
    username: 'johndoe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    subject: 'Account',
    message: 'I am unable to log into my account. It says invalid credentials.',
    status: 'pending',
    images: [
      'https://example.com/images/login-issue.jpg',
      'https://example.com/images/error-message.jpg'
    ],
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

const Tickets = () => {
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

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesStatus = filters.status === 'all' || ticket.status === filters.status;
    const matchesSearch = !filters.search || 
      ticket.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Function to get badge color based on subject
  const getSubjectBadge = (subject) => {
    const colors = {
      'Others': 'secondary',
      'Competition': 'info',
      'Account': 'primary',
      'Withdraw coins': 'warning',
      'Purchase Packages': 'success',
      'Account Deactivation': 'danger'
    };
    return <CBadge color={colors[subject] || 'secondary'}>{subject}</CBadge>;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleReplyClick = (ticket) => {
    setSelectedFeedback(ticket);
    setReplyText(ticket.adminReply || '');
    setShowReplyModal(true);
  };
  
  // Function to handle image click (show in modal)
  const handleImageClick = (imageUrl) => {
    // In a real app, you might want to open a lightbox here
    window.open(imageUrl, '_blank');
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

  // Function to render image thumbnails
  const renderImageThumbnails = (images) => {
    if (!images || images.length === 0) return 'No images';
    
    return (
      <div className="d-flex gap-2">
        {images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`Attachment ${index + 1}`} 
            style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => handleImageClick(img)}
            className="border rounded"
          />
        ))}
      </div>
    );
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <CIcon icon={cilChatBubble} className="me-2" />
                Support Tickets
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
                    <option value="all">All Tickets</option>
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
                      placeholder="Search by subject, username, or message..." 
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
                    <CTableHeaderCell>Ticket ID</CTableHeaderCell>
                    <CTableHeaderCell>Subject</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                    <CTableHeaderCell>Images</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map(ticket => (
                      <CTableRow key={ticket.id}>
                        <CTableDataCell>
                          <small className="text-muted">{ticket.id}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          {getSubjectBadge(ticket.subject)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div><strong>@{ticket.username}</strong></div>
                          <small className="text-muted">{ticket.phone || 'N/A'}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="text-truncate" style={{ maxWidth: '200px' }} title={ticket.message}>
                            {ticket.message}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {renderImageThumbnails(ticket.images)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{formatDate(ticket.createdAt)}</div>
                          {ticket.repliedAt && (
                            <small className="text-muted">
                              Replied: {formatDate(ticket.repliedAt)}
                            </small>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {getStatusBadge(ticket.status)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton 
                              color={ticket.status === 'replied' ? 'info' : 'primary'}
                              size="sm" 
                              onClick={() => handleReplyClick(ticket)}
                            >
                              <CIcon icon={ticket.status === 'replied' ? cilCheckCircle : cilArrowRight} className="me-1" />
                              {ticket.status === 'replied' ? 'View' : 'Reply'}
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No tickets found matching your criteria
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
            {selectedFeedback?.status === 'replied' ? 'View Ticket' : 'Reply to Ticket'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedFeedback && (
            <>
              <div className="mb-3">
                <h6>From: @{selectedFeedback.username}</h6>
                <div className="mb-2">
                  <strong>Subject:</strong> {selectedFeedback.subject}
                </div>
                <p className="mb-2"><strong>Message:</strong></p>
                <div className="p-3 bg-light rounded">
                  {selectedFeedback.message}
                </div>
                <div className="mt-2 small text-muted">
                  Submitted on: {formatDate(selectedFeedback.createdAt)}
                </div>
                {selectedFeedback.images && selectedFeedback.images.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2"><strong>Attached Images:</strong></p>
                    <div className="d-flex gap-2 flex-wrap">
                      {selectedFeedback.images.map((img, index) => (
                        <img 
                          key={index} 
                          src={img} 
                          alt={`Attachment ${index + 1}`}
                          style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                          onClick={() => handleImageClick(img)}
                          className="img-thumbnail"
                        />
                      ))}
                    </div>
                  </div>
                )}
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

export default Tickets;
