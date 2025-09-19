import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

// Utility function to format dates for API
const formatDateForAPI = (dateValue) => {
  if (!dateValue) return null;
  
  // If already in ISO format, return as is
  if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateValue;
  }
  
  // Convert to ISO date format (YYYY-MM-DD)
  try {
    return new Date(dateValue).toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

class AssignmentService {
  constructor() {
    // Initialize ApperClient for database operations
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignments_c';
    
    // Define updateable fields based on assignments_c table schema
    this.updateableFields = ['Name', 'Tags', 'title_c', 'description_c', 'due_date_c', 'status_c', 'priority_c'];
  }

  // Filter data to include only updateable fields
  filterUpdateableFields(data) {
    const filtered = {};
    this.updateableFields.forEach(field => {
      if (data[field] !== undefined) {
        filtered[field] = data[field];
      }
    });
    return filtered;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching assignments:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      toast.error("Failed to load assignments");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching assignment ${id}:`, response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByClassId(classId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}}
        ],
        where: [{"FieldName": "class_id_c", "Operator": "EqualTo", "Values": [parseInt(classId)]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching assignments for class ${classId}:`, response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching assignments for class ${classId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

async create(assignmentData) {
    try {
      // Map input data to database field names and filter updateable fields
      const mappedData = {
        Name: assignmentData.Name || assignmentData.title,
        title_c: assignmentData.title || assignmentData.title_c,
        description_c: assignmentData.description || assignmentData.description_c,
        due_date_c: formatDateForAPI(assignmentData.dueDate || assignmentData.due_date_c),
        status_c: assignmentData.status || assignmentData.status_c || "Not Started",
        priority_c: assignmentData.priority || assignmentData.priority_c || "Medium",
        Tags: assignmentData.Tags || ""
      };

      const filteredData = this.filterUpdateableFields(mappedData);

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating assignment:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
        if (successful.length > 0) {
          toast.success("Assignment created successfully!");
          return successful[0].data;
        }
      }

      throw new Error("No assignment created");
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to create assignment");
      throw error;
    }
  }

async update(id, assignmentData) {
    try {
      // Map input data to database field names and filter updateable fields
      const mappedData = {
        Id: parseInt(id),
        Name: assignmentData.Name || assignmentData.title,
        title_c: assignmentData.title || assignmentData.title_c,
        description_c: assignmentData.description || assignmentData.description_c,
        due_date_c: formatDateForAPI(assignmentData.dueDate || assignmentData.due_date_c),
        status_c: assignmentData.status || assignmentData.status_c,
        priority_c: assignmentData.priority || assignmentData.priority_c,
        Tags: assignmentData.Tags || ""
      };

      const filteredData = this.filterUpdateableFields(mappedData);
      filteredData.Id = parseInt(id); // Always include ID for updates

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating assignment:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, JSON.stringify(failed));
failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Assignment updated successfully!");
          return successful[0].data;
        }
      }

      throw new Error("Assignment not updated");
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment");
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
        console.error("Error deleting assignment:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Assignment deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      toast.error("Failed to delete assignment");
      return false;
    }
  }

  async getOverdueAssignments() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}}
        ],
        where: [
          {"FieldName": "due_date_c", "Operator": "LessThan", "Values": [today]},
          {"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["Completed"]}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching overdue assignments:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue assignments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating assignment status:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0]?.success) {
        toast.success(`Assignment status updated to ${status}!`);
        return response.results[0].data;
      }

      throw new Error("Status not updated");
    } catch (error) {
      console.error("Error updating assignment status:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment status");
      throw error;
    }
  }
}

export default new AssignmentService();