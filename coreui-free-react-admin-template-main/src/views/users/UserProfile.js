import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../api/supabaseClient'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CAlert,
  CContainer,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilArrowLeft, 
  cilUser, 
  cilLink, 
  cilEnvelopeOpen,
  cilCalendar,
  cilBadge,
  cilAt,
  cilPhone,
  cilWallet,
  cilAccountLogout,
  cilVideo,
  cilMediaPlay,
  cilUserFollow,
  cilUserUnfollow,
  cilX
} from '@coreui/icons'

// Move the main component logic to a custom hook
const useUserProfile = (id) => {
  // User data state
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  
  // Videos state
  const [videos, setVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(false)
  const [videosError, setVideosError] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoRef = useRef(null)
  const headerRef = useRef(null)
  
  const navigate = useNavigate()
  
  // Fetch user data
  const fetchUserData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      setError(`Failed to load user data. User with ID ${id} may not exist.`)
    } else if (data) {
      setUser({
        id: data.id,
        srNo: data.sr_no || 'N/A',
        firstName: data.first_name || 'N/A',
        username: data.username || 'N/A',
        email: data.email || 'N/A',
        phone: data.phone || 'N/A',
        birthday: data.birthday ? new Date(data.birthday).toLocaleDateString() : 'N/A',
        wallet: data.wallet_coins || 0,
        status: data.status || 'N/A',
        joiningDate: data.joining_date ? new Date(data.joining_date).toLocaleDateString() : 'N/A',
        imageUrl: data.image_url || null
      })
    }
    setLoading(false)
  }, [id])

  // Fetch user's videos
  const fetchUserVideos = useCallback(async () => {
    if (!id) return
    
    setVideosLoading(true)
    setVideosError(null)
    
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
      setVideosError('Failed to load videos. Please try again later.')
    } finally {
      setVideosLoading(false)
    }
  }, [id])

  // Handle scroll effect
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Initial data fetch
  useEffect(() => {
    fetchUserData()
    fetchUserVideos()
  }, [fetchUserData, fetchUserVideos])

  // Video cleanup
  useEffect(() => {
    const currentVideoRef = videoRef.current;
    return () => {
      if (currentVideoRef) {
        currentVideoRef.pause();
        currentVideoRef.currentTime = 0;
      }
    };
  }, [selectedVideo]);

  return {
    // State
    user,
    loading,
    error,
    scrolled,
    videos,
    videosLoading,
    videosError,
    selectedVideo,
    isVideoModalOpen,
    videoRef,
    headerRef,
    // Methods
    setSelectedVideo,
    setIsVideoModalOpen,
    navigate
  };
};

const UserProfile = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  
  // Use the custom hook for all user profile logic
  const {
    user,
    loading,
    error,
    scrolled,
    videos,
    videosLoading,
    videosError,
    selectedVideo,
    isVideoModalOpen,
    videoRef,
    headerRef,
    setSelectedVideo,
    setIsVideoModalOpen,
    navigate
  } = useUserProfile(id)

  // Format duration in MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle video click
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoModalOpen(false);
  };

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger" className="text-center">
          {error}
          <div className="mt-2">
            <CButton color="secondary" onClick={() => navigate('/users')}>
              <CIcon icon={cilArrowLeft} className="me-1" /> Back to Users
            </CButton>
          </div>
        </CAlert>
      </CContainer>
    )
  }

  if (!user) {
    return (
      <CContainer>
        <CAlert color="warning" className="text-center">
          User not found
          <div className="mt-2">
            <CButton color="secondary" onClick={() => navigate('/users')}>
              <CIcon icon={cilArrowLeft} className="me-1" /> Back to Users
            </CButton>
          </div>
        </CAlert>
      </CContainer>
    )
  }



  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <CContainer>
        <CAlert color="danger" className="text-center">
          {error}
          <div className="mt-2">
            <CButton color="secondary" onClick={() => navigate('/users')}>
              <CIcon icon={cilArrowLeft} className="me-1" /> Back to Users
            </CButton>
          </div>
        </CAlert>
      </CContainer>
    )
  }

  // User not found state
  if (!user) {
    return (
      <CContainer>
        <CAlert color="warning" className="text-center">
          User not found
          <div className="mt-2">
            <CButton color="secondary" onClick={() => navigate('/users')}>
              <CIcon icon={cilArrowLeft} className="me-1" /> Back to Users
            </CButton>
          </div>
        </CAlert>
      </CContainer>
    )
  }

  // Main content render
  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <div className="mt-4">
            <h5 className="text-white mb-4">Uploaded Videos</h5>
            
            {videosLoading ? (
              <div className="d-flex justify-content-center my-5">
                <CSpinner color="primary" />
              </div>
            ) : videosError ? (
              <CAlert color="danger">{videosError}</CAlert>
            ) : videos.length === 0 ? (
              <div className="text-center py-5">
                <CIcon icon={cilVideo} size="3xl" className="text-muted mb-3" />
                <p className="text-muted">No videos found for this user</p>
              </div>
            ) : (
              <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 3 }} className="g-4">
                {videos.map((video) => (
                  <CCol key={video.id}>
                    <CCard 
                      className="h-100 border-0 video-card" 
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        overflow: 'hidden'
                      }}
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="position-relative" style={{ paddingTop: '56.25%' }}>
                        <div 
                          className="position-absolute top-0 start-0 w-100 h-100 bg-dark d-flex align-items-center justify-content-center"
                          style={{
                            backgroundImage: video.thumbnail_url ? `url(${video.thumbnail_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.8
                          }}
                        >
                          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>
                          <CIcon 
                            icon={cilMediaPlay} 
                            size="3xl" 
                            className="text-white position-relative"
                            style={{ 
                              zIndex: 1,
                              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))'
                            }}
                          />
                          {video.duration && (
                            <div 
                              className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                fontSize: '0.75rem',
                                zIndex: 2
                              }}
                            >
                              {formatDuration(video.duration)}
                            </div>
                          )}
                        </div>
                      </div>
                      <CCardBody>
                        <h6 
                          className="text-white mb-1 text-truncate" 
                          title={video.title}
                          style={{ fontWeight: '500' }}
                        >
                          {video.title || 'Untitled Video'}
                        </h6>
                        {video.description && (
                          <p 
                            className="text-muted small mb-2 line-clamp-2" 
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '2.5rem'
                            }}
                          >
                            {video.description}
                          </p>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="text-white-50 small">
                            {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="text-white-50 small">
                            {formatFileSize(video.size)}
                          </span>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            )}

            {/* Video Modal */}
            {selectedVideo && (
              <div 
                className={`video-modal ${isVideoModalOpen ? 'show' : ''}`}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  display: isVideoModalOpen ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '1rem'
                }}
                onClick={handleCloseModal}
              >
                <div 
                  className="position-relative"
                  style={{
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button 
                    className="position-absolute top-0 end-0 m-3 btn btn-dark rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}
                    onClick={handleCloseModal}
                  >
                    <CIcon icon={cilX} className="text-white" />
                  </button>
                  
                  <div className="ratio ratio-16x9">
                    <video 
                      ref={videoRef}
                      src={selectedVideo.video_url} 
                      controls 
                      autoPlay
                      className="w-100 h-100"
                      style={{
                        backgroundColor: '#000',
                        outline: 'none'
                      }}
                      onEnded={() => {
                        // When video ends, reset it to start
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                        }
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h5 className="text-white mb-2">{selectedVideo.title || 'Untitled Video'}</h5>
                    {selectedVideo.description && (
                      <p className="text-white-50 mb-3">{selectedVideo.description}</p>
                    )}
                    <div className="d-flex justify-content-between text-white-50 small">
                      <span>Duration: {formatDuration(selectedVideo.duration)}</span>
                      <span>Size: {formatFileSize(selectedVideo.size)}</span>
                      <span>Uploaded: {selectedVideo.created_at ? new Date(selectedVideo.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Styles */}
            <style jsx>{`
              .video-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
              }
              .video-card {
                transition: all 0.3s ease;
              }
              .video-card .card-body {
                padding: 1.25rem;
              }
              .video-card h6 {
                transition: color 0.2s ease;
              }
              .video-card:hover h6 {
                color: var(--cui-primary) !important;
              }
              .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .video-modal.show {
                animation: fadeIn 0.2s ease-in-out;
              }
            `}</style>
          </div>
        )
      case 'details':
      default:
        return (
          <CCardBody className="p-0">
            <CRow>
              <CCol md={6}>
                <CListGroup style={{ '--cui-list-group-bg': 'rgba(0, 0, 0, 0.2)', '--cui-list-group-border-color': 'rgba(255, 255, 255, 0.1)' }}>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilUser} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Full Name</div>
                      <div className="text-white">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilAt} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Username</div>
                      <div className="text-white">@{user.username}</div>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilEnvelopeOpen} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Email</div>
                      <div>
                        {user.email !== 'N/A' ? (
                          <CLink href={`mailto:${user.email}`} className="text-info text-decoration-none">
                            {user.email}
                          </CLink>
                        ) : (
                          <span className="text-white">{user.email}</span>
                        )}
                      </div>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilPhone} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Phone</div>
                      <div>
                        {user.phone !== 'N/A' ? (
                          <CLink href={`tel:${user.phone}`} className="text-info text-decoration-none">
                            {user.phone}
                          </CLink>
                        ) : (
                          <span className="text-white">{user.phone}</span>
                        )}
                      </div>
                    </div>
                  </CListGroupItem>
                </CListGroup>
              </CCol>
              <CCol md={6}>
                <CListGroup style={{ '--cui-list-group-bg': 'rgba(0, 0, 0, 0.2)', '--cui-list-group-border-color': 'rgba(255, 255, 255, 0.1)' }}>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilCalendar} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Birthday</div>
                      <div className="text-white">{user.birthday}</div>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilWallet} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Wallet Coins</div>
                      <div className="text-white">{user.wallet}</div>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilAccountLogout} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">Joining Date</div>
                      <div className="text-white">{user.joiningDate}</div>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center border-secondary border-opacity-25">
                    <CIcon icon={cilLink} className="me-3 text-primary" />
                    <div>
                      <div className="text-white-50 small">SR No</div>
                      <div className="text-white">{user.srNo}</div>
                    </div>
                  </CListGroupItem>
                </CListGroup>
              </CCol>
            </CRow>
          </CCardBody>
        )
    }
  }

  return (
    <div className="min-vh-100 bg-dark position-relative">
      {/* Back to Users Button */}
      <div style={{ 
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 9999
      }}>
        <CButton 
          color="light"
          variant="ghost"
          shape="rounded-pill"
          onClick={() => navigate('/users')}
          className="d-flex align-items-center"
          style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.5rem 1rem'
          }}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Users
        </CButton>
      </div>

      {/* Profile Header */}
      <div 
        ref={headerRef}
        className="position-relative w-100"
        style={{
          height: '50vh',
          minHeight: '300px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Back Button */}
        <div className="position-absolute top-0 start-0 p-3">
          <CButton 
            color="light" 
            shape="rounded-pill" 
            onClick={() => navigate('/users')}
            className="shadow-sm"
          >
            <CIcon icon={cilArrowLeft} className="me-1" /> Back to Users
          </CButton>
        </div>
        
        {/* Status Badge */}
        <div className="position-absolute top-0 end-0 p-3">
          <span className={`badge ${user.status === 'blocked' ? 'bg-danger' : 'bg-success'} p-2`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </div>

        {/* Profile Image */}
        <div style={{
          width: '100%',
          height: '50vh',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1a1e2c',
          opacity: scrolled ? 0.9 : 1,
          transform: scrolled ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {user.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.username} 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: scrolled ? 'scale(1.1)' : 'scale(1.05)'
              }}
            />
          ) : (
            <div 
              className="d-flex align-items-center justify-content-center w-100 h-100"
              style={{ 
                backgroundColor: '#f0f2f5',
                color: '#6c757d',
                fontSize: '1.5rem'
              }}
            >
              <CIcon icon={cilUser} size="4xl" className="me-2" />
              No Image
            </div>
          )}
          
          {/* User Info Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            padding: '2rem 1.5rem',
            color: 'white',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            <h2 className="mb-1">{user.firstName} {user.lastName || ''}</h2>
            <p className="mb-0">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Social Icons Section */}
      <div className="py-4" style={{ backgroundColor: 'var(--cui-body-bg, #2a3042)' }}>
        <CContainer>
          <div className="d-flex justify-content-center gap-4">
            <CButton 
              color="dark"
              variant="ghost"
              shape="rounded-pill"
              className="d-flex flex-column align-items-center justify-content-center border-0"
              style={{ 
                width: '60px', 
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              title="Instagram"
            >
              <i className="cib-instagram fs-4" style={{ color: '#e4405f' }}></i>
              <small className="mt-1 text-white-50">Instagram</small>
            </CButton>
            <CButton 
              color="dark"
              variant="ghost"
              shape="rounded-pill"
              className="d-flex flex-column align-items-center justify-content-center border-0"
              style={{ 
                width: '60px', 
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              title="Twitter"
            >
              <i className="cib-twitter fs-4" style={{ color: '#1da1f2' }}></i>
              <small className="mt-1 text-white-50">Twitter</small>
            </CButton>
            <CButton 
              color="dark"
              variant="ghost"
              shape="rounded-pill"
              className="d-flex flex-column align-items-center justify-content-center border-0"
              style={{ 
                width: '60px', 
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              title="Facebook"
            >
              <i className="cib-facebook fs-4" style={{ color: '#1877f2' }}></i>
              <small className="mt-1 text-white-50">Facebook</small>
            </CButton>
          </div>
        </CContainer>
      </div>
      
      {/* User Details Section */}
      <CContainer className="pb-5">
        <CCard className="border-0 shadow-sm" style={{ backgroundColor: 'var(--cui-body-bg, #2a3042)' }}>
          {/* Scrolled Header */}
          {scrolled && (
            <CCardHeader className="d-flex align-items-center py-2" style={{ 
              backgroundColor: 'var(--cui-card-cap-bg, rgba(0, 0, 0, 0.3))',
              borderBottom: '1px solid var(--cui-card-border-color, rgba(255, 255, 255, 0.1))'
            }}>
              <div className="d-flex align-items-center">
                <div className="me-3" style={{ width: '40px', height: '40px' }}>
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.username}
                      className="rounded-circle w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="rounded-circle w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <CIcon icon={cilUser} className="text-white-50" />
                    </div>
                  )}
                </div>
                <div>
                  <h6 className="mb-0 text-white">{user.firstName} {user.lastName || ''}</h6>
                  <small className="text-white-50">@{user.username}</small>
                </div>
              </div>
              <div className="ms-auto">
                <CButton 
                  color="light" 
                  variant="ghost" 
                  size="sm" 
                  className="text-white"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <CIcon icon={cilArrowLeft} className="me-1" /> Back to Top
                </CButton>
              </div>
            </CCardHeader>
          )}
          <div className="d-flex border-bottom border-secondary border-opacity-25 px-3">
            <button 
              className={`btn btn-link text-decoration-none py-3 me-4 position-relative ${activeTab === 'details' ? 'text-white fw-semibold' : 'text-white-50'}`}
              onClick={() => setActiveTab('details')}
            >
              <CIcon icon={cilUser} className="me-2" />
              User Details
              {activeTab === 'details' && (
                <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '3px', background: 'rgba(255, 255, 255, 0.5)' }} />
              )}
            </button>
            <button 
              className={`btn btn-link text-decoration-none py-3 position-relative ${activeTab === 'videos' ? 'text-white fw-semibold' : 'text-white-50'}`}
              onClick={() => setActiveTab('videos')}
            >
              <CIcon icon={cilVideo} className="me-2" />
              Videos ({videos.length})
              {activeTab === 'videos' && (
                <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '3px', background: 'rgba(255, 255, 255, 0.5)' }} />
              )}
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
          
          {/* Actions Button */}
          <div className="p-4 border-top border-secondary border-opacity-25">
            <div className="d-flex justify-content-end">
              <CButton 
                color="primary" 
                onClick={() => navigate(`/users/${id}/actions`)}
              >
                <CIcon icon={cilAccountLogout} className="me-2" />
                Actions
              </CButton>
            </div>
          </div>
        </CCard>
      </CContainer>
    </div>
  )
}

export default UserProfile