import { toast } from 'react-toastify';

class GradeService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "assignment_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "date_recorded_c"}},
          {"field": {"Name": "grading_period_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "assignment_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "date_recorded_c"}},
          {"field": {"Name": "grading_period_c"}},
          {"field": {"Name": "student_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "assignment_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "date_recorded_c"}},
          {"field": {"Name": "grading_period_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        where: [
          {"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}
        ],
        orderBy: [{"fieldName": "date_recorded_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching grades for student ${studentId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: gradeData.Name || `${gradeData.subject_c} - ${gradeData.assignment_c}`,
          subject_c: gradeData.subject_c,
          assignment_c: gradeData.assignment_c,
          grade_c: gradeData.grade_c,
          max_points_c: gradeData.max_points_c,
          date_recorded_c: gradeData.date_recorded_c,
          grading_period_c: gradeData.grading_period_c,
          student_id_c: parseInt(gradeData.student_id_c)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grade records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: gradeData.Name || `${gradeData.subject_c} - ${gradeData.assignment_c}`,
          subject_c: gradeData.subject_c,
          assignment_c: gradeData.assignment_c,
          grade_c: gradeData.grade_c,
          max_points_c: gradeData.max_points_c,
          date_recorded_c: gradeData.date_recorded_c,
          grading_period_c: gradeData.grading_period_c,
          student_id_c: parseInt(gradeData.student_id_c)
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grade records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grade records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new GradeService();