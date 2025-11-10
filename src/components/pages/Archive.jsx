import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { format, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import TaskCard from "@/components/molecules/TaskCard";
import SearchBar from "@/components/molecules/SearchBar";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Archive = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmRestore, setConfirmRestore] = useState(null)
  
const loadTasks = async () => {
    try {
      setError("")
      const allTasks = await taskService.getAll()
      const completedTasks = allTasks.filter(task => task.completed_c)
      setTasks(completedTasks)
    } catch (err) {
      setError("Failed to load archived tasks. Please try again.")
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
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title_c?.toLowerCase().includes(query) ||
        task.description_c?.toLowerCase().includes(query)
      )
    }
    
    // Sort by completion date (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.completed_at_c || a.CreatedOn)
      const dateB = new Date(b.completed_at_c || b.CreatedOn)
      return dateB - dateA
    })
    
    setFilteredTasks(filtered)
  }, [tasks, searchQuery])
  
  const handleRestoreTask = async () => {
    if (!confirmRestore) return
    
    try {
      const restoredTask = await taskService.restore(confirmRestore)
      setTasks(prev => prev.filter(task => task.Id !== confirmRestore))
      setConfirmRestore(null)
      toast.success("Task restored successfully!")
    } catch (err) {
      toast.error("Failed to restore task")
      console.error("Error restoring task:", err)
    }
  }
  
  const handleDeleteTask = async () => {
    if (!confirmDelete) return
    
    try {
      await taskService.delete(confirmDelete)
      setTasks(prev => prev.filter(task => task.Id !== confirmDelete))
      setConfirmDelete(null)
      toast.success("Task permanently deleted")
    } catch (err) {
      toast.error("Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }
  
  const handleClearAll = async () => {
    try {
      // Delete all archived tasks
      await Promise.all(tasks.map(task => taskService.delete(task.Id)))
      setTasks([])
      toast.success("All archived tasks cleared successfully")
    } catch (err) {
      toast.error("Failed to clear archived tasks")
      console.error("Error clearing tasks:", err)
    }
  }
  
  // Group tasks by completion date
const groupedTasks = filteredTasks.reduce((groups, task) => {
    const completionDate = task.completed_at_c ? parseISO(task.completed_at_c) : parseISO(task.CreatedOn)
    const dateKey = format(completionDate, "MMMM d, yyyy")
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(task)
    
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
            <ApperIcon name="Archive" size={32} className="text-primary-600" />
            Archive
          </h1>
          <p className="text-gray-600 mt-1">
            {tasks.length} completed task{tasks.length !== 1 ? 's' : ''} archived
          </p>
        </div>
        
        {tasks.length > 0 && (
          <Button
            onClick={() => setConfirmDelete("all")}
            variant="secondary"
            icon="Trash2"
            className="text-error-600 hover:text-error-700"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Search */}
      {tasks.length > 0 && (
        <div className="max-w-md">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search archived tasks..."
          />
        </div>
      )}
      
      {/* Archive Stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ApperIcon name="CheckCircle2" size={24} className="text-success-600" />
              <div>
                <div className="text-2xl font-bold text-success-700">{tasks.length}</div>
                <div className="text-sm text-success-600">Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ApperIcon name="Calendar" size={24} className="text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {Object.keys(groupedTasks).length}
                </div>
                <div className="text-sm text-blue-600">Days</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <ApperIcon name="TrendingUp" size={24} className="text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {Math.round(tasks.length / Math.max(Object.keys(groupedTasks).length, 1) * 10) / 10}
                </div>
                <div className="text-sm text-purple-600">Avg/Day</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Task Groups */}
      <div className="space-y-8">
        {Object.keys(groupedTasks).length === 0 ? (
          <Empty
            title={searchQuery ? "No matching tasks" : "No archived tasks"}
            description={
              searchQuery 
                ? `No archived tasks found matching "${searchQuery}"`
                : "Complete some tasks to see them in your archive"
            }
            icon="Archive"
            actionLabel="View All Tasks"
            onAction={() => window.history.back()}
          />
        ) : (
          Object.entries(groupedTasks).map(([dateKey, dateTasks]) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {dateKey}
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {dateTasks.length} task{dateTasks.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <motion.div layout className="space-y-3">
                {dateTasks.map((task) => (
                  <div
                    key={task.Id}
                    className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 task-card opacity-75"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <ApperIcon 
                          name="CheckCircle2" 
                          size={20} 
                          className="text-success-500"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
<h3 className="font-semibold text-gray-700 line-through">
                          {task.title_c}
                        </h3>
                        
                        {task.description_c && (
                          <p className="text-sm text-gray-500 mt-1 line-through">
                            {task.description_c}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-success-600 font-medium flex items-center gap-1">
                        <ApperIcon name="Clock" size={12} />
Completed {task.completed_at_c ? format(parseISO(task.completed_at_c), "h:mm a") : ""}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setConfirmRestore(task.Id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-150"
                          title="Restore task"
                        >
                          <ApperIcon name="RotateCcw" size={16} />
                        </button>
                        
                        <button
                          onClick={() => setConfirmDelete(task.Id)}
                          className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded transition-all duration-150"
                          title="Delete permanently"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmRestore}
        title="Restore Task"
        message="Are you sure you want to restore this task? It will be moved back to your active tasks."
        confirmLabel="Restore"
        cancelLabel="Cancel"
        variant="info"
        onConfirm={handleRestoreTask}
        onCancel={() => setConfirmRestore(null)}
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        title={confirmDelete === "all" ? "Clear All Archive" : "Delete Task Permanently"}
        message={
          confirmDelete === "all" 
            ? "Are you sure you want to permanently delete all archived tasks? This action cannot be undone."
            : "Are you sure you want to permanently delete this task? This action cannot be undone."
        }
        confirmLabel={confirmDelete === "all" ? "Clear All" : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete === "all" ? handleClearAll : handleDeleteTask}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default Archive