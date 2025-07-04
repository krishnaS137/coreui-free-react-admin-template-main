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
  CButton,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CForm,
  CSpinner,
  CAlert
} from '@coreui/react';
import { cilSearch, cilTrash, cilVideo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Mock data - replace with actual API call
const mockVideos = [
  {
    id: 1,
    title: 'Morning Workout',
    username: 'fitness_lover',
    status: 'Public',
    uploadDate: '2025-06-20',
    views: 1250
  },
  {
    id: 2,
    title: 'Unlisted Tutorial',
    username: 'tech_guru',
    status: 'Private',
    uploadDate: '2025-06-18',
    views: 42
  },
  {
    id: 3,
    title: 'Vacation Vlog',
    username: 'travel_bug',
    status: 'Draft',
    uploadDate: '2025-06-15',
    views: 0
  },
  {
    id: 4,
    title: 'Cooking Show',
    username: 'chef_mike',
    status: 'Rejected',
    uploadDate: '2025-06-10',
    views: 0,
    rejectionReason: 'Violates community guidelines'
  },
  {
    id: 5,
    title: 'Gaming Highlights',
    username: 'game_master',
    status: 'Public',
    uploadDate: '2025-06-22',
    views: 3245
  }
];

const Videos = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  
  const [videos, setVideos] = useState(mockVideos);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = !filters.search || 
      video.username.toLowerCase().includes(filters.search.toLowerCase());
      
    const matchesStatus = !filters.status || 
      video.status.toLowerCase() === filters.status.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVideos(prev => prev.filter(video => video.id !== videoId));
        setDeleteSuccess('Video deleted successfully!');
        
        // Hide success message after 3 seconds
        setTimeout(() => setDeleteSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting video:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <CIcon icon={cilVideo} className="me-2" />
                Videos Management
              </h5>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-4">
              <CRow className="g-3">
                <CCol md={4}>
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Draft">Draft</option>
                    <option value="Rejected">Rejected</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Search by Username</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput 
                      name="search"
                      placeholder="Search by username..." 
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={2} className="d-flex align-items-end">
                  <CButton 
                    color="secondary" 
                    variant="outline" 
                    onClick={() => setFilters({ search: '', status: '' })}
                    className="w-100"
                  >
                    Clear Filters
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            {deleteSuccess && (
              <CAlert color="success" className="mb-4">
                {deleteSuccess}
              </CAlert>
            )}
            
            <div className="table-responsive">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Upload Date</CTableHeaderCell>
                    <CTableHeaderCell>Views</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map(video => (
                      <CTableRow key={video.id}>
                        <CTableDataCell>{video.title}</CTableDataCell>
                        <CTableDataCell>@{video.username}</CTableDataCell>
                        <CTableDataCell>
                          <span className={`badge bg-${getStatusBadgeColor(video.status)}`}>
                            {video.status}
                          </span>
                          {video.rejectionReason && (
                            <div className="small text-muted">{video.rejectionReason}</div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(video.uploadDate)}</CTableDataCell>
                        <CTableDataCell>{formatNumber(video.views)}</CTableDataCell>
                        <CTableDataCell>
                          <CButton 
                            color="danger" 
                            size="sm" 
                            onClick={() => handleDelete(video.id)}
                            disabled={isDeleting}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No videos found matching your criteria
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

// Helper function to get badge color based on status
const getStatusBadgeColor = (status) => {
  switch (status.toLowerCase()) {
    case 'public':
      return 'success';
    case 'private':
      return 'info';
    case 'draft':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default Videos;
