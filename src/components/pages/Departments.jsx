import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { departmentService } from '@/services/api/departmentService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headOfDepartment: '',
    email: '',
    phone: '',
    budget: '',
    status: 'Active'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // Filter departments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(dept =>
        dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.headOfDepartment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, [departments, searchTerm]);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getAll();
      setDepartments(data || []);
      setFilteredDepartments(data || []);
    } catch (err) {
      setError('Failed to load departments');
      setDepartments([]);
      setFilteredDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    setFormLoading(true);
    try {
      await departmentService.create(formData);
      toast.success('Department created successfully');
      setShowCreateForm(false);
      resetForm();
      loadDepartments();
    } catch (error) {
      toast.error('Failed to create department');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    setFormLoading(true);
    try {
      await departmentService.update(editingDepartment.Id, formData);
      toast.success('Department updated successfully');
      setEditingDepartment(null);
      resetForm();
      loadDepartments();
    } catch (error) {
      toast.error('Failed to update department');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await departmentService.delete(departmentId);
      toast.success('Department deleted successfully');
      loadDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDepartments.length === 0) {
      toast.error('Please select departments to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedDepartments.length} department(s)?`)) {
      return;
    }

    try {
      await Promise.all(selectedDepartments.map(id => departmentService.delete(id)));
      toast.success(`${selectedDepartments.length} department(s) deleted successfully`);
      setSelectedDepartments([]);
      loadDepartments();
    } catch (error) {
      toast.error('Failed to delete selected departments');
    }
  };

  const startEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      description: department.description || '',
      headOfDepartment: department.headOfDepartment || '',
      email: department.email || '',
      phone: department.phone || '',
      budget: department.budget || '',
      status: department.status || 'Active'
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      headOfDepartment: '',
      email: '',
      phone: '',
      budget: '',
      status: 'Active'
    });
    setEditingDepartment(null);
    setShowCreateForm(false);
  };

  const handleCheckboxChange = (departmentId) => {
    setSelectedDepartments(prev =>
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDepartments.length === filteredDepartments.length) {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(filteredDepartments.map(dept => dept.Id));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadDepartments}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage your organization's departments</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Department
        </Button>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search departments..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        {selectedDepartments.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Trash2" size={16} />
            Delete Selected ({selectedDepartments.length})
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingDepartment ? 'Edit Department' : 'Create New Department'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
          
          <form onSubmit={editingDepartment ? handleEditDepartment : handleCreateDepartment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Department Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter department name"
              required
            />
            
            <Input
              label="Head of Department"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({...formData, headOfDepartment: e.target.value})}
              placeholder="Enter head of department"
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
            />
            
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Enter phone number"
            />
            
            <Input
              label="Budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              placeholder="Enter budget amount"
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
            />
            
            <div className="md:col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter department description"
                multiline
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <Button
                type="submit"
                loading={formLoading}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Save" size={16} />
                {editingDepartment ? 'Update Department' : 'Create Department'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Departments Table */}
      <Card className="overflow-hidden">
        {filteredDepartments.length === 0 ? (
          <Empty 
            message="No departments found"
            description="Create your first department to get started"
            actionLabel="Add Department"
            onAction={() => setShowCreateForm(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-hover">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDepartments.length === filteredDepartments.length && filteredDepartments.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head of Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.map((department) => (
                  <tr key={department.Id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department.Id)}
                        onChange={() => handleCheckboxChange(department.Id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {department.name}
                        </div>
                        {department.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {department.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {department.headOfDepartment || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {department.email && (
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Mail" size={14} />
                            {department.email}
                          </div>
                        )}
                        {department.phone && (
                          <div className="flex items-center gap-1 mt-1">
                            <ApperIcon name="Phone" size={14} />
                            {department.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {department.budget ? `$${parseFloat(department.budget).toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        department.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {department.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(department)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDepartment(department.Id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Departments;