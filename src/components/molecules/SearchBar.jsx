import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className }) => {
  const [query, setQuery] = useState("")
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [query, onSearch])
  
  const handleClear = () => {
    setQuery("")
    onSearch("")
  }
  
  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-gray-400"
      />
      
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar