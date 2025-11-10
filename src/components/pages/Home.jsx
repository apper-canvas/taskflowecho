import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import TaskForm from "@/components/organisms/TaskForm";
import TaskCard from "@/components/molecules/TaskCard";
import FilterTabs from "@/components/molecules/FilterTabs";
import SearchBar from "@/components/molecules/SearchBar";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { getPriorityOrder } from "@/utils/priorityHelpers";
import { cn } from "@/utils/cn";

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  
  const loadTasks = async () => {
    try {
      setError("")
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadTasks()
  }, [])
  
  // Filter and search tasks
  useEffect(() => {
    let filtered = [...tasks]
    
// Apply status filter
    switch (activeFilter) {
      case "active":
        filtered = filtered.filter(task => !task.completed_c)
        break
      case "completed":
        filtered = filtered.filter(task => task.completed_c)
        break
      default:
        break
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title_c?.toLowerCase().includes(query) ||
        task.description_c?.toLowerCase().includes(query)
      )
    }
    
    // Sort by priority and creation date
    filtered.sort((a, b) => {
      if (a.completed_c !== b.completed_c) {
        return a.completed_c - b.completed_c
      }
      
      const priorityA = getPriorityOrder(a.priority_c)
      const priorityB = getPriorityOrder(b.priority_c)
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      
      return new Date(b.CreatedOn) - new Date(a.CreatedOn)
    })
    
    setFilteredTasks(filtered)
  }, [tasks, searchQuery, activeFilter])
  
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setTaskFormOpen(false)
      toast.success("Task created successfully!")
    } catch (err) {
      toast.error("Failed to create task")
      console.error("Error creating task:", err)
    }
  }
  
  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }
  
  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData)
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ))
      setTaskFormOpen(false)
      setEditingTask(null)
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error updating task:", err)
    }
  }
  
  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      
      if (updatedTask.completed) {
        toast.success("🎉 Task completed!")
      } else {
        toast.info("Task marked as incomplete")
      }
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error toggling task:", err)
    }
  }
  
  const handleDeleteTask = async () => {
    if (!confirmDelete) return
    
    try {
      await taskService.delete(confirmDelete)
      setTasks(prev => prev.filter(task => task.Id !== confirmDelete))
      setConfirmDelete(null)
      toast.success("Task deleted successfully")
    } catch (err) {
      toast.error("Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }
  
  const handleCloseForm = () => {
    setTaskFormOpen(false)
    setEditingTask(null)
  }
  
  const filterTabs = [
    { 
      label: "All", 
      value: "all", 
      count: tasks.length 
    },
    { 
      label: "Active", 
value: "active", 
      count: tasks.filter(t => !t.completed_c).length 
    },
    { 
      label: "Completed", 
      value: "completed", 
      count: tasks.filter(t => t.completed_c).length
    }
  ]
  
  if (loading) return <Loading />
  
  if (error) {
    return <ErrorView message={error} onRetry={loadTasks} />
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
<p className="text-gray-600 mt-1">
            {tasks.filter(t => !t.completed_c).length} active tasks, {tasks.filter(t => t.completed_c).length} completed
          </p>
        </div>
        
        <Button
          onClick={() => setTaskFormOpen(true)}
          icon="Plus"
          className="shadow-lg"
        >
          New Task
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search tasks..."
          className="flex-1"
        />
        
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
          className="flex-shrink-0"
        />
      </div>
      
      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Empty
            title={
              searchQuery ? "No matching tasks" : 
              activeFilter === "completed" ? "No completed tasks" :
              activeFilter === "active" ? "No active tasks" :
              "No tasks yet"
            }
            description={
              searchQuery ? `No tasks found matching "${searchQuery}"` :
              activeFilter === "completed" ? "Complete some tasks to see them here" :
              activeFilter === "active" ? "All tasks are completed!" :
              "Create your first task to get started with TaskFlow"
            }
            icon={
              searchQuery ? "Search" :
              activeFilter === "completed" ? "CheckCircle2" :
              "Plus"
            }
            actionLabel="Create Task"
            onAction={() => setTaskFormOpen(true)}
          />
        ) : (
          <motion.div layout className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.Id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={setConfirmDelete}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={taskFormOpen}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={handleCloseForm}
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default Home