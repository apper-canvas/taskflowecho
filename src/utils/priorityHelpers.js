export const getPriorityOrder = (priority) => {
  const order = { high: 1, medium: 2, low: 3 };
  return order[priority] || 99;
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getPriorityTextColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};