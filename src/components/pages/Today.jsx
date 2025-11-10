import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import FilterTabs from "@/components/molecules/FilterTabs"
import TaskCard from "@/components/molecules/TaskCard"
import TaskForm from "@/components/organisms/TaskForm"
import ConfirmationModal from "@/components/organisms/ConfirmationModal"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { format, isToday } from "date-fns"
import { getPriorityOrder } from "@/utils/priorityHelpers"

const Today = () => {
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
      const allTasks = await taskService.getAll()
      const todayTasks = allTasks.filter(task => {
        if (!task.dueDate) return false
        return isToday(new Date(task.dueDate))
      })
      setTasks(todayTasks)
    } catch (err) {
      setError("Failed to load today's tasks. Please try again.")
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
        filtered = filtered.filter(task => !task.completed)
        break
      case "completed":
        filtered = filtered.filter(task => task.completed)
        break
      default:
        break
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      )
    }
    
    // Sort by priority and creation date
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed
      }
      
      const priorityA = getPriorityOrder(a.priority)
      const priorityB = getPriorityOrder(b.priority)
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    
    setFilteredTasks(filtered)
  }, [tasks, searchQuery, activeFilter])
  
  const handleCreateTask = async (taskData) => {
    try {
      // Set today's date if no due date is provided
      const taskWithDate = {
        ...taskData,
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
      }
      
      const newTask = await taskService.create(taskWithDate)
      
      // Only add to local state if it's due today
      if (isToday(new Date(newTask.dueDate))) {
        setTasks(prev => [newTask, ...prev])
      }
      
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
      
      // Check if task still belongs to today after update
      if (isToday(new Date(updatedTask.dueDate))) {
        setTasks(prev => prev.map(task => 
          task.Id === updatedTask.Id ? updatedTask : task
        ))
      } else {
        // Remove from today's list if date changed
        setTasks(prev => prev.filter(task => task.Id !== updatedTask.Id))
      }
      
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
      count: tasks.filter(t => !t.completed).length 
    },
    { 
      label: "Completed", 
      value: "completed", 
      count: tasks.filter(t => t.completed).length 
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ApperIcon name="Calendar" size={32} className="text-primary-600" />
            Today
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")} • {tasks.filter(t => !t.completed).length} tasks remaining
          </p>
        </div>
        
        <Button
          onClick={() => setTaskFormOpen(true)}
          icon="Plus"
          className="shadow-lg"
        >
          Add Task
        </Button>
      </div>
      
      {/* Today's Progress */}
      {tasks.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
            <div className="text-2xl font-bold text-primary-600">
              {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
            </div>
          </div>
          
          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-500"
              style={{ 
                width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{tasks.filter(t => t.completed).length} completed</span>
            <span>{tasks.filter(t => !t.completed).length} remaining</span>
          </div>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search today's tasks..."
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
              activeFilter === "completed" ? "No completed tasks today" :
              activeFilter === "active" ? "No active tasks today" :
              "No tasks for today"
            }
            description={
              searchQuery ? `No tasks found matching "${searchQuery}"` :
              activeFilter === "completed" ? "Complete some tasks to see them here" :
              activeFilter === "active" ? "All today's tasks are completed! 🎉" :
              "Add some tasks to make today productive"
            }
            icon="Calendar"
            actionLabel="Add Task for Today"
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

export default Today