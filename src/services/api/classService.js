import { toast } from 'react-toastify';

class ClassService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'class_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "teacher_c"}},
          {"field": {"Name": "schedule_time_c"}},
          {"field": {"Name": "schedule_days_c"}},
          {"field": {"Name": "schedule_room_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "students_c"}}
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
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "teacher_c"}},
          {"field": {"Name": "schedule_time_c"}},
          {"field": {"Name": "schedule_days_c"}},
          {"field": {"Name": "schedule_room_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "students_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(classData) {
    try {
      const params = {
        records: [{
          Name: classData.Name || classData.name_c,
          name_c: classData.name_c,
          subject_c: classData.subject_c,
          teacher_c: classData.teacher_c,
          schedule_time_c: classData.schedule_time_c,
          schedule_days_c: classData.schedule_days_c,
          schedule_room_c: classData.schedule_room_c,
          grade_level_c: classData.grade_level_c,
          students_c: classData.students_c
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
          console.error(`Failed to create ${failed.length} class records:${JSON.stringify(failed)}`);
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
      console.error("Error creating class:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, classData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: classData.Name || classData.name_c,
          name_c: classData.name_c,
          subject_c: classData.subject_c,
          teacher_c: classData.teacher_c,
          schedule_time_c: classData.schedule_time_c,
          schedule_days_c: classData.schedule_days_c,
          schedule_room_c: classData.schedule_room_c,
          grade_level_c: classData.grade_level_c,
          students_c: classData.students_c
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
          console.error(`Failed to update ${failed.length} class records:${JSON.stringify(failed)}`);
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
      console.error("Error updating class:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} class records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new ClassService();