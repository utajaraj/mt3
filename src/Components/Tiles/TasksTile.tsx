import { Modal, notification } from "antd";
import { TaskType } from "../../types/TaskType";
import "./styles.css";
import AddTaskForm from "../Forms/Tasks/AddTaskForm";
import { useState, useCallback, useEffect } from "react";
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import dayjs from "dayjs";
dayjs.extend(isTomorrow)
dayjs.extend(isToday)


import { TasksDB } from "../../lib/TasksDB"

interface TilePropsInterface {
  tasks: TaskType[] | []
  loadTasks: any,
  setAddTaskModalVisible?: any,
  filter: boolean
}

import update from 'immutability-helper'

import { Card } from './Card'



export interface Item {
  id: number
  text: string
}

export interface ContainerState {
  cards: Item[]
}

const wait = async () => {
  setTimeout(() => {
    return true
  }, 2000)
}
export const Container: any = (props: TilePropsInterface) => {
  const tasks: TaskType[] = props.tasks
  const filter: boolean = props.filter
  const loadTasks: any = props.loadTasks
  const [cards, setCards] = useState(tasks)
  useEffect(() => {
    setCards(tasks)
  }, [filter, tasks])

  const updatedTask = async (task: any, otherItemOrder: number, order: number) => {
    const DB = await TasksDB()
    const { UpdateTask } = DB
    const newTask = { ...task }
    const otherItem = tasks.filter(x => x.order === otherItemOrder)[0]
    const newOtherItem = { ...otherItem }
    newOtherItem.order = task.order
    newTask.order = order
    const one = await UpdateTask(newOtherItem)
    await wait()
    console.log("here")
    const two = await UpdateTask(newTask)
    if (one.status && two.status) {
      notification.success({ message: "Order updated" })
    }
  }
  const moveCard = useCallback((dragIndex: number, hoverIndex: number, task: any) => {
    const cards = (prevCards: any[]) => {
      updatedTask(task, hoverIndex, dragIndex)
      return update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Item],
        ],
      })
    }
    setCards(cards)
  }, [])


  return (
    <>
      {cards.map((task: any, index: number) => {
        return (
          <Card
            key={`task_card_${task.task_id}`}
            index={index}
            id={`task_card_${task.task_id}`}
            task={task}
            moveCard={(d: number, h: number, task: any) => { moveCard(d, h, task) }}
            loadTasks={loadTasks}
          />
        )
      })
      }
    </>
  )

}


export default function TasksTile(props: TilePropsInterface) {
  const { tasks, loadTasks, filter } = props
  const [data, setData] = useState(tasks)
  const [addTaskModalVisible, setAddTaskModalVisible] = useState<boolean>(false)
  const closeModal = () => {
    setAddTaskModalVisible(false)
  }

  useEffect(() => {
    setData(tasks)
  }, [props.tasks])
  return (
    <div className="my-tiles">
      <Modal title="Add new task" footer={false} open={addTaskModalVisible} closable={true} onCancel={closeModal}>
        <AddTaskForm loadTasks={loadTasks} tasks={tasks} />
      </Modal>
      <div className="regular-tiles">
        <div
          className={`tile`}
          onClick={() => { setAddTaskModalVisible(true) }}
        >
        </div>
        <Container filter={filter} tasks={data} loadTasks={loadTasks} />
      </div>


    </div>
  );
}
