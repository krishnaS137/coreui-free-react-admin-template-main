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
    coins: 100,
    price: 4.99,
    discount: 0,
    isFamous: false,
    isActive: true,
    createdAt: '2025-06-20T10:00:00Z'
  },
  {
    id: 'pkg2',
    name: 'Pro Pack',
    coins: 500,
    price: 19.99,
    discount: 10,
    isFamous: true,
    isActive: true,
    createdAt: '2025-06-21T15:30:00Z'
  },
  {
    id: 'pkg3',
    name: 'Premium Pack',
    coins: 1000,
    price: 34.99,
    discount: 15,
    isFamous: false,
    isActive: false,
    createdAt: '2025-06-22T09:15:00Z'
  }
];

const Packages = () => {
  const navigate = useNavigate()

  // State for form inputs
  const [rupees, setRupees] = useState('')
  const [coinsValue, setCoinsValue] = useState('')
  const [packages, setPackages] = useState([...mockPackages]);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    coins: '',
    price: '',
    discount: 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.name || !formData.coins || !formData.price) {
        throw new Error('Name, coins, and price are required');
      }
      
      if (formData.discount < 0 || formData.discount > 100) {
        throw new Error('Discount must be between 0 and 100');
      }

      const packageData = {
        name: formData.name,
        coins: parseInt(formData.coins),
        price: parseFloat(formData.price),
        discount: parseInt(formData.discount) || 0,
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
        coins: '',
        price: '',
        discount: 0,
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
      coins: pkg.coins,
      price: pkg.price,
      discount: pkg.discount || 0,
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
  
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    const discountAmount = (price * discount) / 100;
    return (price - discountAmount).toFixed(2);
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
                <CCol md={6}>
                  <CFormLabel htmlFor="coins">Number of Coins</CFormLabel>
                  <CFormInput
                    type="number"
                    id="coins"
                    min="1"
                    value={formData.coins}
                    onChange={(e) => setFormData({...formData, coins: e.target.value})}
                    placeholder="Enter number of coins"
                    required
                    invalid={!formData.coins && formData.coins !== ''}
                  />
                  <CFormFeedback>Number of coins is required</CFormFeedback>
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="price">Price ($)</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilDollar} />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      id="price"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      required
                      invalid={!formData.price && formData.price !== ''}
                    />
                  </CInputGroup>
                  <CFormFeedback>Price is required</CFormFeedback>
                </CCol>
                
                <CCol md={4}>
                  <CFormLabel htmlFor="discount">Discount (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    placeholder="0"
                  />
                  {formData.discount > 0 && (
                    <div className="small text-muted mt-1">
                      Final Price: ${calculateDiscountedPrice(formData.price || 0, formData.discount)}
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
                      type="switch"
                      id="isActive"
                      label="Active"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
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
                        coins: '',
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
                      <CTableHeaderCell>Coins</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Discount</CTableHeaderCell>
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
                        <CTableDataCell>{pkg.coins.toLocaleString()}</CTableDataCell>
                        <CTableDataCell>
                          <div>
                            {pkg.discount > 0 ? (
                              <>
                                <span className="text-decoration-line-through text-muted me-2">
                                  ${pkg.price.toFixed(2)}
                                </span>
                                <span className="text-danger fw-bold">
                                  ${calculateDiscountedPrice(pkg.price, pkg.discount)}
                                </span>
                              </>
                            ) : (
                              `$${pkg.price.toFixed(2)}`
                            )}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          {pkg.discount > 0 ? (
                            <CBadge color="success">{pkg.discount}% OFF</CBadge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
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