import studentsData from "@/services/mockData/students.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.students];
  }

  async getById(id) {
    await delay(250);
    return this.students.find(student => student.Id === id) || null;
  }

  async create(studentData) {
    await delay(400);
    const maxId = Math.max(...this.students.map(s => s.Id), 0);
    const newStudent = {
      Id: maxId + 1,
      ...studentData
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await delay(350);
    const index = this.students.findIndex(student => student.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...studentData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.students.findIndex(student => student.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students.splice(index, 1);
    return true;
  }
}

export default new StudentService();