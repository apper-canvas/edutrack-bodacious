import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";
import assignmentService from "@/services/api/assignmentService";

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, statusFilter, subjectFilter]);

  const loadAssignments = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = [...assignments];

    // Search filter
if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(assignment => {
        const title = assignment.title_c || assignment.Name || "";
        const tags = assignment.Tags || "";
        const description = assignment.description_c || "";
        return title.toLowerCase().includes(term) ||
               tags.toLowerCase().includes(term) ||
               description.toLowerCase().includes(term);
      });
    }

    // Status filter
    if (statusFilter !== "all") {
filtered = filtered.filter(assignment => 
        (assignment.status_c || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Subject filter - using Tags field since assignments_c doesn't have subject field
    if (subjectFilter !== "all") {
      filtered = filtered.filter(assignment => 
        (assignment.Tags || "").toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

const isOverdue = (dueDate, status) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today && (status || "").toLowerCase() !== 'completed';
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  };

// Get unique subjects and statuses for filters
  const subjects = [...new Set(assignments.map(a => a.Tags).filter(Boolean))];
  const statuses = [...new Set(assignments.map(a => a.status_c).filter(Boolean))];

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
          onRetry={loadAssignments}
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
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Manage student assignments and track progress</p>
        </div>
        <Button onClick={() => navigate("/assignments/new")}>
          <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search assignments by title, subject, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />
        </div>
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </Select>

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
      </div>

      {/* Results */}
      <div>
        {filteredAssignments.length > 0 ? (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
<Card 
                  key={assignment.Id} 
                  hover 
                  className="p-6 cursor-pointer" 
                  onClick={() => navigate(`/assignments/${assignment.Id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="FileText" className="h-8 w-8 text-primary" />
                      <Badge 
                        variant={getStatusBadgeVariant(assignment.status_c)} 
                        size="sm"
                      >
                        {assignment.status_c || 'Not Started'}
                      </Badge>
                    </div>
                    {assignment.priority_c && (
                      <div className="text-sm font-medium text-gray-500">
                        {assignment.priority_c} Priority
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {assignment.title_c || assignment.Name}
                  </h3>
                  
                  <p className="text-primary font-medium mb-2">
                    {assignment.Tags}
                  </p>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {assignment.description_c}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center ${isOverdue(assignment.due_date_c, assignment.status_c) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                      {formatDueDate(assignment.due_date_c)}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                      Created {assignment.CreatedOn ? new Date(assignment.CreatedOn).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : assignments.length === 0 ? (
          <Empty 
            title="No Assignments Found"
            description="Start managing student work by creating your first assignment."
            icon="FileText"
            action={() => navigate("/assignments/new")}
            actionLabel="Create First Assignment"
            type="page"
          />
        ) : (
          <Empty 
            title="No Matching Assignments"
            description="No assignments match your current search criteria. Try adjusting your filters."
            icon="Search"
            action={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setSubjectFilter("all");
            }}
            actionLabel="Clear Filters"
            type="page"
          />
        )}
      </div>
    </div>
  );
};

export default Assignments;