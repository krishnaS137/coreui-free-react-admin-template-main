import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CFormCheck,
  CBadge,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CFormFeedback,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilUser, cilTask, cilPlus, cilCheckCircle, cilTrash, cilPencil } from '@coreui/icons';

// Mock data - replace with API calls
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

const mockTasks = [
  {
    id: 1,
    title: 'Update Dashboard',
    description: 'Add new metrics to the admin dashboard',
    assignedTo: 'John Doe',
    status: 'pending',
    dueDate: '2025-07-01',
    createdAt: '2025-06-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Fix Login Issue',
    description: 'Users unable to login with social accounts',
    assignedTo: 'Jane Smith',
    status: 'in_progress',
    dueDate: '2025-06-25',
    createdAt: '2025-06-18T14:30:00Z'
  },
  {
    id: 3,
    title: 'Performance Optimization',
    description: 'Optimize database queries for better performance',
    assignedTo: 'Bob Johnson',
    status: 'completed',
    dueDate: '2025-06-22',
    completedAt: '2025-06-21T16:45:00Z',
    createdAt: '2025-06-15T09:15:00Z'
  }
];

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [tasks, setTasks] = useState([...mockTasks]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees([]);
      return;
    }
    
    const filtered = mockEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm]);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(employee.name);
    setShowEmployeeList(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newTask = {
          id: tasks.length + 1,
          title: formData.title,
          description: formData.description,
          assignedTo: selectedEmployee.name,
          status: 'pending',
          dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          priority: formData.priority
        };
        
        if (editingTask) {
          // Update existing task
          const updatedTasks = tasks.map(task => 
            task.id === editingTask.id ? { ...task, ...newTask } : task
          );
          setTasks(updatedTasks);
          setSuccess('Task updated successfully!');
        } else {
          // Add new task
          setTasks([newTask, ...tasks]);
          setSuccess('Task assigned successfully!');
        }
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          status: 'pending'
        });
        setSelectedEmployee('');
        setSearchTerm('');
        setEditingTask(null);
        
      } catch (err) {
        console.error('Error saving task:', err);
        setError('Failed to save task. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const handleStatusChange = (taskId, isChecked) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: isChecked ? 'completed' : 'pending',
          completedAt: isChecked ? new Date().toISOString() : null
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    
    // In a real app, you would make an API call here to update the task status
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending'
    });
    setSelectedEmployee({ name: task.assignedTo });
    setSearchTerm(task.assignedTo);
    
    // Scroll to form
    document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
      setSuccess('Task deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'warning', text: 'Pending' },
      in_progress: { color: 'info', text: 'In Progress' },
      completed: { color: 'success', text: 'Completed' },
      overdue: { color: 'danger', text: 'Overdue' }
    };
    
    const statusInfo = statusMap[status] || { color: 'secondary', text: status };
    return <CBadge color={statusInfo.color}>{statusInfo.text}</CBadge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      low: { color: 'info', text: 'Low' },
      medium: { color: 'primary', text: 'Medium' },
      high: { color: 'warning', text: 'High' },
      urgent: { color: 'danger', text: 'Urgent' }
    };
    
    const priorityInfo = priorityMap[priority] || { color: 'secondary', text: priority };
    return <CBadge color={priorityInfo.color}>{priorityInfo.text}</CBadge>;
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4" id="task-form">
          <CCardHeader>
            <h5>{editingTask ? 'Edit Task' : 'Assign New Task'}</h5>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger" onClose={() => setError('')} dismissible>{error}</CAlert>}
            {success && <CAlert color="success" onClose={() => setSuccess('')} dismissible>{success}</CAlert>}
            
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Assign To</CFormLabel>
                  <div className="position-relative">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Search employee..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowEmployeeList(true);
                        }}
                        onFocus={() => setShowEmployeeList(true)}
                        autoComplete="off"
                      />
                    </CInputGroup>
                    
                    {showEmployeeList && filteredEmployees.length > 0 && (
                      <div 
                        className="position-absolute w-100 bg-white border rounded-bottom shadow-sm" 
                        style={{ 
                          zIndex: 9999, 
                          maxHeight: '200px', 
                          overflowY: 'auto',
                          borderTop: 'none',
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0
                        }}
                      >
                        {filteredEmployees.map(employee => (
                          <div 
                            key={employee.id}
                            className="p-2 hover-bg-light cursor-pointer"
                            style={{ borderBottom: '1px solid #eee' }}
                            onClick={() => handleEmployeeSelect(employee)}
                          >
                            <div className="fw-semibold">{employee.name}</div>
                            <div className="small text-muted">{employee.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CCol>
                
                <CCol md={6}>
                  <CFormLabel>Due Date</CFormLabel>
                  <CFormInput
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Task Title</CFormLabel>
                  <CFormInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    required
                  />
                </CCol>
                
                <CCol md={6}>
                  <CFormLabel>Priority</CFormLabel>
                  <CFormSelect
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel>Description</CFormLabel>
                  <CFormTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task details..."
                    rows="3"
                  />
                </CCol>
              </CRow>
              
              <div className="d-flex gap-2">
                <CButton 
                  type="submit" 
                  color="primary" 
                  disabled={isSubmitting}
                >
                  <CIcon icon={editingTask ? cilPencil : cilPlus} className="me-2" />
                  {isSubmitting ? (
                    <>
                      <CSpinner component="span" size="sm" aria-hidden="true" className="me-2" />
                      {editingTask ? 'Updating...' : 'Assigning...'}
                    </>
                  ) : (
                    editingTask ? 'Update Task' : 'Assign Task'
                  )}
                </CButton>
                
                {editingTask && (
                  <CButton 
                    color="secondary" 
                    variant="outline" 
                    onClick={() => {
                      setEditingTask(null);
                      setFormData({
                        title: '',
                        description: '',
                        dueDate: '',
                        priority: 'medium',
                        status: 'pending'
                      });
                      setSelectedEmployee('');
                      setSearchTerm('');
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
        
        {/* Tasks List */}
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Task History</h5>
              <div className="d-flex gap-2">
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </CFormSelect>
                <CFormInput 
                  type="text" 
                  placeholder="Search tasks..." 
                  size="sm"
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            {tasks.length === 0 ? (
              <div className="text-center py-5">
                <CIcon icon={cilTask} size="3xl" className="text-muted mb-3" />
                <h5>No tasks found</h5>
                <p className="text-muted">Assign a new task to get started</p>
              </div>
            ) : (
              <div className="table-responsive">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '40px' }}></CTableHeaderCell>
                      <CTableHeaderCell>Task</CTableHeaderCell>
                      <CTableHeaderCell>Assigned To</CTableHeaderCell>
                      <CTableHeaderCell>Due Date</CTableHeaderCell>
                      <CTableHeaderCell>Priority</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tasks.map(task => (
                      <CTableRow key={task.id}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={task.status === 'completed'}
                            onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                            aria-label="Mark as completed"
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold">{task.title}</div>
                          <div className="small text-muted">
                            {task.description && task.description.length > 50 
                              ? `${task.description.substring(0, 50)}...` 
                              : task.description}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{task.assignedTo}</CTableDataCell>
                        <CTableDataCell>{task.dueDate || 'No due date'}</CTableDataCell>
                        <CTableDataCell>{getPriorityBadge(task.priority)}</CTableDataCell>
                        <CTableDataCell>{getStatusBadge(task.status)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton 
                              color="primary" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEdit(task)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton 
                              color="danger" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDelete(task.id)}
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
  );
};

export default Tasks;
