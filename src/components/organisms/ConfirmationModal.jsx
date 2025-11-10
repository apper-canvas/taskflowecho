import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null
  
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return "AlertTriangle"
      case "warning":
        return "AlertCircle"
      case "info":
        return "Info"
      default:
        return "HelpCircle"
    }
  }
  
  const getIconColor = () => {
    switch (variant) {
      case "danger":
        return "text-error-600"
      case "warning":
        return "text-warning-600"
      case "info":
        return "text-info-600"
      default:
        return "text-gray-600"
    }
  }
  
  const getIconBg = () => {
    switch (variant) {
      case "danger":
        return "bg-error-50"
      case "warning":
        return "bg-warning-50"
      case "info":
        return "bg-info-50"
      default:
        return "bg-gray-50"
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-6">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-3 ${getIconBg()}`}>
              <ApperIcon 
                name={getIcon()} 
                size={24} 
                className={getIconColor()}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default ConfirmationModal