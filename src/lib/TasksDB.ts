import { openDB } from "idb";
import { YYYYMMDDTHHMMSSZ, PRIORITY, STATUS } from "./Regex";
import type { TaskType } from "../types/TaskType";

type ValidationType = {
  status: boolean,
  message?: string
}

const validateTask = (task: TaskType): ValidationType => {

  const { due_date, priority, status, name } = task
  if (YYYYMMDDTHHMMSSZ.test(due_date) === false) {
    return { status: false, message: "Please enter a valid date" }
  }

  if (PRIORITY.test(priority.toString()) === false) {
    return { status: false, message: "Please enter a valid priority" }
  }

  if (STATUS.test(status) === false) {
    return { status: false, message: "Please enter a valid status" }
  }

  if (typeof name !== "string" || name.length < 0) {
    return { status: false, message: "Please enter a valid name" }
  }

  return { status: true }


}

export const TasksDB = async () => {


  const db = await openDB('tasks', 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('tasks', {
        // The 'task_id' property of the object will be the key.
        keyPath: 'task_id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex('status', 'status');
      store.createIndex('order', 'order');
    },
  });


  const AddTask = async (task: TaskType | any): Promise<ValidationType> => {
    try {
      const count = await db.count("tasks")
      const priority = task.priority == undefined || task.priority === null ? 0 : task.priority
      const name = task.name || "";
      const status = task.status || "";
      const due_date = task.due_date ? task.due_date.toISOString() : "";
      const order = task.order == undefined || task.order === null ? count : task.order
      const newTask: TaskType = { priority, name, status, due_date, order }


      const taskValidation: ValidationType = validateTask(newTask)
      const isValidTask = taskValidation.status

      
      if (isValidTask) {
        await db.add('tasks', newTask);
        return { status: true }
      }
      
      return taskValidation
      
      
    } catch (error) {
      return { status: false, message: "Unknown error please contact the administrator." }
    }
  }
  
  const UpdateTask = async (task: TaskType | any): Promise<ValidationType> => {
    try {
      const priority = task.priority == undefined || task.priority === null ? 0 : task.priority
      const name = task.name || "";
      const status = task.status || "";
      const due_date = task.due_date && typeof task.due_date == 'object' ? task.due_date.toISOString() : typeof task.due_date == 'string' && task.due_date.length > 0 ? task.due_date : "";
      const order = task.order == undefined || task.order === null ? 0 : task.order
      const task_id = task.task_id
      const newTask: TaskType = { priority, name, status, due_date, order, task_id }
      const taskValidation: ValidationType = validateTask(newTask)
      const isValidTask = taskValidation.status
      const keys = await db.getAllKeys("tasks")
      const isValidKey = keys.includes(task.task_id)
      if (isValidTask && isValidKey) {
        await db.put('tasks', newTask);
        return { status: true }
      }

      return taskValidation


    } catch (error) {
      return { status: false, message: "Unknown error please contact the administrator." }
    }
  }

  const DeleteAllCompleted = async () => {
    const dones = await db.getAllFromIndex("tasks", "status", "Done")
    for (let i = 0; i < dones.length; i++) {
      const doneItem = dones[i]
      const { priority, name, due_date, order, task_id } = doneItem
      const newItem = {
        priority, name, status: "Deleted", due_date, order, task_id
      }
      await db.put('tasks', newItem);
    }
    return { status: true, message: "Tasks have been updated." }
  }


  const SortByDate = (order: 1 | -1, data: TaskType[]) => {
    const sortOrder: "Asc" | "Des" = order === 1 ? "Asc" : "Des"
    if (sortOrder === "Asc") {
      return data.sort((a: TaskType, b: TaskType) => a.due_date.localeCompare(b.due_date))
    }
    return data.sort((a: TaskType, b: TaskType) => -a.due_date.localeCompare(b.due_date))
  }


  const ReadAllTasks = async () => {
    const data = await db.getAll("tasks")
    return data
  }
  const ClearAll = async () => {
    const data = await db.clear("tasks")
    return data
  }

  const ReadAllByDueDateAsc = async () => {
    const data: TaskType[] = await ReadAllTasks()
    return SortByDate(1, data)
  }
  const ReadAllByDueDateDes = async () => {
    const data: TaskType[] = await ReadAllTasks()
    return SortByDate(1, data)
  }

  const SortByOrder = (order: 1 | -1, data: TaskType[]) => {
    const sortOrder: "Asc" | "Des" = order === 1 ? "Asc" : "Des"
    if (sortOrder === "Asc") {
      return data.sort((a: TaskType, b: TaskType) => b.order - a.order)
    }
    return data.sort((a: TaskType, b: TaskType) => a.order - b.order)
  }


  const ReadAllByDueOrderAsc = async () => {
    const data: TaskType[] = await ReadAllTasks()
    return SortByOrder(1, data)
  }
  const ReadAllByOrderDes = async () => {
    const data: TaskType[] = await ReadAllTasks()
    return SortByOrder(1, data)
  }


  return { ReadAllByDueDateAsc, DeleteAllCompleted, ReadAllByDueDateDes, ReadAllByDueOrderAsc, ReadAllByOrderDes, AddTask, ClearAll, UpdateTask }
}