import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import StudentTable from "@/components/organisms/StudentTable";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import gradeService from "@/services/api/gradeService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    averageGrade: 0,
    pendingGrades: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, attendanceData, gradesData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      setStudents(studentsData.slice(0, 10));

      // Calculate stats
      const totalStudents = studentsData.length;
      const today = new Date().toDateString();
      const todayAttendance = attendanceData.filter(record => 
        new Date(record.date).toDateString() === today
      );
      const presentToday = todayAttendance.filter(record => 
        record.status.toLowerCase() === "present"
      ).length;

      const validGrades = gradesData.filter(g => g.grade && g.maxPoints);
      const averageGrade = validGrades.length > 0 
        ? Math.round(validGrades.reduce((sum, g) => sum + (g.grade / g.maxPoints * 100), 0) / validGrades.length)
        : 0;

      const recentGrades = gradesData
        .sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded))
        .slice(0, 5);

      setStats({
        totalStudents,
        presentToday,
        averageGrade,
        pendingGrades: Math.floor(totalStudents * 0.15)
      });

      setRecentActivity(recentGrades);

    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-shimmer mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-shimmer"></div>
        </div>
        <Loading type="cards" />
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadDashboardData}
          type="page"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your school today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon="UserCheck"
          color="success"
          trend="up"
          trendValue="5% from yesterday"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="TrendingUp"
          color="info"
          trend="up"
          trendValue="2% from last week"
        />
        <StatCard
          title="Pending Grades"
          value={stats.pendingGrades}
          icon="Clock"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <div className="lg:col-span-2">
          {students.length > 0 ? (
            <StudentTable students={students} />
          ) : (
            <Empty 
              title="No Students Found"
              description="Start by adding students to your school system."
              icon="Users"
              action={() => navigate("/students")}
              actionLabel="Add Student"
            />
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/grades")}>
                <ApperIcon name="ExternalLink" className="h-4 w-4" />
              </Button>
            </div>

            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.subject} - {activity.assignment}
                      </p>
                      <p className="text-xs text-gray-500">
                        Grade: {activity.grade}/{activity.maxPoints}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(activity.dateRecorded).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty 
                title="No Recent Activity"
                description="Recent grades and updates will appear here."
                icon="Activity"
                type="inline"
              />
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/students")}
              >
                <ApperIcon name="UserPlus" className="mr-3 h-4 w-4" />
                Add New Student
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/attendance")}
              >
                <ApperIcon name="Calendar" className="mr-3 h-4 w-4" />
                Take Attendance
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/grades")}
              >
                <ApperIcon name="GraduationCap" className="mr-3 h-4 w-4" />
                Enter Grades
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/reports")}
              >
                <ApperIcon name="BarChart3" className="mr-3 h-4 w-4" />
                View Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;