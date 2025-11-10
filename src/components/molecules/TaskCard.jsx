import React, { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"
import { formatTaskDate, getDateBadgeColor, isOverdue } from "@/utils/dateHelpers"
import { getPriorityColor, getPriorityTextColor } from "@/utils/priorityHelpers"

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  
  const handleToggleComplete = async () => {
    if (task.completed) {
      onToggleComplete(task.Id)
      return
    }
    
    setIsCompleting(true)
    
    setTimeout(() => {
      onToggleComplete(task.Id)
      setIsCompleting(false)
    }, 300)
  }
  
  const dateLabel = formatTaskDate(task.dueDate)
  const dateBadgeColor = getDateBadgeColor(task.dueDate)
  const priorityColor = getPriorityColor(task.priority)
  const priorityTextColor = getPriorityTextColor(task.priority)
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isCompleting ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "task-card bg-white rounded-lg border border-gray-200 p-4 space-y-3 transition-all duration-200",
        task.completed && "task-completed",
        isCompleting && "animate-complete",
        className
      )}
    >
      {/* Main task content */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-gray-900 transition-all duration-300",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mt-1 transition-all duration-300",
              task.completed && "line-through text-gray-400"
            )}>
              {task.description}
            </p>
          )}
        </div>
        
        {/* Priority badge */}
        {task.priority && (
          <div className={cn(
            "w-3 h-3 rounded-full flex-shrink-0 mt-1.5",
            priorityColor,
            `priority-${task.priority}`
          )} />
        )}
      </div>
      
      {/* Task metadata and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Due date badge */}
          {dateLabel && (
            <Badge 
              variant={isOverdue(task.dueDate) ? "error" : "default"}
              className={cn(
                "transition-all duration-300",
                task.completed && "opacity-50"
              )}
            >
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              {dateLabel}
            </Badge>
          )}
          
          {/* Priority text */}
          {task.priority && (
            <span className={cn(
              "text-xs font-medium transition-all duration-300",
              priorityTextColor,
              task.completed && "opacity-50"
            )}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        {!task.completed && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-150"
              title="Edit task"
            >
              <ApperIcon name="Edit3" size={16} />
            </button>
            
            <button
              onClick={() => onDelete(task.Id)}
              className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded transition-all duration-150"
              title="Delete task"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        )}
        
        {task.completed && (
          <div className="text-xs text-success-600 font-medium flex items-center gap-1">
            <ApperIcon name="Check" size={12} />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TaskCard