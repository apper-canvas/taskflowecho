import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Select = forwardRef(({
  label,
  error,
  children,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white transition-all duration-150",
          "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
          "hover:border-gray-400",
          error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="text-sm text-error-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select