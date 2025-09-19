import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StudentTable from "@/components/organisms/StudentTable";
import Grades from "@/components/pages/Grades";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";
import studentService from "@/services/api/studentService";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, gradeFilter, statusFilter]);

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Search filter
if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => {
        const firstName = student.first_name_c || student.firstName || "";
        const lastName = student.last_name_c || student.lastName || "";
        const email = student.email_c || student.email || "";
        const studentId = student.student_id_c || student.studentId || "";
        
        return firstName.toLowerCase().includes(term) ||
               lastName.toLowerCase().includes(term) ||
               email.toLowerCase().includes(term) ||
               studentId.toLowerCase().includes(term);
      });
    }
    // Grade level filter
    if (gradeFilter !== "all") {
filtered = filtered.filter(student => {
        const gradeLevel = student.grade_level_c || student.gradeLevel || "";
        return gradeLevel.toLowerCase() === gradeFilter.toLowerCase();
      });
    }

    // Status filter
    if (statusFilter !== "all") {
filtered = filtered.filter(student => {
        const status = student.status_c || student.status || "";
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    setFilteredStudents(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-shimmer mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-shimmer"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-shimmer"></div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-shimmer"></div>
          <div className="w-40 h-10 bg-gray-200 rounded animate-shimmer"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-shimmer"></div>
        </div>
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadStudents}
          type="page"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student database</p>
        </div>
        <Button onClick={() => navigate("/students/new")}>
          <ApperIcon name="UserPlus" className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search students by name, email, or student ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />
        </div>
        
        <Select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Grades</option>
          <option value="9th">9th Grade</option>
          <option value="10th">10th Grade</option>
          <option value="11th">11th Grade</option>
          <option value="12th">12th Grade</option>
        </Select>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-32"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </Select>
      </div>

      {/* Results */}
      <div>
        {filteredStudents.length > 0 ? (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} students
            </div>
            <StudentTable students={filteredStudents} />
          </div>
        ) : students.length === 0 ? (
          <Empty 
            title="No Students Found"
            description="Start building your student database by adding your first student."
            icon="Users"
            action={() => navigate("/students/new")}
            actionLabel="Add First Student"
            type="page"
          />
        ) : (
          <Empty 
            title="No Matching Students"
            description="No students match your current search criteria. Try adjusting your filters."
            icon="Search"
            action={() => {
              setSearchTerm("");
              setGradeFilter("all");
              setStatusFilter("all");
            }}
            actionLabel="Clear Filters"
            type="page"
          />
        )}
      </div>
    </div>
  );
};

export default Students;