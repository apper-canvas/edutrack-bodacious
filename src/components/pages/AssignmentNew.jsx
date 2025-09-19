import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import AssignmentForm from "@/components/organisms/AssignmentForm";

const AssignmentNew = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/assignments");
  };

  const handleSuccess = () => {
    navigate("/assignments");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
            <span>Back to Assignments</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
            <p className="text-gray-600 mt-1">Add a new assignment for your students</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <AssignmentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Card>
    </div>
  );
};

export default AssignmentNew;