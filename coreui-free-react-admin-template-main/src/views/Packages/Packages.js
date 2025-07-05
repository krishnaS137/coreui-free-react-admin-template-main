import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../api/supabaseClient'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
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
  CFormSwitch,
  CFormFeedback
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilDollar, 
  cilStar, 
  cilCheck,
  cilX
} from '@coreui/icons'

// Mock data - replace with actual API calls
const mockPackages = [
  {
    id: 'pkg1',
    name: 'Starter Pack',
    price: 10,
    bonusPercent: 0,
    isFamous: false,
    isActive: true,
    createdAt: '2025-06-20T10:00:00Z'
  },
  {
    id: 'pkg2',
    name: 'Pro Pack',
    price: 50,
    bonusPercent: 10,
    isFamous: true,
    isActive: true,
    createdAt: '2025-06-21T15:30:00Z'
  },
  {
    id: 'pkg3',
    name: 'Premium Pack',
    price: 100,
    bonusPercent: 20,
    isFamous: false,
    isActive: false,
    createdAt: '2025-06-22T09:15:00Z'
  }
];

const Packages = () => {
  const navigate = useNavigate()

  // State for form inputs
  const [packages, setPackages] = useState([...mockPackages]);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    bonusPercent: 0,
    isFamous: false,
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load packages from API on component mount
  useEffect(() => {
    // Replace with actual API call
    // fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    try {
      // Replace with actual Supabase call
      // const { data, error } = await supabase.from('packages').select('*');
      // if (error) throw error;
      // setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoinImage(e.target.files[0])
    }
  }

  // Calculate base coins (1 INR = 10 coins)
  const calculateBaseCoins = (price) => {
    return Math.round(price * 10);
  };

  // Calculate total coins including bonus
  const calculateTotalCoins = (price, bonusPercent) => {
    const baseCoins = calculateBaseCoins(price);
    const bonusCoins = Math.round((baseCoins * bonusPercent) / 100);
    return baseCoins + bonusCoins;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.name || !formData.price) {
        throw new Error('Name and price are required');
      }
      
      const bonusPercent = parseInt(formData.bonusPercent) || 0;
      if (bonusPercent < 0 || bonusPercent > 100) {
        throw new Error('Bonus percentage must be between 0 and 100');
      }

      const price = parseFloat(formData.price);
      const baseCoins = calculateBaseCoins(price);
      const totalCoins = calculateTotalCoins(price, bonusPercent);

      const packageData = {
        name: formData.name,
        price: price,
        bonus_percent: bonusPercent,
        base_coins: baseCoins,
        total_coins: totalCoins,
        is_famous: formData.isFamous,
        is_active: formData.isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingPkg) {
        // Update existing package
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', editingPkg);
          
        if (error) throw error;
        
        setPackages(packages.map(pkg => 
          pkg.id === editingPkg ? { ...pkg, ...packageData } : pkg
        ));
        setSuccess('Package updated successfully!');
      } else {
        // Create new package
        const { data, error } = await supabase
          .from('packages')
          .insert([packageData])
          .select();
          
        if (error) throw error;
        
        setPackages([...packages, ...data]);
        setSuccess('Package created successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        bonusPercent: 0,
        isFamous: false,
        isActive: true
      });
      setEditingPkg(null);
      
    } catch (err) {
      console.error('Error saving package:', err);
      setError(err.message || 'Failed to save package');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEdit = (pkg) => {
    setFormData({
      name: pkg.name,
      price: pkg.price,
      bonusPercent: pkg.bonusPercent || 0,
      isFamous: pkg.isFamous || false,
      isActive: pkg.isActive !== false // Default to true if undefined
    });
    setEditingPkg(pkg.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const { error } = await supabase
          .from('packages')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setPackages(packages.filter(pkg => pkg.id !== id));
        setSuccess('Package deleted successfully!');
      } catch (err) {
        console.error('Error deleting package:', err);
        setError('Failed to delete package');
      }
    }
  };
  
  const toggleStatus = async (pkg) => {
    try {
      const newStatus = !pkg.isActive;
      const { error } = await supabase
        .from('packages')
        .update({ is_active: newStatus })
        .eq('id', pkg.id);
        
      if (error) throw error;
      
      setPackages(packages.map(item => 
        item.id === pkg.id ? { ...item, isActive: newStatus } : item
      ));
    } catch (err) {
      console.error('Error updating package status:', err);
      setError('Failed to update package status');
    }
  };
  
  // Calculate coins display text
  const getCoinsDisplay = (pkg) => {
    const baseCoins = calculateBaseCoins(pkg.price);
    const totalCoins = calculateTotalCoins(pkg.price, pkg.bonusPercent || 0);
    
    if (pkg.bonusPercent > 0) {
      return (
        <>
          <span className="text-decoration-line-through text-muted me-2">
            {baseCoins.toLocaleString()} coins
          </span>
          <span className="text-success fw-bold">
            {totalCoins.toLocaleString()} coins ({pkg.bonusPercent}% bonus)
          </span>
        </>
      );
    }
    return <span>{baseCoins.toLocaleString()} coins</span>;
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>{editingPkg ? 'Edit' : 'Create New'} Package</h5>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger" onClose={() => setError('')} dismissible>{error}</CAlert>}
            {success && <CAlert color="success" onClose={() => setSuccess('')} dismissible>{success}</CAlert>}
            
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="name">Package Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter package name"
                    required
                    invalid={!formData.name && formData.name !== ''}
                  />
                  <CFormFeedback>Package name is required</CFormFeedback>
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="price">Price (INR)</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>₹</CInputGroupText>
                    <CFormInput
                      type="number"
                      id="price"
                      min="1"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Enter amount in INR"
                      required
                      invalid={!formData.price && formData.price !== ''}
                    />
                  </CInputGroup>
                  <div className="small text-muted mt-1">
                    {formData.price ? (
                      <span>{calculateBaseCoins(parseFloat(formData.price)).toLocaleString()} coins</span>
                    ) : '1 INR = 10 coins'}
                  </div>
                  <CFormFeedback>Price is required</CFormFeedback>
                </CCol>
                
                <CCol md={4}>
                  <CFormLabel htmlFor="bonusPercent">Bonus Coins (%)</CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      id="bonusPercent"
                      min="0"
                      max="100"
                      value={formData.bonusPercent}
                      onChange={(e) => setFormData({...formData, bonusPercent: e.target.value})}
                      placeholder="0"
                    />
                    <CInputGroupText>%</CInputGroupText>
                  </CInputGroup>
                  {formData.price && formData.bonusPercent > 0 && (
                    <div className="small text-muted mt-1">
                      {Math.round((calculateBaseCoins(parseFloat(formData.price)) * formData.bonusPercent) / 100).toLocaleString()} bonus coins
                    </div>
                  )}
                </CCol>
                
                <CCol md={4} className="d-flex align-items-end">
                  <div className="d-flex gap-4">
                    <CFormCheck
                      type="checkbox"
                      id="isFamous"
                      label="Mark as Famous"
                      checked={formData.isFamous}
                      onChange={(e) => setFormData({...formData, isFamous: e.target.checked})}
                    />
                    <CFormCheck
                      type="checkbox"
                      id="isActive"
                      label="Active"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="ms-3"
                    />
                  </div>
                </CCol>
              </CRow>
              
              <div className="d-flex gap-2">
                <CButton type="submit" color="primary" disabled={isSubmitting}>
                  <CIcon icon={editingPkg ? cilSave : cilPlus} className="me-2" />
                  {isSubmitting ? 'Saving...' : editingPkg ? 'Update Package' : 'Create Package'}
                </CButton>
                {editingPkg && (
                  <CButton 
                    color="secondary" 
                    variant="outline" 
                    onClick={() => {
                      setFormData({
                        name: '',
                        price: '',
                        discount: 0,
                        isFamous: false,
                        isActive: true
                      });
                      setEditingPkg(null);
                    }}
                    disabled={isSubmitting}
                  >
                    <CIcon icon={cilX} className="me-1" />
                    Cancel
                  </CButton>
                )}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
        
        {/* Packages List */}
        <CCard>
          <CCardHeader>
            <h5 className="mb-0">Packages List</h5>
          </CCardHeader>
          <CCardBody>
            {packages.length === 0 ? (
              <div className="text-center py-4">
                <p>No packages found. Create your first package above.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Package</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Coins</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {packages.map((pkg) => (
                      <CTableRow key={pkg.id}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <strong>{pkg.name}</strong>
                            {pkg.isFamous && (
                              <CBadge color="warning" className="ms-2" shape="rounded-pill">
                                <CIcon icon={cilStar} className="me-1" />
                                Famous
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-bold">
                            ₹{parseInt(pkg.price).toLocaleString()}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-column">
                            {getCoinsDisplay(pkg)}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormSwitch
                            id={`status-${pkg.id}`}
                            label=""
                            checked={pkg.isActive}
                            onChange={() => toggleStatus(pkg)}
                            className="d-inline-flex align-items-center"
                          />
                          <CBadge color={pkg.isActive ? 'success' : 'secondary'} className="ms-2">
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton 
                              color="primary" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEdit(pkg)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton 
                              color="danger" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDelete(pkg.id)}
                              title="Delete"
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
  )
}

export default Packages