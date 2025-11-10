import listsData from "@/services/mockData/lists.json"

let lists = [...listsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const listService = {
  async getAll() {
    await delay(200)
    return [...lists]
  },
  
  async getById(id) {
    await delay(150)
    const list = lists.find(list => list.id === id)
    if (!list) {
      throw new Error("List not found")
    }
    return { ...list }
  },
  
  async create(listData) {
    await delay(300)
    const maxId = Math.max(...lists.map(list => list.Id), 0)
    const newList = {
      Id: maxId + 1,
      id: listData.name.toLowerCase().replace(/\s+/g, '-'),
      ...listData,
      order: lists.length + 1,
      createdAt: new Date().toISOString()
    }
    lists.push(newList)
    return { ...newList }
  },
  
  async update(id, listData) {
    await delay(250)
    const listIndex = lists.findIndex(list => list.id === id)
    if (listIndex === -1) {
      throw new Error("List not found")
    }
    
    const updatedList = {
      ...lists[listIndex],
      ...listData
    }
    
    lists[listIndex] = updatedList
    return { ...updatedList }
  },
  
  async delete(id) {
    await delay(200)
    const listIndex = lists.findIndex(list => list.id === id)
    if (listIndex === -1) {
      throw new Error("List not found")
    }
    
    lists.splice(listIndex, 1)
    return { success: true }
  }
}