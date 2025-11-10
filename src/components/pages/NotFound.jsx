import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-50 to-indigo-100 rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
            <ApperIcon 
              name="Search" 
              size={64} 
              className="text-primary-500"
            />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Looks like this page took a productivity break! 
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
            icon="Home"
          >
            Back to Tasks
          </Button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors py-2"
          >
            ← Go Back
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-primary-600 transition-colors"
            >
              All Tasks
            </button>
            <button
              onClick={() => navigate("/today")}
              className="hover:text-primary-600 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigate("/upcoming")}
              className="hover:text-primary-600 transition-colors"
            >
              Upcoming
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound