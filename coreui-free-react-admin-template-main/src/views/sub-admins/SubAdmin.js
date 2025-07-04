import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CFormCheck
} from '@coreui/react';
import { 
  cilSearch, 
  cilUserPlus, 
  cilShieldAlt, 
  cilCheck, 
  cilBan, 
  cilPencil, 
  cilTrash,
  cilX,
  cilSave
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Mock data - replace with actual API call
const mockUsers = [
  { id: 'USR1001', username: 'johndoe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567', status: 'active' },
  { id: 'USR1002', username: 'janedoe', email: 'jane.doe@example.com', phone: '+1 (555) 987-6543', status: 'active' },
  { id: 'USR1003', username: 'bobsmith', email: 'bob.smith@example.com', phone: '+1 (555) 456-7890', status: 'active' },
  { id: 'USR1004', username: 'alicej', email: 'alice.j@example.com', phone: '+1 (555) 234-5678', status: 'suspended' },
  { id: 'USR1005', username: 'mikeb', email: 'mike.b@example.com', phone: '+1 (555) 876-5432', status: 'active' },
];

// Mock sub-admins - replace with actual API call
const mockSubAdminsData = [
  { 
    id: 'SA001',
    userId: 'USR1001', 
    username: 'johndoe', 
    email: 'john.doe@example.com', 
    accessLevel: 'full', 
    status: 'active',
    permissions: {
      userManagement: true,
      subAdminManagement: true,
      notificationsManagement: true,
      competitionsManagement: true,
      coinsManagement: true,
      videosManagement: true,
      withdrawManagement: true,
      feedbackManagement: true
    },
    createdAt: '2025-06-20T10:30:00Z',
    updatedAt: '2025-06-20T10:30:00Z'
  },
  { 
    id: 'SA002',
    userId: 'USR1002', 
    username: 'janedoe', 
    email: 'jane.doe@example.com', 
    accessLevel: 'limited', 
    status: 'active',
    permissions: {
      userManagement: false,
      subAdminManagement: false,
      notificationsManagement: true,
      competitionsManagement: true,
      coinsManagement: false,
      videosManagement: true,
      withdrawManagement: false,
      feedbackManagement: true
    },
    createdAt: '2025-06-21T14:15:00Z',
    updatedAt: '2025-06-21T14:15:00Z'
  }
];

const SubAdmin = () => {
  const [subAdmins, setSubAdmins] = useState([...mockSubAdminsData]);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [accessLevel, setAccessLevel] = useState('limited');
  
  // Permissions state
  const [permissions, setPermissions] = useState({
    userManagement: false,
    subAdminManagement: false,
    notificationsManagement: false,
    competitionsManagement: false,
    coinsManagement: false,
    videosManagement: false,
    withdrawManagement: false,
    feedbackManagement: false,
  });
  
  // Update permissions when access level changes
  useEffect(() => {
    if (accessLevel === 'full') {
      setPermissions({
        userManagement: true,
        subAdminManagement: true,
        notificationsManagement: true,
        competitionsManagement: true,
        coinsManagement: true,
        videosManagement: true,
        withdrawManagement: true,
        feedbackManagement: true,
      });
    } else if (accessLevel === 'limited') {
      setPermissions({
        userManagement: false,
        subAdminManagement: false,
        notificationsManagement: true,
        competitionsManagement: true,
        coinsManagement: false,
        videosManagement: true,
        withdrawManagement: false,
        feedbackManagement: true,
      });
    }
  }, [accessLevel]);
  
  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };
  
  // Filter users based on search term and exclude existing sub-admins
  const filteredUsers = mockUsers.filter(user => {
    const isSubAdmin = subAdmins.some(admin => admin.userId === user.id);
    const matchesSearch = !searchTerm || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    return !isSubAdmin && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would trigger an API search here
    console.log('Searching for:', searchTerm);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    // Prepare sub-admin data
    const newSubAdmin = {
      id: `SA${Math.floor(1000 + Math.random() * 9000)}`,
      userId: selectedUser.id,
      username: selectedUser.username,
      email: selectedUser.email,
      accessLevel,
      permissions: { ...permissions },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
      setSubAdmins(prev => [newSubAdmin, ...prev]);
      setIsLoading(false);
      setMessage({ 
        type: 'success', 
        content: `Successfully granted ${accessLevel} access to ${selectedUser.username}` 
      });
      
      // Reset form
      setSelectedUser(null);
      setSearchTerm('');
      setIsAdding(false);
      setAccessLevel('limited');
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage({ type: '', content: '' }), 5000);
    }, 500);
  };
  
  const handleEdit = (subAdmin) => {
    setSelectedUser({
      id: subAdmin.userId,
      username: subAdmin.username,
      email: subAdmin.email
    });
    setAccessLevel(subAdmin.accessLevel);
    setPermissions(subAdmin.permissions);
    setEditingSubAdmin(subAdmin.id);
    setIsAdding(true);
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingSubAdmin) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubAdmins(prev => 
        prev.map(admin => 
          admin.id === editingSubAdmin 
            ? { 
                ...admin, 
                accessLevel,
                permissions: { ...permissions },
                updatedAt: new Date().toISOString() 
              } 
            : admin
        )
      );
      
      setIsLoading(false);
      setMessage({ 
        type: 'success', 
        content: 'Successfully updated sub-admin permissions' 
      });
      
      // Reset form
      setSelectedUser(null);
      setSearchTerm('');
      setIsAdding(false);
      setEditingSubAdmin(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage({ type: '', content: '' }), 5000);
    }, 500);
  };
  
  const handleRemove = (subAdminId) => {
    if (window.confirm('Are you sure you want to remove this sub-admin?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setSubAdmins(prev => prev.filter(admin => admin.id !== subAdminId));
        setIsLoading(false);
        setMessage({ 
          type: 'success', 
          content: 'Sub-admin access has been revoked' 
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => setMessage({ type: '', content: '' }), 5000);
      }, 500);
    }
  };
  
  const getPermissionCount = (permissions) => {
    return Object.values(permissions).filter(Boolean).length;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setIsAdding(false);
    setMessage({ type: '', content: '' });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <CIcon icon={cilShieldAlt} className="me-2" />
                Sub-Admin Management
              </h5>
            </div>
          </CCardHeader>
          <CCardBody>
            {message.content && (
              <CAlert color={message.type} className="mb-4">
                {message.content}
              </CAlert>
            )}

            <h6 className="mb-3">Add New Sub-Admin</h6>
            
            {!isAdding ? (
              <>
                <CForm onSubmit={handleSearch} className="mb-4">
                  <CRow className="g-3">
                    <CCol md={8}>
                      <CFormLabel>Search Employees</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Search by username, email, or phone..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <CButton type="submit" color="primary">
                          Search
                        </CButton>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                </CForm>

                {searchTerm && filteredUsers.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">Search Results</h6>
                    <div className="table-responsive">
                      <CTable hover>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Username</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Phone</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {filteredUsers.map(user => (
                            <CTableRow key={user.id}>
                              <CTableDataCell>@{user.username}</CTableDataCell>
                              <CTableDataCell>{user.email}</CTableDataCell>
                              <CTableDataCell>{user.phone}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={user.status === 'active' ? 'success' : 'warning'}>
                                  {user.status}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CButton 
                                  color="primary" 
                                  size="sm"
                                  onClick={() => handleUserSelect(user)}
                                >
                                  <CIcon icon={cilUserPlus} className="me-1" />
                                  Make Sub-Admin
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </div>
                  </div>
                )}

                {searchTerm && filteredUsers.length === 0 && (
                  <div className="text-center py-4">
                    <p>No users found matching your search criteria.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="mb-0">
                    {editingSubAdmin ? 'Edit' : 'Grant'} Sub-Admin Access to @{selectedUser?.username}
                  </h6>
                  <CButton 
                    color="ghost-danger" 
                    size="sm" 
                    onClick={() => {
                      setSelectedUser(null);
                      setIsAdding(false);
                      setEditingSubAdmin(null);
                      setAccessLevel('limited');
                    }}
                  >
                    <CIcon icon={cilX} />
                  </CButton>
                </div>
                
                <CForm onSubmit={editingSubAdmin ? handleUpdate : handleSubmit}>
                  <div className="mb-4">
                    <CFormLabel className="fw-bold">Access Level</CFormLabel>
                    <CFormSelect 
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value)}
                      className="mb-3"
                    >
                      <option value="limited">Limited Access</option>
                      <option value="full">Full Access</option>
                      <option value="custom">Custom Access</option>
                    </CFormSelect>
                    <div className="form-text mb-3">
                      {accessLevel === 'limited' 
                        ? 'Limited access with predefined permissions.'
                        : accessLevel === 'full' 
                          ? 'Full access to all administrative sections.'
                          : 'Customize access permissions below.'}
                    </div>
                    
                    {accessLevel === 'custom' && (
                      <div className="border p-3 rounded">
                        <h6 className="mb-3">Page Access Permissions</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <CFormCheck
                              id="userManagement"
                              label="User Management"
                              checked={permissions.userManagement}
                              onChange={() => handlePermissionChange('userManagement')}
                              className="mb-2"
                            />
                            <CFormCheck
                              id="subAdminManagement"
                              label="Sub-Admin Management"
                              checked={permissions.subAdminManagement}
                              onChange={() => handlePermissionChange('subAdminManagement')}
                              className="mb-2"
                            />
                            <CFormCheck
                              id="notificationsManagement"
                              label="Notifications Management"
                              checked={permissions.notificationsManagement}
                              onChange={() => handlePermissionChange('notificationsManagement')}
                              className="mb-2"
                            />
                            <CFormCheck
                              id="competitionsManagement"
                              label="Competitions Management"
                              checked={permissions.competitionsManagement}
                              onChange={() => handlePermissionChange('competitionsManagement')}
                              className="mb-2"
                            />
                          </div>
                          <div className="col-md-6">
                            <CFormCheck
                              id="coinsManagement"
                              label="Coins Management"
                              checked={permissions.coinsManagement}
                              onChange={() => handlePermissionChange('coinsManagement')}
                              className="mb-2"
                            />
                            <CFormCheck
                              id="videosManagement"
                              label="Videos Management"
                              checked={permissions.videosManagement}
                              onChange={() => handlePermissionChange('videosManagement')}
                              className="mb-2"
                            />
                            <CFormCheck
                              id="withdrawManagement"
                              label="Withdraw Management"
                              checked={permissions.withdrawManagement}
                              onChange={() => handlePermissionChange('withdrawManagement')}
                              className="mb-2"
                            />
                            <CFormCheck
                              id="feedbackManagement"
                              label="Feedback Management"
                              checked={permissions.feedbackManagement}
                              onChange={() => handlePermissionChange('feedbackManagement')}
                              className="mb-2"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {accessLevel !== 'custom' && (
                      <div className="mt-3">
                        <h6>Included Permissions:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Object.entries(permissions).map(([key, value]) => (
                            value && (
                              <CBadge key={key} color="success" className="me-1 mb-1">
                                <CIcon icon={cilCheck} className="me-1" />
                                {key.replace('Management', '')}
                              </CBadge>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <CButton 
                      color="secondary" 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </CButton>
                    <CButton 
                      type="submit" 
                      color="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <CSpinner component="span" size="sm" aria-hidden="true" className="me-2" />
                          {editingSubAdmin ? 'Updating...' : 'Granting Access...'}
                        </>
                      ) : (
                        <>
                          <CIcon icon={editingSubAdmin ? cilSave : cilUserPlus} className="me-1" />
                          {editingSubAdmin ? 'Update Access' : 'Grant Access'}
                        </>
                      )}
                    </CButton>
                  </div>
                </CForm>
              </div>
            )}
          </CCardBody>
        </CCard>
        
        {/* Current Sub-Admins List */}
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">Current Sub-Admins</h5>
          </CCardHeader>
          <CCardBody>
            {subAdmins.length === 0 ? (
              <div className="text-center py-4">
                <p>No sub-admins found. Use the form above to add a new sub-admin.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Username</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Access Level</CTableHeaderCell>
                      <CTableHeaderCell>Permissions</CTableHeaderCell>
                      <CTableHeaderCell>Last Updated</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {subAdmins.map(subAdmin => (
                      <CTableRow key={subAdmin.id}>
                        <CTableDataCell>
                          <strong>@{subAdmin.username}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{subAdmin.email}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={
                            subAdmin.accessLevel === 'full' ? 'success' : 
                            subAdmin.accessLevel === 'custom' ? 'info' : 'primary'
                          }>
                            {subAdmin.accessLevel.charAt(0).toUpperCase() + subAdmin.accessLevel.slice(1)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-wrap gap-1">
                            {getPermissionCount(subAdmin.permissions) === 0 ? (
                              <span className="text-muted">No permissions</span>
                            ) : (
                              <CBadge color="info">
                                {getPermissionCount(subAdmin.permissions)} {getPermissionCount(subAdmin.permissions) === 1 ? 'permission' : 'permissions'}
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <small className="text-muted">
                            {formatDate(subAdmin.updatedAt || subAdmin.createdAt)}
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton 
                              color="primary" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEdit(subAdmin)}
                              title="Edit Permissions"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton 
                              color="danger" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleRemove(subAdmin.id)}
                              title="Remove Access"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default SubAdmin;
