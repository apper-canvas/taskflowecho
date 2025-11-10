import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import DatePicker from "@/components/molecules/DatePicker";
import { cn } from "@/utils/cn";

const TaskForm = ({ 
  task = null, 
  lists = [], 
  onSubmit, 
  onCancel,
  isOpen = false
}) => {
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listsData, setListsData] = useState([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    listId: ""
  })
// Load lists for dropdown
  useEffect(() => {
    const loadLists = async () => {
      try {
        const { listService } = await import("@/services/api/listService")
        const allLists = await listService.getAll()
        setListsData(allLists)
      } catch (error) {
        console.error("Error loading lists:", error)
      }
    }
    
    loadLists()
  }, [])
  
  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title_c || task.title || "",
        description: task.description_c || task.description || "",
        priority: task.priority_c || task.priority || "medium",
        dueDate: task.due_date_c || task.dueDate || "",
        listId: task.list_id_c?.Id || task.list_id_c || task.listId || ""
      })
} else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        listId: ""
      })
    }
    setErrors({})
  }, [task, isOpen])
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
try {
      const taskData = {
        title_c: formData.title.trim(),
        description_c: formData.description.trim(),
        priority_c: formData.priority,
        due_date_c: formData.dueDate || null,
        list_id_c: formData.listId ? parseInt(formData.listId) : null
      }
      
      await onSubmit(taskData)
      
      if (!task) {
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          listId: ""
        })
      }
    } catch (error) {
      console.error("Error submitting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-150"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter task title..."
            error={errors.title}
            autoFocus
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Add task description (optional)..."
            rows={3}
          />
          
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="List"
              value={formData.listId}
              onChange={(e) => handleInputChange("listId", e.target.value)}
            >
              <option value="">Select a list</option>
              {listsData.map((list) => (
                <option key={list.Id} value={list.Id}>
                  {list.name_c}
                </option>
              ))}
            </Select>
            
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(value) => handleInputChange("dueDate", value)}
            />
          </div>
          
          <PrioritySelector
            label="Priority Level"
            value={formData.priority}
            onChange={(value) => handleInputChange("priority", value)}
          />
          
          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
              icon="Save"
            >
              {task ? "Update Task" : "Create Task"}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TaskForm