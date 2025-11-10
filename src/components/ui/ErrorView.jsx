import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="bg-error-50 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-error-500"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}. Don't worry, your tasks are safe. Please try again.
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-hover bg-primary-500 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-primary-600 transition-colors"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </button>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        If this problem persists, please refresh the page.
      </div>
    </div>
  )
}

export default ErrorView