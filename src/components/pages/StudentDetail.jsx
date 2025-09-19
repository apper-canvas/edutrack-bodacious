import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import GradeBookTable from "@/components/organisms/GradeBookTable";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = [
    { id: "info", label: "Student Info", icon: "User" },
    { id: "grades", label: "Grades", icon: "GraduationCap" },
    { id: "attendance", label: "Attendance", icon: "Calendar" }
  ];

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentData, gradesData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getByStudentId(parseInt(id))
      ]);

      if (!studentData) {
        setError("Student not found");
        return;
      }

      setStudent(studentData);
      setGrades(gradesData);
      setEditForm(studentData);
    } catch (err) {
      setError("Failed to load student data. Please try again.");
      console.error("Error loading student:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await studentService.update(parseInt(id), editForm);
      setStudent(editForm);
      setIsEditing(false);
      toast.success("Student information updated successfully!");
    } catch (err) {
      toast.error("Failed to update student information");
      console.error("Error updating student:", err);
    }
  };

  const handleCancel = () => {
    setEditForm(student);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-6 animate-shimmer mr-4"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-shimmer"></div>
        </div>
        <Loading type="detail" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/students")}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
        </div>
        <Error 
          message={error || "Student not found"} 
          onRetry={loadStudentData}
          type="page"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/students")}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600">Student ID: {student.studentId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <ApperIcon name="Edit3" className="h-4 w-4 mr-2" />
              Edit Student
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <Card className="p-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={getStatusVariant(student.status)}>
                  {student.status}
                </Badge>
                <span className="text-gray-500">
                  Grade {student.gradeLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              type="input"
              value={isEditing ? editForm.firstName : student.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
            />
            
            <FormField
              label="Last Name"
              type="input"
              value={isEditing ? editForm.lastName : student.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
            />
            
            <FormField
              label="Email"
              type="input"
              inputType="email"
              value={isEditing ? editForm.email : student.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
            />
            
            <FormField
              label="Phone"
              type="input"
              value={isEditing ? editForm.phone : student.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
            />
            
            <FormField
              label="Date of Birth"
              type="input"
              inputType="date"
              value={isEditing ? editForm.dateOfBirth : student.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              disabled={!isEditing}
            />
            
            <FormField
              label="Grade Level"
              type="select"
              value={isEditing ? editForm.gradeLevel : student.gradeLevel}
              onChange={(e) => handleInputChange("gradeLevel", e.target.value)}
              disabled={!isEditing}
            >
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </FormField>
            
            <FormField
              label="Status"
              type="select"
              value={isEditing ? editForm.status : student.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              disabled={!isEditing}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </FormField>
            
            <FormField
              label="Enrollment Date"
              type="input"
              inputType="date"
              value={isEditing ? editForm.enrollmentDate : student.enrollmentDate}
              onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </Card>
      )}

      {activeTab === "grades" && (
        grades.length > 0 ? (
          <GradeBookTable grades={grades} />
        ) : (
          <Empty 
            title="No Grades Recorded"
            description="No grades have been recorded for this student yet."
            icon="GraduationCap"
            action={() => navigate("/grades")}
            actionLabel="Add Grades"
            type="page"
          />
        )
      )}

      {activeTab === "attendance" && (
        <AttendanceCalendar studentId={parseInt(id)} />
      )}
    </div>
  );
};

export default StudentDetail;