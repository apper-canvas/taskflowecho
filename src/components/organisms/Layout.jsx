import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { taskService } from "@/services/api/taskService";
import { listService } from "@/services/api/listService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Archive from "@/components/pages/Archive";
import { cn } from "@/utils/cn";

const Layout = () => {
  const location = useLocation()
  const { logout } = useAuth()
  
  const [taskCounts, setTaskCounts] = useState({})
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Load data for sidebar counts
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allTasks, allLists] = await Promise.all([
          taskService.getAll(),
          listService.getAll()
        ])
        
        // Calculate task counts
        const today = new Date().toISOString().split('T')[0]
        const tomorrow = new Date(Date.now() + 86400000)
        
        const counts = {
          all: allTasks.length,
          today: allTasks.filter(task => task.due_date_c === today).length,
          upcoming: allTasks.filter(task => {
            if (!task.due_date_c) return false
            const taskDate = new Date(task.due_date_c)
            return taskDate > tomorrow
          }).length
        }
        
        // Map lists with task counts
        const listsWithCounts = allLists.map(list => ({
          ...list,
          count: allTasks.filter(task => 
            task.list_id_c?.Id === list.Id ||
            task.list_id_c === list.Id
          ).length
        }))
        
        setTaskCounts(counts)
        setLists(listsWithCounts)
      } catch (error) {
        console.error("Error loading layout data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Mock data for navigation items with real counts
const navigationItems = [
    { name: "All Tasks", path: "/", icon: "List", count: taskCounts.all || 0 },
    { name: "Today", path: "/today", icon: "Calendar", count: taskCounts.today || 0 },
    { name: "Upcoming", path: "/upcoming", icon: "Clock", count: taskCounts.upcoming || 0 }
  ]
  
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }
  
const SidebarContent = () => (
    <>
      {/* Logo and Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-500">Professional Task Management</p>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            icon="LogOut"
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
      </div>
      
      <div className="px-6 py-6">
        {/* Main Navigation */}
        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all duration-150 sidebar-item",
                isActivePath(item.path) && "active"
              )}
            >
              <div className="flex items-center gap-3">
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
              
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full font-semibold",
                isActivePath(item.path)
                  ? "bg-primary-200 text-primary-800"
                  : "bg-gray-200 text-gray-600"
              )}>
                {item.count}
              </span>
            </Link>
          ))}
        </nav>
        
        {/* Lists */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 px-3">Lists</h2>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <ApperIcon name="Plus" size={16} />
            </button>
          </div>
          
          <div className="space-y-1">
            {lists.map((list) => (
              <Link
                key={list.Id}
                to={`/list/${list.Id}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all duration-150 sidebar-item",
                  isActivePath(`/list/${list.Id}`) && "active"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full")} style={{ backgroundColor: list.color_c || '#6366f1' }} />
                  <span className="font-medium">{list.name_c}</span>
                </div>
                
                {list.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full font-semibold",
                    isActivePath(`/list/${list.Id}`)
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