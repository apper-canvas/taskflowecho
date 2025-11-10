import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { format, addDays, startOfWeek, addWeeks, startOfMonth, addMonths } from "date-fns"

const DatePicker = ({ 
  value, 
  onChange, 
  label = "Due Date",
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const quickOptions = [
    { label: "Today", value: new Date() },
    { label: "Tomorrow", value: addDays(new Date(), 1) },
    { label: "This Weekend", value: addDays(startOfWeek(new Date()), 6) },
    { label: "Next Week", value: addWeeks(new Date(), 1) },
    { label: "Next Month", value: addMonths(startOfMonth(new Date()), 1) }
  ]
  
  const handleQuickSelect = (date) => {
    onChange(date.toISOString().split('T')[0])
    setIsOpen(false)
  }
  
  const handleDateChange = (e) => {
    onChange(e.target.value)
  }
  
  const clearDate = () => {
    onChange("")
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="date"
            value={value}
            onChange={handleDateChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-gray-400"
          />
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
          >
            <ApperIcon name="Calendar" size={20} />
          </button>
          
          {value && (
            <button
              type="button"
              onClick={clearDate}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
            >
              <ApperIcon name="X" size={20} />
            </button>
          )}
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2 space-y-1 animate-slide-up">
            {quickOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickSelect(option.value)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">
                  {format(option.value, "EEEE, MMM d")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DatePicker