import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";
import GradeIndicator from "@/components/molecules/GradeIndicator";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";

const Grades = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGradesData();
  }, []);

  useEffect(() => {
    filterGrades();
  }, [grades, searchTerm, subjectFilter, periodFilter]);

  const loadGradesData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [gradesData, studentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Error loading grades:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterGrades = () => {
    let filtered = [...grades];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(grade => {
const studentId = grade.student_id_c?.Id || grade.student_id_c || grade.studentId;
        const student = students.find(s => s.Id === studentId);
        const subject = grade.subject_c || grade.subject || "";
        const assignment = grade.assignment_c || grade.assignment || "";
        const studentName = student ? `${student.first_name_c || student.firstName} ${student.last_name_c || student.lastName}` : "";
        
        return subject.toLowerCase().includes(term) ||
               assignment.toLowerCase().includes(term) ||
               studentName.toLowerCase().includes(term);
      });
    }

    if (subjectFilter !== "all") {
filtered = filtered.filter(grade => {
        const subject = grade.subject_c || grade.subject || "";
        return subject.toLowerCase() === subjectFilter.toLowerCase();
      });
    }
    
if (periodFilter !== "all") {
      filtered = filtered.filter(grade => {
        const gradingPeriod = grade.grading_period_c || grade.gradingPeriod || "";
        return gradingPeriod.toLowerCase() === periodFilter.toLowerCase();
      });
    }

    setFilteredGrades(filtered);
  };

  const getStudentName = (studentId) => {
const student = students.find(s => s.Id === studentId);
    return student ? `${student.first_name_c || student.firstName} ${student.last_name_c || student.lastName}` : "Unknown Student";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  // Get unique subjects and grading periods for filters
const subjects = [...new Set(grades.map(g => g.subject_c || g.subject).filter(Boolean))];
  const gradingPeriods = [...new Set(grades.map(g => g.grading_period_c || g.gradingPeriod).filter(Boolean))];
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
          <div className="w-40 h-10 bg-gray-200 rounded animate-shimmer"></div>
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
          onRetry={loadGradesData}
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
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">Manage student grades and assessments</p>
        </div>
        <Button onClick={() => navigate("/grades/new")}>
          <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
          Add Grade
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by student name, subject, or assignment..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />
        </div>
        
        <Select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </Select>

        <Select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Periods</option>
          {gradingPeriods.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </Select>
      </div>

      {/* Results */}
      <div>
        {filteredGrades.length > 0 ? (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredGrades.length} of {grades.length} grades
            </div>
            
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900">Grade Records</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full table-hover">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGrades.map((grade) => (
                      <tr key={grade.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
<div className="text-sm font-medium text-gray-900">
                            {getStudentName(grade.student_id_c?.Id || grade.student_id_c || grade.studentId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {grade.subject_c || grade.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {grade.assignment_c || grade.assignment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <GradeIndicator 
                            grade={grade.grade_c || grade.grade} 
                            maxPoints={grade.max_points_c || grade.maxPoints} 
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {grade.grading_period_c || grade.gradingPeriod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(grade.date_recorded_c || grade.dateRecorded).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
onClick={() => navigate(`/students/${grade.student_id_c?.Id || grade.student_id_c || grade.studentId}`)}
                          >
                            <ApperIcon name="Eye" className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : grades.length === 0 ? (
          <Empty 
            title="No Grades Found"
            description="Start tracking student progress by adding your first grade entry."
            icon="GraduationCap"
            action={() => navigate("/grades/new")}
            actionLabel="Add First Grade"
            type="page"
          />
        ) : (
          <Empty 
            title="No Matching Grades"
            description="No grades match your current search criteria. Try adjusting your filters."
            icon="Search"
            action={() => {
              setSearchTerm("");
              setSubjectFilter("all");
              setPeriodFilter("all");
            }}
            actionLabel="Clear Filters"
            type="page"
          />
        )}
      </div>
    </div>
  );
};

export default Grades;