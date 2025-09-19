import classesData from "@/services/mockData/classes.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  async getAll() {
    await delay(300);
    return [...this.classes];
  }

  async getById(id) {
    await delay(250);
    return this.classes.find(classItem => classItem.Id === id) || null;
  }

  async create(classData) {
    await delay(400);
    const maxId = Math.max(...this.classes.map(c => c.Id), 0);
    const newClass = {
      Id: maxId + 1,
      ...classData
    };
    this.classes.push(newClass);
    return { ...newClass };
  }

  async update(id, classData) {
    await delay(350);
    const index = this.classes.findIndex(classItem => classItem.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    this.classes[index] = { ...this.classes[index], ...classData };
    return { ...this.classes[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.classes.findIndex(classItem => classItem.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    this.classes.splice(index, 1);
    return true;
  }
}

export default new ClassService();