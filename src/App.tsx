
import './App.css'
import { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Loading from './Components/Loading';
import { TasksDB } from './lib/TasksDB';
import type { TaskType } from "./types/TaskType";
import TasksTile from './Components/Tiles/TasksTile';
import { Drawer, Modal, Popconfirm, notification } from 'antd';
import AddTaskForm from './Components/Forms/Tasks/AddTaskForm';

function App() {

  const [tasks, setTasks] = useState<TaskType[] | []>([])
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true)
  const [actionsDrawerVisible, setActionsDrawerVisible] = useState<boolean>(false)
  const [addTaskModalVisible, setAddTaskModalVisible] = useState<boolean>(false)
  const loadTasks = async () => {
    setLoadingTasks(true)
    const DB = await TasksDB()
    const { ReadAllByOrderDes } = DB
    const tasksFromDB = await ReadAllByOrderDes()
    setLoadingTasks(false)
    setTasks(tasksFromDB)
  }
  const clearDB = async () => {
    const DB = await TasksDB()
    const { ClearAll } = DB
    await ClearAll()
    loadTasks()
  }


  const deleteCompletedItems = async () => {
    const DB = await TasksDB()
    const { DeleteAllCompleted } = DB
    const result = await DeleteAllCompleted()
    loadTasks()
    notification.success({message: result.message})
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const startNewTask = () => {
    setActionsDrawerVisible(false)
    setAddTaskModalVisible(true)
  }

  return (
    <>
      <div className='navbar'>
        <svg className='icon' onClick={() => { setActionsDrawerVisible(true) }} xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 20 14" fill="none">
          <path d="M1 1H19M1 7H19M1 13H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <Modal title="Add new task" footer={false} open={addTaskModalVisible} closable={true} onCancel={() => { setAddTaskModalVisible(false) }}>
        <AddTaskForm loadTasks={loadTasks} />
      </Modal>
      <Drawer onClose={() => { setActionsDrawerVisible(false) }} className='actions_drawer' open={actionsDrawerVisible} placement='left' title="Action Menu">
        <ul className='actions_menu'>
          <li onClick={startNewTask}>
            Add new task
          </li>
          <Popconfirm
            title="Watch out!"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            description="Are you sure you want to delete all tasks?"
            onConfirm={clearDB}
          >
            <li>
              Delete all tasks
            </li>
          </Popconfirm>
          <Popconfirm
            title="Watch out!"
            icon={<QuestionCircleOutlined style={{ color: "yellow" }} />}
            description="Are you sure you want to change the status of all items to deleted?"
            onConfirm={deleteCompletedItems}
          >
            <li>
              Change all completed to deleted
            </li>
          </Popconfirm>
        </ul>
      </Drawer>
      {
        loadingTasks ? <Loading /> : <TasksTile tasks={tasks} loadTasks={loadTasks} />
      }
      <div style={{ display: "flex", gap: "30px" }}>
        <h2>
          Active: {tasks.filter(task => task.status === "Active").length}
        </h2>
        <h2>
          Done: {tasks.filter(task => task.status === "Done").length}
        </h2>
        <h2>
          Deleted: {tasks.filter(task => task.status === "Deleted").length}
        </h2>
      </div>
    </>
  )
}

export default App
