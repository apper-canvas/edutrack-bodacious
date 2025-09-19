const { ApperClient } = window.ApperSDK;

class DepartmentService {
  constructor() {
    this.tableName = 'department_c';
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Head_of_Department_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "Budget_c"}},
          {"field": {"Name": "Status_c"}}
        ],
        orderBy: [{"fieldName": "name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch departments: ${response.message}`);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching departments:', error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Head_of_Department_c"}},
          {"field": {"Name": "Email_c"}},
          {"field": {"Name": "Phone_c"}},
          {"field": {"Name": "Budget_c"}},
          {"field": {"Name": "Status_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error('Department not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  async create(departmentData) {
    try {
      // Only include updateable fields
      const payload = {
        records: [{
Name_c: departmentData.name,
          Description_c: departmentData.description || '',
          Head_of_Department_c: departmentData.headOfDepartment || '',
          Email_c: departmentData.email || '',
          Phone_c: departmentData.phone || '',
          Budget_c: departmentData.budget ? parseFloat(departmentData.budget) : null,
          Status_c: departmentData.status || 'Active'
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error(`Failed to create department: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create department: ${JSON.stringify(failed)}`);
          const errorMessage = failed[0].message || 'Failed to create department';
          throw new Error(errorMessage);
        }
        
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error('Error creating department:', error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      // Only include updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
Name_c: departmentData.name,
          Description_c: departmentData.description || '',
          Head_of_Department_c: departmentData.headOfDepartment || '',
          Email_c: departmentData.email || '',
          Phone_c: departmentData.phone || '',
          Budget_c: departmentData.budget ? parseFloat(departmentData.budget) : null,
          Status_c: departmentData.status || 'Active'
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error(`Failed to update department: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update department: ${JSON.stringify(failed)}`);
          const errorMessage = failed[0].message || 'Failed to update department';
          throw new Error(errorMessage);
        }
        
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error?.response?.data?.message || error.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete department: ${response.message}`);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete department: ${JSON.stringify(failed)}`);
          const errorMessage = failed[0].message || 'Failed to delete department';
          throw new Error(errorMessage);
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error?.response?.data?.message || error.message || error);
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();