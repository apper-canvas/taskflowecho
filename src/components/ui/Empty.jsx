import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No tasks yet", 
  description = "Create your first task to get started with TaskFlow",
  icon = "CheckCircle2",
  actionLabel = "Create Task",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="bg-gradient-to-br from-primary-50 to-indigo-100 rounded-full p-8 mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-primary-500"
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-hover bg-gradient-to-r from-primary-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-3 hover:from-primary-600 hover:to-indigo-700 transition-all shadow-lg"
        >
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </button>
      )}
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <ApperIcon name="Zap" size={16} className="text-primary-400" />
          Quick capture
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Calendar" size={16} className="text-primary-400" />
          Set due dates
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Flag" size={16} className="text-primary-400" />
          Priority levels
        </div>
      </div>
    </div>
  )
}

export default Empty