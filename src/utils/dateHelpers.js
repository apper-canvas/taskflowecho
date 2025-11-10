import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export const formatTaskDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  } catch (error) {
    return null;
  }
};

export const getDateBadgeColor = (dateString) => {
  if (!dateString) return 'default';
  
  try {
    const date = parseISO(dateString);
    const now = new Date();
    
    if (date < now) {
      return 'error'; // Overdue
    } else if (isToday(date)) {
      return 'warning'; // Due today
    } else if (isTomorrow(date)) {
      return 'info'; // Due tomorrow
    } else {
      return 'default'; // Future
    }
  } catch (error) {
    return 'default';
  }
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    
    return date < now;
  } catch (error) {
    return false;
  }
};