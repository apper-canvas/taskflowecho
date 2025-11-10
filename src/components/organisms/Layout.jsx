import React, { useState } from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  // Mock data for sidebar counts
  const navigationItems = [
    { name: "All Tasks", path: "/", icon: "List", count: 12 },
    { name: "Today", path: "/today", icon: "Calendar", count: 5 },
    { name: "Upcoming", path: "/upcoming", icon: "Clock", count: 7 }
  ]
  
  const lists = [
    { id: "work", name: "Work", path: "/list/work", color: "bg-blue-500", count: 8 },
    { id: "personal", name: "Personal", path: "/list/personal", color: "bg-green-500", count: 3 },
    { id: "shopping", name: "Shopping", path: "/list/shopping", color: "bg-purple-500", count: 1 }
  ]
  
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }
  
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckCircle2" size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "sidebar-item flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              isActivePath(item.path)
                ? "active bg-primary-50 text-primary-700 border-l-3 border-primary-500"
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <ApperIcon 
                name={item.icon} 
                size={18} 
                className={isActivePath(item.path) ? "text-primary-600" : "text-gray-400"}
              />
              {item.name}
            </div>
            {item.count > 0 && (
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full font-semibold",
                isActivePath(item.path)
                  ? "bg-primary-200 text-primary-800"
                  : "bg-gray-200 text-gray-600"
              )}>
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </div>
      
      {/* Lists section */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between px-3 mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Lists
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="Plus" size={16} />
          </button>
        </div>
        
        <div className="space-y-1">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={list.path}
              className={cn(
                "sidebar-item flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActivePath(list.path)
                  ? "active bg-primary-50 text-primary-700 border-l-3 border-primary-500"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", list.color)} />
                {list.name}
              </div>
              {list.count > 0 && (
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full font-semibold",
                  isActivePath(list.path)
                    ? "bg-primary-200 text-primary-800"
                    : "bg-gray-200 text-gray-600"
                )}>
                  {list.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Archive link */}
      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          to="/archive"
          className={cn(
            "sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            isActivePath("/archive")
              ? "active bg-primary-50 text-primary-700 border-l-3 border-primary-500"
              : "text-gray-700 hover:text-gray-900"
          )}
        >
          <ApperIcon 
            name="Archive" 
            size={18} 
            className={isActivePath("/archive") ? "text-primary-600" : "text-gray-400"}
          />
          Archive
        </Link>
      </div>
    </>
  )
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckCircle2" size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>
        
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="Menu" size={24} />
        </button>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <div className="overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
      
      <div className="lg:flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:w-72 lg:flex-shrink-0">
          <div className="h-screen bg-white border-r border-gray-200 overflow-y-auto sticky top-0">
            <SidebarContent />
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout