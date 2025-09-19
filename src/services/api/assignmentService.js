import { toast } from 'react-toastify';

// Mock data for assignments since assignment table is not available in database
const mockAssignments = [
  {
    Id: 1,
    Name: "Quadratic Equations Homework",
    title: "Quadratic Equations Homework",
    subject: "Mathematics",
    description: "Complete exercises 1-20 from Chapter 5 on solving quadratic equations using various methods.",
    dueDate: "2024-02-15",
    status: "Pending",
    totalPoints: 100,
    instructions: "Show all work and explain your reasoning for each problem.",
    classId: 1,
    teacherId: 1,
    createdDate: "2024-01-28"
  },
  {
    Id: 2,
    Name: "Chemical Reactions Lab Report",
    title: "Chemical Reactions Lab Report",
    subject: "Chemistry", 
    description: "Write a detailed report on the chemical reactions observed during the acid-base neutralization experiment.",
    dueDate: "2024-02-12",
    status: "Pending",
    totalPoints: 80,
    instructions: "Include hypothesis, methodology, observations, and conclusions. Minimum 5 pages.",
    classId: 2,
    teacherId: 2,
    createdDate: "2024-01-25"
  },
  {
    Id: 3,
    Name: "Shakespeare Essay",
    title: "Shakespeare Essay Analysis",
    subject: "English Literature",
    description: "Analyze the themes of power and corruption in Macbeth with specific textual evidence.",
    dueDate: "2024-02-20",
    status: "Pending", 
    totalPoints: 120,
    instructions: "5-7 pages, MLA format, minimum 5 scholarly sources required.",
    classId: 3,
    teacherId: 3,
    createdDate: "2024-01-30"
  },
  {
    Id: 4,
    Name: "World War II Timeline",
    title: "WWII Historical Timeline Project",
    subject: "History",
    description: "Create a comprehensive timeline of major World War II events from 1939-1945.",
    dueDate: "2024-02-08",
    status: "Overdue",
    totalPoints: 90,
    instructions: "Include at least 20 major events with dates, descriptions, and historical significance.",
    classId: 4,
    teacherId: 4,
    createdDate: "2024-01-20"
  },
  {
    Id: 5,
    Name: "Photosynthesis Research",
    title: "Photosynthesis Process Research",
    subject: "Biology",
    description: "Research and present the detailed process of photosynthesis in plant cells.",
    dueDate: "2024-01-30",
    status: "Completed",
    totalPoints: 75,
    instructions: "Create a visual presentation with diagrams showing light and dark reactions.",
    classId: 5,
    teacherId: 5,
    createdDate: "2024-01-15"
  },
  {
    Id: 6,
    Name: "Geometric Proofs Practice",
    title: "Triangle Congruence Proofs",
    subject: "Geometry",
    description: "Complete 15 geometric proofs demonstrating triangle congruence using SSS, SAS, and ASA methods.",
    dueDate: "2024-02-18",
    status: "Pending",
    totalPoints: 85,
    instructions: "Each proof must include given information, statements, and reasons in proper format.",
    classId: 1,
    teacherId: 1,
    createdDate: "2024-02-01"
  },
  {
    Id: 7,
    Name: "Poetry Analysis Collection",
    title: "Modern Poetry Analysis",
    subject: "English Literature",
    description: "Analyze 5 different modern poems focusing on literary devices and themes.",
    dueDate: "2024-02-14",
    status: "Pending",
    totalPoints: 95,
    instructions: "Include meter, rhyme scheme, imagery, and thematic analysis for each poem.",
    classId: 3,
    teacherId: 3,
    createdDate: "2024-01-28"
  },
  {
    Id: 8,
    Name: "Physics Motion Problems",
    title: "Kinematics Problem Set",
    subject: "Physics",
    description: "Solve 25 problems involving motion, velocity, and acceleration calculations.",
    dueDate: "2024-02-16",
    status: "Pending",
    totalPoints: 110,
    instructions: "Show all calculations, include units, and draw diagrams where applicable.",
    classId: 6,
    teacherId: 6,
    createdDate: "2024-01-29"
  },
  {
    Id: 9,
    Name: "American Revolution Essay",
    title: "Causes of American Revolution",
    subject: "History",
    description: "Write an analytical essay on the primary causes that led to the American Revolution.",
    dueDate: "2024-01-25",
    status: "Completed",
    totalPoints: 100,
    instructions: "4-6 pages, cite primary sources, focus on economic and political factors.",
    classId: 4,
    teacherId: 4,
    createdDate: "2024-01-10"
  },
  {
    Id: 10,
    Name: "Spanish Conversation Video",
    title: "Spanish Dialogue Recording",
    subject: "Spanish",
    description: "Record a 10-minute conversation in Spanish discussing daily routines and hobbies.",
    dueDate: "2024-02-22",
    status: "Pending",
    totalPoints: 70,
    instructions: "Use at least 15 different verb tenses, submit video file with transcript.",
    classId: 7,
    teacherId: 7,
    createdDate: "2024-02-02"
  }
];

// Simulate async delay for realistic API experience
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AssignmentService {
  constructor() {
    // Mock service implementation - will be replaced with ApperClient when assignment table is available
    this.assignments = [...mockAssignments];
  }

  async getAll() {
    try {
      await delay(300); // Simulate API delay
      return [...this.assignments].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(250);
      const assignment = this.assignments.find(a => a.Id === parseInt(id));
      return assignment ? { ...assignment } : null;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByClassId(classId) {
    try {
      await delay(300);
      return this.assignments
        .filter(a => a.classId === parseInt(classId))
        .map(a => ({ ...a }))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } catch (error) {
      console.error(`Error fetching assignments for class ${classId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(assignmentData) {
    try {
      await delay(400);
      const newId = Math.max(...this.assignments.map(a => a.Id), 0) + 1;
      const newAssignment = {
        Id: newId,
        Name: assignmentData.title || assignmentData.Name,
        title: assignmentData.title,
        subject: assignmentData.subject,
        description: assignmentData.description,
        dueDate: assignmentData.dueDate,
        status: assignmentData.status || "Pending",
        totalPoints: parseInt(assignmentData.totalPoints) || 100,
        instructions: assignmentData.instructions || "",
        classId: parseInt(assignmentData.classId),
        teacherId: parseInt(assignmentData.teacherId),
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      this.assignments.push(newAssignment);
      toast.success("Assignment created successfully!");
      return { ...newAssignment };
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to create assignment");
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      await delay(350);
      const index = this.assignments.findIndex(a => a.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Assignment not found");
      }

      const updatedAssignment = {
        ...this.assignments[index],
        Name: assignmentData.title || assignmentData.Name,
        title: assignmentData.title,
        subject: assignmentData.subject,
        description: assignmentData.description,
        dueDate: assignmentData.dueDate,
        status: assignmentData.status,
        totalPoints: parseInt(assignmentData.totalPoints),
        instructions: assignmentData.instructions,
        classId: parseInt(assignmentData.classId),
        teacherId: parseInt(assignmentData.teacherId)
      };

      this.assignments[index] = updatedAssignment;
      toast.success("Assignment updated successfully!");
      return { ...updatedAssignment };
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment");
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(300);
      const index = this.assignments.findIndex(a => a.Id === parseInt(id));
      if (index === -1) {
        return false;
      }

      this.assignments.splice(index, 1);
      toast.success("Assignment deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      toast.error("Failed to delete assignment");
      return false;
    }
  }

  async getOverdueAssignments() {
    try {
      await delay(250);
      const today = new Date().toISOString().split('T')[0];
      return this.assignments
        .filter(a => a.dueDate < today && a.status !== "Completed")
        .map(a => ({ ...a }));
    } catch (error) {
      console.error("Error fetching overdue assignments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateStatus(id, status) {
    try {
      await delay(200);
      const index = this.assignments.findIndex(a => a.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Assignment not found");
      }

      this.assignments[index].status = status;
      toast.success(`Assignment status updated to ${status}!`);
      return { ...this.assignments[index] };
    } catch (error) {
      console.error("Error updating assignment status:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment status");
      throw error;
    }
  }
}

export default new AssignmentService();