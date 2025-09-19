import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import classService from "@/services/api/classService";

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm]);

  const loadClasses = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (err) {
      setError("Failed to load classes. Please try again.");
      console.error("Error loading classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(classItem => 
        classItem.name.toLowerCase().includes(term) ||
        classItem.subject.toLowerCase().includes(term) ||
        classItem.teacher.toLowerCase().includes(term)
      );
    }

    setFilteredClasses(filtered);
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
        <div className="h-10 bg-gray-200 rounded animate-shimmer mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-shimmer"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full animate-shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadClasses}
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
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage your class schedules and rosters</p>
        </div>
        <Button onClick={() => navigate("/classes/new")}>
          <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search classes by name, subject, or teacher..."
        value={searchTerm}
        onChange={handleSearchChange}
        onClear={handleSearchClear}
      />

      {/* Classes Grid */}
      <div>
        {filteredClasses.length > 0 ? (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredClasses.length} of {classes.length} classes
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <Card key={classItem.Id} hover className="p-6 cursor-pointer" onClick={() => navigate(`/classes/${classItem.Id}`)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="info" size="sm">
                      {classItem.gradeLevel}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {classItem.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    {classItem.subject}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ApperIcon name="User" className="h-4 w-4 mr-2" />
                      {classItem.teacher}
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                      {classItem.students?.length || 0} students
                    </div>
                    {classItem.schedule?.time && (
                      <div className="flex items-center">
                        <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                        {classItem.schedule.time}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : classes.length === 0 ? (
          <Empty 
            title="No Classes Found"
            description="Start organizing your curriculum by adding your first class."
            icon="BookOpen"
            action={() => navigate("/classes/new")}
            actionLabel="Add First Class"
            type="page"
          />
        ) : (
          <Empty 
            title="No Matching Classes"
            description="No classes match your current search criteria. Try adjusting your search term."
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

export default Classes;