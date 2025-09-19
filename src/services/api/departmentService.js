import { toast } from 'react-toastify';

// Mock data for departments - professional realistic content
const mockDepartments = [
  {
    Id: 1,
    Name: "Mathematics Department",
    name_c: "Mathematics Department",
    description_c: "Responsible for all mathematics curricula from basic arithmetic to advanced calculus, statistics, and applied mathematics.",
    head_of_department_c: "Dr. Sarah Johnson",
    established_year_c: "1985",
    budget_c: "$45000",
    number_of_teachers_c: 8
  },
  {
    Id: 2,
    Name: "Science Department", 
    name_c: "Science Department",
    description_c: "Covers biology, chemistry, physics, and environmental science programs with state-of-the-art laboratory facilities.",
    head_of_department_c: "Dr. Michael Chen",
    established_year_c: "1987",
    budget_c: "$62000",
    number_of_teachers_c: 12
  },
  {
    Id: 3,
    Name: "English Department",
    name_c: "English Department", 
    description_c: "Dedicated to literature, creative writing, grammar, and communication skills development across all grade levels.",
    head_of_department_c: "Ms. Elizabeth Taylor",
    established_year_c: "1982",
    budget_c: "$38000",
    number_of_teachers_c: 10
  },
  {
    Id: 4,
    Name: "History Department",
    name_c: "History Department",
    description_c: "Teaching world history, American history, civics, and social studies with emphasis on critical thinking and analysis.",
    head_of_department_c: "Mr. Robert Martinez",
    established_year_c: "1984",
    budget_c: "$35000",
    number_of_teachers_c: 6
  },
  {
    Id: 5,
    Name: "Physical Education Department",
    name_c: "Physical Education Department",
    description_c: "Promotes physical fitness, health education, and competitive sports programs for student wellness and athletic development.",
    head_of_department_c: "Coach Amanda Wilson",
    established_year_c: "1986",
    budget_c: "$52000",
    number_of_teachers_c: 7
  },
  {
    Id: 6,
    Name: "Arts Department",
    name_c: "Arts Department",
    description_c: "Encompasses visual arts, music, theater, and creative expression programs to foster artistic talents and cultural appreciation.",
    head_of_department_c: "Ms. Jennifer Davis",
    established_year_c: "1990",
    budget_c: "$41000",
    number_of_teachers_c: 9
  },
  {
    Id: 7,
    Name: "Computer Science Department",
    name_c: "Computer Science Department", 
    description_c: "Modern technology education including programming, web development, cybersecurity, and digital literacy skills.",
    head_of_department_c: "Mr. David Kim",
    established_year_c: "1995",
    budget_c: "$58000",
    number_of_teachers_c: 5
  },
  {
    Id: 8,
    Name: "World Languages Department",
    name_c: "World Languages Department",
    description_c: "Foreign language instruction in Spanish, French, German, and Mandarin to promote global communication and cultural understanding.",
    head_of_department_c: "Ms. Maria Rodriguez",
    established_year_c: "1992",
    budget_c: "$42000",
    number_of_teachers_c: 8
  }
];

class DepartmentService {
  constructor() {
    this.departments = [...mockDepartments];
    this.nextId = Math.max(...this.departments.map(d => d.Id)) + 1;
    
    // Ready for ApperClient integration when department table becomes available
    // const { ApperClient } = window.ApperSDK;
    // this.apperClient = new ApperClient({
    //   apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    //   apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    // });
    // this.tableName = 'department_c';
  }

  async getAll() {
    try {
      // Simulate API delay
      await this.delay(300);
      
      // Return copies to prevent direct mutations
      return [...this.departments];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await this.delay(200);
      
      const department = this.departments.find(d => d.Id === parseInt(id));
      return department ? {...department} : null;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(departmentData) {
    try {
      await this.delay(400);
      
      const newDepartment = {
        Id: this.nextId++,
        Name: departmentData.Name || departmentData.name_c,
        name_c: departmentData.name_c,
        description_c: departmentData.description_c,
        head_of_department_c: departmentData.head_of_department_c,
        established_year_c: departmentData.established_year_c,
        budget_c: departmentData.budget_c,
        number_of_teachers_c: parseInt(departmentData.number_of_teachers_c) || 0
      };
      
      this.departments.push(newDepartment);
      toast.success('Department created successfully');
      
      return {...newDepartment};
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error);
      toast.error("Failed to create department");
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      await this.delay(400);
      
      const index = this.departments.findIndex(d => d.Id === parseInt(id));
      if (index === -1) {
        throw new Error('Department not found');
      }
      
      const updatedDepartment = {
        ...this.departments[index],
        Name: departmentData.Name || departmentData.name_c,
        name_c: departmentData.name_c,
        description_c: departmentData.description_c,
        head_of_department_c: departmentData.head_of_department_c,
        established_year_c: departmentData.established_year_c,
        budget_c: departmentData.budget_c,
        number_of_teachers_c: parseInt(departmentData.number_of_teachers_c) || 0
      };
      
      this.departments[index] = updatedDepartment;
      toast.success('Department updated successfully');
      
      return {...updatedDepartment};
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error);
      toast.error("Failed to update department");
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.delay(300);
      
      const index = this.departments.findIndex(d => d.Id === parseInt(id));
      if (index === -1) {
        throw new Error('Department not found');
      }
      
      this.departments.splice(index, 1);
      toast.success('Department deleted successfully');
      
      return true;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error);
      toast.error("Failed to delete department");
      return false;
    }
  }

  // Helper method for realistic API simulation
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DepartmentService();