import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import GradeBookTable from "@/components/organisms/GradeBookTable";
import Students from "@/components/pages/Students";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import FormField from "@/components/molecules/FormField";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";

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
// Map editForm to match database field structure
      const updateData = {
        first_name_c: editForm.first_name_c,
        last_name_c: editForm.last_name_c,
        email_c: editForm.email_c,
        phone_c: editForm.phone_c,
        date_of_birth_c: editForm.date_of_birth_c,
        enrollment_date_c: editForm.enrollment_date_c,
        status_c: editForm.status_c,
        grade_level_c: editForm.grade_level_c,
        student_id_c: editForm.student_id_c
      };
      
      await studentService.update(parseInt(id), updateData);
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
{student.first_name_c || student.firstName} {student.last_name_c || student.lastName}
            </h1>
            <p className="text-gray-600">Student ID: {student.student_id_c || student.studentId}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <ApperIcon name="Edit" className="mr-2 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="success" onClick={handleSave}>
                  <ApperIcon name="Check" className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  <ApperIcon name="X" className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate("/students")}
            >
              <ApperIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
          </div>
</div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Info Card */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Student Information
                  </h2>
                  <Badge variant="primary">
                    ID: {student.Id}
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {(student.first_name_c || student.firstName)?.charAt(0)}{(student.last_name_c || student.lastName)?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {student.first_name_c || student.firstName} {student.last_name_c || student.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={getStatusVariant(student.status_c || student.status)}>
                          {student.status_c || student.status}
                        </Badge>
                        <span className="text-gray-500">
                          Grade {student.grade_level_c || student.gradeLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="First Name"
                      type="input"
                      value={isEditing ? editForm.first_name_c : (student.first_name_c || student.firstName)}
                      onChange={(e) => handleInputChange("first_name_c", e.target.value)}
                      disabled={!isEditing}
                    />
                    
                    <FormField
                      label="Last Name"
                      type="input"
                      value={isEditing ? editForm.last_name_c : (student.last_name_c || student.lastName)}
                      onChange={(e) => handleInputChange("last_name_c", e.target.value)}
                      disabled={!isEditing}
                    />
                    
                    <FormField
                      label="Email"
                      type="input"
                      inputType="email"
                      value={isEditing ? editForm.email_c : (student.email_c || student.email)}
                      onChange={(e) => handleInputChange("email_c", e.target.value)}
                      disabled={!isEditing}
                    />
                    
                    <FormField
                      label="Phone"
                      type="input"
                      value={isEditing ? editForm.phone_c : (student.phone_c || student.phone)}
                      onChange={(e) => handleInputChange("phone_c", e.target.value)}
                      disabled={!isEditing}
                    />
                    
                    <FormField
                      label="Date of Birth"
                      type="input"
                      inputType="date"
                      value={isEditing ? editForm.date_of_birth_c : (student.date_of_birth_c || student.dateOfBirth)}
                      onChange={(e) => handleInputChange("date_of_birth_c", e.target.value)}
                      disabled={!isEditing}
                    />
                    
                    <FormField
                      label="Grade Level"
                      type="select"
                      value={isEditing ? editForm.grade_level_c : (student.grade_level_c || student.gradeLevel)}
                      onChange={(e) => handleInputChange("grade_level_c", e.target.value)}
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
                      value={isEditing ? editForm.status_c : (student.status_c || student.status)}
                      onChange={(e) => handleInputChange("status_c", e.target.value)}
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
                      value={isEditing ? editForm.enrollment_date_c : (student.enrollment_date_c || student.enrollmentDate)}
                      onChange={(e) => handleInputChange("enrollment_date_c", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
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
    </div>
  );
};

export default StudentDetail;