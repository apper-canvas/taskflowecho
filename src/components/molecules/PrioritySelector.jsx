import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { getPriorityColor, getPriorityLabel } from "@/utils/priorityHelpers"

const PrioritySelector = ({ 
  value, 
  onChange, 
  label = "Priority",
  className 
}) => {
  const priorities = [
    { value: "high", label: "High", color: "bg-accent-500" },
    { value: "medium", label: "Medium", color: "bg-secondary-500" },
    { value: "low", label: "Low", color: "bg-info-500" }
  ]
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-3 gap-2">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange(priority.value)}
            className={cn(
              "priority-option flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200",
              value === priority.value
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full",
              priority.color,
              value === priority.value && `priority-${priority.value}`
            )} />
            {priority.label}
            
            {value === priority.value && (
              <ApperIcon name="Check" size={14} className="ml-auto text-primary-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PrioritySelector