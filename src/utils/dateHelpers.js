import { format, isToday, isTomorrow, isPast, isThisWeek, differenceInDays } from "date-fns"

export const formatTaskDate = (date) => {
  if (!date) return null
  
  const taskDate = new Date(date)
  
  if (isToday(taskDate)) {
    return "Today"
  }
  
  if (isTomorrow(taskDate)) {
    return "Tomorrow"
  }
  
  if (isThisWeek(taskDate)) {
    return format(taskDate, "EEEE")
  }
  
  return format(taskDate, "MMM dd")
}

export const getDateBadgeColor = (date) => {
  if (!date) return "bg-gray-100 text-gray-600"
  
  const taskDate = new Date(date)
  const daysDiff = differenceInDays(taskDate, new Date())
  
  if (isPast(taskDate) && !isToday(taskDate)) {
    return "bg-error-100 text-error-700"
  }
  
  if (isToday(taskDate)) {
    return "bg-warning-100 text-warning-700"
  }
  
  if (daysDiff <= 3) {
    return "bg-warning-100 text-warning-600"
  }
  
  return "bg-info-100 text-info-700"
}

export const isOverdue = (date) => {
  if (!date) return false
  return isPast(new Date(date)) && !isToday(new Date(date))
}

export const isDueSoon = (date) => {
  if (!date) return false
  const daysDiff = differenceInDays(new Date(date), new Date())
  return daysDiff >= 0 && daysDiff <= 3
}