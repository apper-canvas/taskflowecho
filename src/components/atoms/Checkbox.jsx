import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({
  label,
  checked = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer btn-hover",
            checked 
              ? "bg-success-500 border-success-500" 
              : "bg-white border-gray-300 hover:border-gray-400",
            className
          )}
        >
          {checked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="text-white animate-scale-in"
            />
          )}
        </div>
      </div>
      
      {label && (
        <label 
          className={cn(
            "text-sm font-medium cursor-pointer transition-colors duration-200",
            checked ? "text-gray-500 line-through" : "text-gray-900"
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox