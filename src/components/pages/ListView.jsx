import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
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
import { listService } from "@/services/api/listService"
import { getPriorityOrder } from "@/utils/priorityHelpers"

const ListView = () => {
  const { listId } = useParams()
  const [list, setList] = useState(null)
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  
  const loadData = async () => {
    try {
      setError("")
      const [listData, allTasks] = await Promise.all([
        listService.getById(listId),
        taskService.getAll()
      ])
      
      setList(listData)
      const listTasks = allTasks.filter(task => task.listId === listId)
      setTasks(listTasks)
    } catch (err) {
      setError("Failed to load list data. Please try again.")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (listId) {
      loadData()
    }
  }, [listId])
  
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
      const taskWithList = {
        ...taskData,
        listId: listId
      }
      
      const newTask = await taskService.create(taskWithList)
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
      
      // Check if task still belongs to this list after update
      if (updatedTask.listId === listId) {
        setTasks(prev => prev.map(task => 
          task.Id === updatedTask.Id ? updatedTask : task
        ))
      } else {
        // Remove from current list if moved to different list
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
    return <ErrorView message={error} onRetry={loadData} />
  }
  
  if (!list) {
    return (
      <ErrorView 
        message="List not found" 
        onRetry={loadData}
      />
    )
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: list.color }}
            />
            {list.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {tasks.filter(t => !t.completed).length} active tasks, {tasks.filter(t => t.completed).length} completed
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
      
      {/* List Progress */}
      {tasks.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">List Progress</h3>
            <div className="text-2xl font-bold" style={{ color: list.color }}>
              {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
            </div>
          </div>
          
          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                backgroundColor: list.color,
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
          placeholder={`Search ${list.name.toLowerCase()} tasks...`}
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
              activeFilter === "completed" ? `No completed ${list.name.toLowerCase()} tasks` :
              activeFilter === "active" ? `No active ${list.name.toLowerCase()} tasks` :
              `No ${list.name.toLowerCase()} tasks yet`
            }
            description={
              searchQuery ? `No tasks found matching "${searchQuery}"` :
              activeFilter === "completed" ? `Complete some ${list.name.toLowerCase()} tasks to see them here` :
              activeFilter === "active" ? `All ${list.name.toLowerCase()} tasks are completed! 🎉` :
              `Create your first ${list.name.toLowerCase()} task to get organized`
            }
            icon="List"
            actionLabel={`Add ${list.name} Task`}
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

export default ListView