import React from "react"

const Loading = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-8 w-48 rounded-lg"></div>
        <div className="skeleton h-10 w-32 rounded-lg"></div>
      </div>

      {/* Search and filters skeleton */}
      <div className="flex items-center gap-4">
        <div className="skeleton h-12 flex-1 rounded-lg"></div>
        <div className="skeleton h-12 w-24 rounded-lg"></div>
        <div className="skeleton h-12 w-24 rounded-lg"></div>
      </div>

      {/* Task cards skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="skeleton h-5 w-5 rounded"></div>
              <div className="skeleton h-6 flex-1 rounded"></div>
              <div className="skeleton h-6 w-16 rounded-full"></div>
              <div className="skeleton h-6 w-20 rounded-full"></div>
            </div>
            <div className="skeleton h-4 w-3/4 rounded ml-8"></div>
            <div className="flex items-center justify-between ml-8">
              <div className="skeleton h-4 w-24 rounded"></div>
              <div className="flex gap-2">
                <div className="skeleton h-8 w-8 rounded"></div>
                <div className="skeleton h-8 w-8 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading