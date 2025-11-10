import React from "react"
import { cn } from "@/utils/cn"

const FilterTabs = ({ 
  tabs = [], 
  activeTab, 
  onTabChange, 
  className 
}) => {
  return (
    <div className={cn("flex bg-gray-100 rounded-lg p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150",
            activeTab === tab.value
              ? "bg-white text-primary-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs",
              activeTab === tab.value
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-200 text-gray-600"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs