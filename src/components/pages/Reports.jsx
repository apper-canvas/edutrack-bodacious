import React, { useEffect, useState } from "react";
import { format, subDays, subMonths } from "date-fns";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Attendance from "@/components/pages/Attendance";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import attendanceService from "@/services/api/attendanceService";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";

const Reports = () => {
  const [reportData, setReportData] = useState({
    attendance: [],
    grades: [],
    students: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, attendanceData, gradesData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      setReportData({
        students: studentsData,
        attendance: attendanceData,
        grades: gradesData
      });
    } catch (err) {
      setError("Failed to load report data. Please try again.");
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate attendance trends
  const getAttendanceTrends = () => {
    const days = selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 90;
    const startDate = subDays(new Date(), days);
    
    const trends = [];
    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), days - i - 1);
      const dateStr = format(date, "yyyy-MM-dd");
      
const dayAttendance = reportData.attendance.filter(record => 
        format(new Date(record.date_c || record.date), "yyyy-MM-dd") === dateStr
      );
      
      const present = dayAttendance.filter(r => (r.status_c || r.status) === "Present").length;
      const absent = dayAttendance.filter(r => (r.status_c || r.status) === "Absent").length;
      const tardy = dayAttendance.filter(r => r.status === "Tardy").length;
      
      trends.push({
        date: format(date, "MMM d"),
        present,
        absent,
        tardy,
        total: present + absent + tardy
      });
    }
    
    return trends;
  };

  // Calculate grade distribution
  const getGradeDistribution = () => {
const grades = reportData.grades.filter(g => 
      (g.grade_c || g.grade) && (g.max_points_c || g.maxPoints)
    );
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    grades.forEach(grade => {
      const percentage = (grade.grade / grade.maxPoints) * 100;
      if (percentage >= 90) distribution.A++;
      else if (percentage >= 80) distribution.B++;
      else if (percentage >= 70) distribution.C++;
      else if (percentage >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

// Calculate statistics
  const getStatistics = () => {
    const totalStudents = reportData.students.length;
    const activeStudents = reportData.students.filter(s => 
      (s.status_c || s.status) === "Active"
    ).length;
    
    // Recent attendance (last 7 days)
    const days = selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 90;
    const startDate = subDays(new Date(), days);
    const endDate = new Date();
    
    const recentAttendance = reportData.attendance.filter(record => {
      const recordDate = new Date(record.date_c || record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
    
    // Calculate average attendance
    const averageAttendance = recentAttendance.length > 0 
      ? Math.round((recentAttendance.filter(r => (r.status_c || r.status) === "Present").length / recentAttendance.length) * 100)
      : 0;
    
    // Calculate average grade
    const validGrades = reportData.grades.filter(g => 
      (g.grade_c || g.grade) && (g.max_points_c || g.maxPoints)
    );
    const averageGrade = validGrades.length > 0 
      ? Math.round(validGrades.reduce((sum, g) => {
          const grade = g.grade_c || g.grade;
          const maxPoints = g.max_points_c || g.maxPoints;
          return sum + (grade / maxPoints * 100);
        }, 0) / validGrades.length)
      : 0;
    
    return {
      totalStudents,
      activeStudents,
      averageAttendance,
      averageGrade
    };
  };

  const attendanceTrends = getAttendanceTrends();
  const gradeDistribution = getGradeDistribution();
  const statistics = getStatistics();

  // Chart configurations
  const attendanceChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false }
    },
    colors: ["#10b981", "#ef4444", "#f59e0b"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: attendanceTrends.map(t => t.date)
    },
    yaxis: {
      title: { text: "Number of Students" }
    },
    legend: {
      position: "top"
    },
    grid: {
      borderColor: "#f3f4f6"
    }
  };

  const attendanceChartSeries = [
    {
      name: "Present",
      data: attendanceTrends.map(t => t.present)
    },
    {
      name: "Absent", 
      data: attendanceTrends.map(t => t.absent)
    },
    {
      name: "Tardy",
      data: attendanceTrends.map(t => t.tardy)
    }
  ];

  const gradeChartOptions = {
    chart: {
      type: "donut",
      height: 350
    },
    colors: ["#10b981", "#22c55e", "#f59e0b", "#f97316", "#ef4444"],
    labels: ["A", "B", "C", "D", "F"],
    legend: {
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    }
  };

  const gradeChartSeries = Object.values(gradeDistribution);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-shimmer mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-shimmer"></div>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-shimmer"></div>
        </div>
        <Loading type="cards" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded animate-shimmer"></div>
          <div className="h-96 bg-gray-200 rounded animate-shimmer"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadReportData}
          type="page"
        />
      </div>
    );
  }

  if (reportData.students.length === 0) {
    return (
      <div className="p-6">
        <Empty 
          title="No Data Available"
          description="Add students and record attendance/grades to generate reports."
          icon="BarChart3"
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Analytics and insights for your school</p>
        </div>
        
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-32"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={statistics.totalStudents}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Students"
          value={statistics.activeStudents}
          icon="UserCheck"
          color="success"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${statistics.averageAttendance}%`}
          icon="TrendingUp"
          color="info"
          trend="up"
          trendValue="3% from last period"
        />
        <StatCard
          title="Avg. Grade"
          value={`${statistics.averageGrade}%`}
          icon="Award"
          color="warning"
          trend="up"
          trendValue="2% from last period"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" className="h-4 w-4" />
            </Button>
          </div>
          
          {attendanceTrends.some(t => t.total > 0) ? (
            <Chart
              options={attendanceChartOptions}
              series={attendanceChartSeries}
              type="line"
              height={350}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="TrendingUp" className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No attendance data for selected period</p>
              </div>
            </div>
          )}
        </Card>

        {/* Grade Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" className="h-4 w-4" />
            </Button>
          </div>
          
          {reportData.grades.length > 0 ? (
            <Chart
              options={gradeChartOptions}
              series={gradeChartSeries}
              type="donut"
              height={350}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No grade data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="space-y-3">
            {attendanceTrends.slice(-7).map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">
                  {trend.date}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-success">{trend.present} Present</span>
                  <span className="text-error">{trend.absent} Absent</span>
                  <span className="text-warning">{trend.tardy} Tardy</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Grade Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Summary</h3>
          <div className="space-y-3">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    grade === "A" ? "bg-success" :
                    grade === "B" ? "bg-green-400" :
                    grade === "C" ? "bg-warning" :
                    grade === "D" ? "bg-orange-400" : "bg-error"
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">Grade {grade}</span>
                </div>
                <span className="text-sm text-gray-600">{count} students</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;