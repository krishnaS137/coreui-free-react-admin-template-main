import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../api/supabaseClient'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CLink,
  CSpinner,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const USERS_PER_PAGE = 10

const Users = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [appliedDateFilters, setAppliedDateFilters] = useState({
    dateFrom: '',
    dateTo: '',
  })
  
  const handleViewProfile = (userId) => {
    navigate(`/users/${userId}`)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    const startIndex = (currentPage - 1) * USERS_PER_PAGE
    const endIndex = startIndex + USERS_PER_PAGE - 1
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('sr_no', { ascending: true })
      .range(startIndex, endIndex)

    if (searchTerm) {
      const searchPattern = `%${searchTerm}%`
      query = query.or(
        `first_name.ilike.${searchPattern},username.ilike.${searchPattern},email.ilike.${searchPattern}`,
      )
    }

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    if (appliedDateFilters.dateFrom) {
      query = query.gte('joining_date', appliedDateFilters.dateFrom)
    }
    if (appliedDateFilters.dateTo) {
      const inclusiveDateTo = new Date(appliedDateFilters.dateTo)
      inclusiveDateTo.setDate(inclusiveDateTo.getDate() + 1)
      query = query.lte('joining_date', inclusiveDateTo.toISOString().split('T')[0])
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users. Please try again.')
    } else {
      const formattedUsers = data.map((user) => ({
        id: user.id,
        sr_no: user.sr_no,
        firstName: user.first_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        wallet: user.wallet_coins,
        joiningDate: user.joining_date,
        imageUrl: user.image_url,
        status: user.status,
      }))
      setUsers(formattedUsers)
      setTotalUsers(count || 0)
    }

    setLoading(false)
  }, [currentPage, searchTerm, statusFilter, appliedDateFilters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Navigation to user profile is handled by the CLink component

  const applyDateFilters = () => {
    setCurrentPage(1)
    setAppliedDateFilters({ dateFrom, dateTo })
  }

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Users Management</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3 align-items-end">
                  <CCol md={4} className="mb-2">
                <CFormLabel>Search</CFormLabel>
                <CFormInput
                  type="search"
                  placeholder="Search by name, username, email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1)
                    setSearchTerm(e.target.value)
                  }}
                />
              </CCol>
              <CCol xs={12} sm={4} md={2} className="mb-2">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => {
                    setCurrentPage(1)
                    setStatusFilter(e.target.value)
                  }}
                  options={[
                    { label: 'All Statuses', value: 'all' },
                    { label: 'Unblocked', value: 'unblocked' },
                    { label: 'Blocked', value: 'blocked' },
                  ]}
                />
              </CCol>
              <CCol sm={6} md={2} className="mb-2">
                <CFormLabel>From:</CFormLabel>
                <CFormInput
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </CCol>
              <CCol sm={6} md={2} className="mb-2">
                <CFormLabel>To:</CFormLabel>
                <CFormInput
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </CCol>
              <CCol md={2} className="mb-2">
                <CButton color="primary" className="w-100" onClick={applyDateFilters}>
                  <CIcon icon={cilSearch} className="me-2" />
                  Filter Dates
                </CButton>
              </CCol>
            </CRow>
            <hr />
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div className="text-center p-5">
                  <CSpinner color="primary" />
                </div>
              ) : error ? (
                <CAlert color="danger" className="text-center">{error}</CAlert>
              ) : (
                <>
                  <CTable align="middle" className="mb-0 border" hover small>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ minWidth: '50px' }}>Sr.no</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '200px' }}>User</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '200px' }}>Contact</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '120px' }}>Birthday</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '100px' }}>Wallet</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '120px' }}>Status</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '120px' }}>Joining Date</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '100px' }}>Image</CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: '150px' }}>Wallet History</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={{ minWidth: '120px' }}>Profile</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {users && users.length > 0 ? (
                        users.map((user) => (
                          <CTableRow key={user.id}>
                            <CTableDataCell>
                              <strong>{user.sr_no}</strong>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{user.firstName}</div>
                              <div className="small text-medium-emphasis">@{user.username}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{user.email}</div>
                              <div className="small text-medium-emphasis">
                                {user.phone || 'N/A'}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="text-nowrap">{user.birthday || 'N/A'}</div>
                            </CTableDataCell>
                            <CTableDataCell>{user.wallet}</CTableDataCell>
                            <CTableDataCell>
                              <span
                                className={`badge ${
                                  user.status === 'blocked' ? 'bg-danger' : 'bg-success'
                                }`}
                              >
                                {user.status}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="text-nowrap">
                                {new Date(user.joiningDate).toLocaleDateString()}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CLink href={user.imageUrl} target="_blank" rel="noopener noreferrer">
                                View
                              </CLink>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CLink href={`/#/users/${user.id}/wallet-history`}>View</CLink>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <Link to={`/users/${user.id}`}>
                                <CButton
                                  color="primary"
                                  variant="outline"
                                  size="sm"
                                  title="View Profile"
                                >
                                  <CIcon icon={cilSearch} />
                                </CButton>
                              </Link>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan="10" className="text-center">
                            No users found.
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>

                  {totalPages > 1 && (
                    <CPagination align="center" className="mt-4">
                      <CPaginationItem
                        onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : p))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </CPaginationItem>
                      {[...Array(totalPages).keys()].map((page) => (
                        <CPaginationItem
                          key={page + 1}
                          active={currentPage === page + 1}
                          onClick={() => setCurrentPage(page + 1)}
                        >
                          {page + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem
                        onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  )}
                </>
              )}
                </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users