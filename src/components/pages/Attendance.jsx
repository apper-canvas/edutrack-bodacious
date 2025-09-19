import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import attendanceService from "@/services/api/attendanceService";
import studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const loadAttendanceData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term)
      );
    }

    setFilteredStudents(filtered);
  };

  const getAttendanceForStudent = (studentId, date) => {
    return attendance.find(record => 
      record.studentId === studentId && 
      format(new Date(record.date), "yyyy-MM-dd") === date
    );
  };

  const markAttendance = async (studentId, status) => {
    setSaving(true);
    
    try {
      const existingRecord = getAttendanceForStudent(studentId, selectedDate);
      
      if (existingRecord) {
        // Update existing record
        await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status,
          date: selectedDate
        });
        
        setAttendance(prev => prev.map(record => 
          record.Id === existingRecord.Id 
            ? { ...record, status, date: selectedDate }
            : record
        ));
      } else {
        // Create new record
        const newRecord = {
          studentId,
          date: selectedDate,
          status,
          notes: "",
          class: "General"
        };
        
        const created = await attendanceService.create(newRecord);
        setAttendance(prev => [...prev, created]);
      }
      
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error("Failed to update attendance");
      console.error("Error updating attendance:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "present": return "present";
      case "absent": return "absent";
      case "tardy": return "tardy";
      default: return "default";
    }
  };

  // Quick date selection
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-shimmer mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-shimmer"></div>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-shimmer"></div>
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
          onRetry={loadAttendanceData}
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track daily student attendance</p>
        </div>
      </div>

      {/* Date Selection and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search students by name or student ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Quick Date Selection */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">Quick Select:</span>
        {weekDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isSelected = dateStr === selectedDate;
          const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
          
          return (
            <Button
              key={dateStr}
              variant={isSelected ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedDate(dateStr)}
              className={isToday ? "ring-2 ring-primary ring-opacity-50" : ""}
            >
              {format(day, "EEE d")}
            </Button>
          );
        })}
      </div>

      {/* Attendance List */}
      <div>
        {filteredStudents.length > 0 ? (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Taking attendance for {format(new Date(selectedDate), "MMMM d, yyyy")} - {filteredStudents.length} students
            </div>
            
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900">Student Attendance</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const attendanceRecord = getAttendanceForStudent(student.Id, selectedDate);
                  const currentStatus = attendanceRecord?.status;
                  
                  return (
                    <div key={student.Id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.studentId} • Grade {student.gradeLevel}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {currentStatus && (
                            <Badge variant={getStatusVariant(currentStatus)}>
                              {currentStatus}
                            </Badge>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button
                              variant={currentStatus === "Present" ? "success" : "outline"}
                              size="sm"
                              onClick={() => markAttendance(student.Id, "Present")}
                              disabled={saving}
                            >
                              <ApperIcon name="Check" className="h-4 w-4 mr-1" />
                              Present
                            </Button>
                            
                            <Button
                              variant={currentStatus === "Absent" ? "error" : "outline"}
                              size="sm"
                              onClick={() => markAttendance(student.Id, "Absent")}
                              disabled={saving}
                            >
                              <ApperIcon name="X" className="h-4 w-4 mr-1" />
                              Absent
                            </Button>
                            
                            <Button
                              variant={currentStatus === "Tardy" ? "warning" : "outline"}
                              size="sm"
                              onClick={() => markAttendance(student.Id, "Tardy")}
                              disabled={saving}
                            >
                              <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                              Tardy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ) : students.length === 0 ? (
          <Empty 
            title="No Students Found"
            description="Add students to your system to start taking attendance."
            icon="Users"
            type="page"
          />
        ) : (
          <Empty 
            title="No Matching Students"
            description="No students match your search criteria. Try adjusting your search term."
            icon="Search"
            action={handleSearchClear}
            actionLabel="Clear Search"
            type="page"
          />
        )}
      </div>
    </div>
  );
};

export default Attendance;