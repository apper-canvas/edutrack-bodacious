import { toast } from 'react-toastify';

class StudentService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}}
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
      console.error("Error fetching students:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          status_c: studentData.status_c,
          grade_level_c: studentData.grade_level_c,
          student_id_c: studentData.student_id_c,
          address_street_c: studentData.address_street_c,
          address_city_c: studentData.address_city_c,
          address_state_c: studentData.address_state_c,
          address_zip_code_c: studentData.address_zip_code_c,
          emergency_contact_name_c: studentData.emergency_contact_name_c,
          emergency_contact_relationship_c: studentData.emergency_contact_relationship_c,
          emergency_contact_phone_c: studentData.emergency_contact_phone_c
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
          console.error(`Failed to create ${failed.length} student records:${JSON.stringify(failed)}`);
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
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          status_c: studentData.status_c,
          grade_level_c: studentData.grade_level_c,
          student_id_c: studentData.student_id_c,
          address_street_c: studentData.address_street_c,
          address_city_c: studentData.address_city_c,
          address_state_c: studentData.address_state_c,
          address_zip_code_c: studentData.address_zip_code_c,
          emergency_contact_name_c: studentData.emergency_contact_name_c,
          emergency_contact_relationship_c: studentData.emergency_contact_relationship_c,
          emergency_contact_phone_c: studentData.emergency_contact_phone_c
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
          console.error(`Failed to update ${failed.length} student records:${JSON.stringify(failed)}`);
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
      console.error("Error updating student:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} student records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new StudentService();