import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 btn-hover focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-indigo-600 text-white hover:from-primary-600 hover:to-indigo-700 focus:ring-primary-500 shadow-lg",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-error-500 to-red-600 text-white hover:from-error-600 hover:to-red-700 focus:ring-error-500 shadow-lg",
    success: "bg-gradient-to-r from-success-500 to-green-600 text-white hover:from-success-600 hover:to-green-700 focus:ring-success-500 shadow-lg"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  }
  
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize[size]} 
          className="animate-spin"
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button