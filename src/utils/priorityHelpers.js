export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-accent-500"
    case "medium":
      return "bg-secondary-500"
    case "low":
      return "bg-info-500"
    default:
      return "bg-gray-400"
  }
}

export const getPriorityTextColor = (priority) => {
  switch (priority) {
    case "high":
      return "text-accent-700"
    case "medium":
      return "text-secondary-700"
    case "low":
      return "text-info-700"
    default:
      return "text-gray-700"
  }
}

export const getPriorityBgColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-accent-50"
    case "medium":
      return "bg-secondary-50"
    case "low":
      return "bg-info-50"
    default:
      return "bg-gray-50"
  }
}

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case "high":
      return "High Priority"
    case "medium":
      return "Medium Priority"
    case "low":
      return "Low Priority"
    default:
      return "No Priority"
  }
}

export const getPriorityOrder = (priority) => {
  switch (priority) {
    case "high":
      return 1
    case "medium":
      return 2
    case "low":
      return 3
    default:
      return 4
  }
}