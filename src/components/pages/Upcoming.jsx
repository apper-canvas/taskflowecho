import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { addWeeks, endOfWeek, format, isFuture, isThisWeek, isWithinInterval, startOfWeek } from "date-fns";
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

// Custom helper since isNextWeek is not available in date-fns 4.1.0
const isNextWeek = (date) => {
  const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 })
  const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 })
  return isWithinInterval(date, { start: nextWeekStart, end: nextWeekEnd })
}
const Upcoming = () => {
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
      const upcomingTasks = allTasks.filter(task => {
        if (!task.due_date_c) return false
        const taskDate = new Date(task.due_date_c)
        return isFuture(taskDate)
      })
      setTasks(upcomingTasks)
    } catch (err) {
      setError("Failed to load upcoming tasks. Please try again.")
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
// Apply status filter
    switch (activeFilter) {
      case "active":
        filtered = filtered.filter(task => !task.completed_c)
        break
      case "completed":
        filtered = filtered.filter(task => task.completed_c)
        break
      case "thisWeek":
        filtered = filtered.filter(task => isThisWeek(new Date(task.due_date_c)))
        break
      case "nextWeek":
        filtered = filtered.filter(task => isNextWeek(new Date(task.due_date_c)))
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
    
    // Sort by due date, then priority
    filtered.sort((a, b) => {
if (a.completed_c !== b.completed_c) {
        return a.completed_c - b.completed_c
      }
      
      const dateA = new Date(a.due_date_c)
      const dateB = new Date(b.due_date_c)
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB
      }
      
const priorityA = getPriorityOrder(a.priority_c)
      const priorityB = getPriorityOrder(b.priority_c)
      
      return priorityA - priorityB
    })
    
    setFilteredTasks(filtered)
  }, [tasks, searchQuery, activeFilter])
  
  const handleCreateTask = async (taskData) => {
    try {
      // Set tomorrow's date if no due date is provided
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
const taskWithDate = {
        ...taskData,
        due_date_c: taskData.due_date_c || taskData.dueDate || tomorrow.toISOString().split('T')[0]
      }
      
      const newTask = await taskService.create(taskWithDate)
      
// Only add to local state if it's in the future
      if (isFuture(new Date(newTask.due_date_c))) {
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
      
// Check if task still belongs to upcoming after update
      if (isFuture(new Date(updatedTask.due_date_c))) {
        setTasks(prev => prev.map(task =>
          task.Id === updatedTask.Id ? updatedTask : task
        ))
      } else {
        // Remove from upcoming list if date changed
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
      count: tasks.filter(t => !t.completed_c).length 
    },
    { 
      label: "This Week", 
      value: "thisWeek", 
      count: tasks.filter(t => isThisWeek(new Date(t.due_date_c))).length 
    },
    { 
      label: "Next Week", 
      value: "nextWeek", 
      count: tasks.filter(t => isNextWeek(new Date(t.due_date_c))).length
    }
  ]
  
  // Group tasks by time period
const groupedTasks = filteredTasks.reduce((groups, task) => {
    const taskDate = new Date(task.due_date_c)
    let groupKey = ""
    
    if (isThisWeek(taskDate)) {
      groupKey = "This Week"
    } else if (isNextWeek(taskDate)) {
      groupKey = "Next Week"
    } else {
      const weeksFromNow = Math.ceil((taskDate - new Date()) / (1000 * 60 * 60 * 24 * 7))
      if (weeksFromNow <= 4) {
        groupKey = `In ${weeksFromNow} week${weeksFromNow > 1 ? 's' : ''}`
      } else {
        groupKey = format(taskDate, "MMMM yyyy")
      }
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(task)
    
    return groups
  }, {})
  
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
            <ApperIcon name="Clock" size={32} className="text-primary-600" />
            Upcoming
          </h1>
<p className="text-gray-600 mt-1">
            {tasks.filter(t => !t.completed_c).length} upcoming tasks scheduled
          </p>
        </div>
        
        <Button
          onClick={() => setTaskFormOpen(true)}
          icon="Plus"
          className="shadow-lg"
        >
          Schedule Task
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search upcoming tasks..."
          className="flex-1"
        />
        
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
          className="flex-shrink-0"
        />
      </div>
      
      {/* Task Groups */}
      <div className="space-y-8">
        {Object.keys(groupedTasks).length === 0 ? (
          <Empty
            title={
              searchQuery ? "No matching tasks" : 
              activeFilter === "active" ? "No active upcoming tasks" :
              activeFilter === "thisWeek" ? "No tasks this week" :
              activeFilter === "nextWeek" ? "No tasks next week" :
              "No upcoming tasks"
            }
            description={
              searchQuery ? `No upcoming tasks found matching "${searchQuery}"` :
              activeFilter === "active" ? "All upcoming tasks are completed!" :
              activeFilter === "thisWeek" ? "Nothing scheduled for this week" :
              activeFilter === "nextWeek" ? "Nothing scheduled for next week" :
              "Schedule some tasks for the future to stay organized"
            }
            icon="Clock"
            actionLabel="Schedule Task"
            onAction={() => setTaskFormOpen(true)}
          />
        ) : (
          Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {groupName}
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {groupTasks.length} task{groupTasks.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <motion.div layout className="space-y-3">
                {groupTasks.map((task) => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={setConfirmDelete}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))
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

export default Upcoming