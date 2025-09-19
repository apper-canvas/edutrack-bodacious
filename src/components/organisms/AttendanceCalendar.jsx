import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import attendanceService from "@/services/api/attendanceService";

const AttendanceCalendar = ({ studentId, className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  useEffect(() => {
    loadAttendance();
  }, [studentId, currentDate]);
  
  const loadAttendance = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
const data = await attendanceService.getByStudentId(studentId);
      // Map database fields to expected format
      const mappedData = data.map(record => ({
        Id: record.Id,
        studentId: record.student_id_c?.Id || record.student_id_c,
        date: record.date_c,
        status: record.status_c,
        notes: record.notes_c,
        class: record.class_c
      }));
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getAttendanceForDate = (date) => {
return attendanceRecords.find(record => 
      isSameDay(new Date(record.date_c || record.date), date)
    );
  };
  
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "present": return "present";
      case "absent": return "absent";
      case "tardy": return "tardy";
      default: return "default";
    }
  };
  
  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Attendance - {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map(day => {
          const attendance = getAttendanceForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "relative p-2 text-center rounded-lg transition-colors duration-200",
                isCurrentMonth ? "text-gray-900" : "text-gray-400",
                attendance ? "bg-gray-50" : "hover:bg-gray-50"
              )}
            >
              <div className="text-sm font-medium">
                {format(day, "d")}
              </div>
              
              {attendance && (
                <div className="mt-1">
<Badge variant={getStatusVariant(attendance.status_c || attendance.status)} size="xs">
                    {(attendance.status_c || attendance.status).charAt(0).toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Badge variant="present" size="xs">P</Badge>
          <span className="text-sm text-gray-600">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="absent" size="xs">A</Badge>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="tardy" size="xs">T</Badge>
          <span className="text-sm text-gray-600">Tardy</span>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;