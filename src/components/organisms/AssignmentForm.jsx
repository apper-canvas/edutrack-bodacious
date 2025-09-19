import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import assignmentService from "@/services/api/assignmentService";

const AssignmentForm = ({ assignment, onSuccess, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title_c: assignment?.title_c || "",
    description_c: assignment?.description_c || "",
    due_date_c: assignment?.due_date_c || "",
    status_c: assignment?.status_c || "Not Started",
    priority_c: assignment?.priority_c || "Medium",
    Tags: assignment?.Tags || ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title_c?.trim()) {
      newErrors.title_c = "Title is required";
    }

    if (!formData.description_c?.trim()) {
      newErrors.description_c = "Description is required";
    }

    if (!formData.due_date_c) {
      newErrors.due_date_c = "Due date is required";
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.due_date_c < today) {
        newErrors.due_date_c = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing) {
        await assignmentService.update(assignment.Id, formData);
        toast.success("Assignment updated successfully");
      } else {
        await assignmentService.create(formData);
        toast.success("Assignment created successfully");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error(isEditing ? "Failed to update assignment" : "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <FormField
            label="Title"
            name="title_c"
            value={formData.title_c}
            onChange={handleInputChange}
            error={errors.title_c}
            required
            placeholder="Enter assignment title"
          />
        </div>

        <div className="lg:col-span-2">
          <FormField
            label="Description"
            name="description_c"
            type="textarea"
            value={formData.description_c}
            onChange={handleInputChange}
            error={errors.description_c}
            required
            placeholder="Enter assignment description"
            rows={4}
          />
        </div>

        <FormField
          label="Due Date"
          name="due_date_c"
          type="input"
          inputType="date"
          value={formData.due_date_c}
          onChange={handleInputChange}
          error={errors.due_date_c}
          required
        />

        <FormField
          label="Tags"
          name="Tags"
          value={formData.Tags}
          onChange={handleInputChange}
          error={errors.Tags}
          placeholder="Enter tags (comma separated)"
          helperText="Add tags to categorize this assignment (e.g., Math, Science, Homework)"
        />

        <FormField
          label="Status"
          name="status_c"
          type="select"
          value={formData.status_c}
          onChange={handleInputChange}
          error={errors.status_c}
          required
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </FormField>

        <FormField
          label="Priority"
          name="priority_c"
          type="select"
          value={formData.priority_c}
          onChange={handleInputChange}
          error={errors.priority_c}
          required
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </FormField>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
        >
          {isEditing ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;