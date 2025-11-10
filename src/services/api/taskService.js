import tasksData from "@/services/mockData/tasks.json"

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },
  
  async getById(id) {
    await delay(200)
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  },
  
  async create(taskData) {
    await delay(400)
    const maxId = Math.max(...tasks.map(task => task.Id), 0)
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.push(newTask)
    return { ...newTask }
  },
  
  async update(id, taskData) {
    await delay(300)
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData
    }
    
    tasks[taskIndex] = updatedTask
    return { ...updatedTask }
  },
  
  async delete(id) {
    await delay(250)
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    tasks.splice(taskIndex, 1)
    return { success: true }
  },
  
  async toggleComplete(id) {
    await delay(200)
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    
    task.completed = !task.completed
    task.completedAt = task.completed ? new Date().toISOString() : null
    
    return { ...task }
  },
  
  async getByList(listId) {
    await delay(250)
    return tasks.filter(task => task.listId === listId).map(task => ({ ...task }))
  },
  
  async getToday() {
    await delay(250)
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(task => task.dueDate === today).map(task => ({ ...task }))
  },
  
  async getUpcoming() {
    await delay(250)
    const today = new Date()
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate > today
    }).map(task => ({ ...task }))
  },
  
  async getCompleted() {
    await delay(250)
    return tasks.filter(task => task.completed).map(task => ({ ...task }))
  },
  
  async restore(id) {
    await delay(200)
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    
    task.completed = false
    task.completedAt = null
    
    return { ...task }
  }
}