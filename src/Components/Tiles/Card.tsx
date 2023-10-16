import { TasksDB } from "../../lib/TasksDB"
import { TaskType } from "../../types/TaskType"
import { Notify } from "../../lib/Notify"
import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Switch, notification } from 'antd'
export const ItemTypes = {
    CARD: 'card',
}


const style = {
    border: '1px solid gray',
    backgroundColor: 'white',
    cursor: 'move',
}

export interface CardProps {
    id: any
    task: TaskType
    index: number
    moveCard: (dragIndex: number, hoverIndex: number, task: TaskType) => void,
    loadTasks:any
}

interface DragItem {
    index: number
    id: string
    type: string
}

export const Card: FC<CardProps> = ({ id, task, index, moveCard, loadTasks }) => {
    const ref = useRef<HTMLDivElement>(null)
    const data = task
    
    const [taskData, setTaskData] = useState<any>(data)
    useEffect(() => { 
        setTaskData(data)
    }, [data])
    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex, task)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    const updateTask = async (e: any, value: any, taskInfo: TaskType) => {
        e.preventDefault()
        try {
            const DB = await TasksDB()
            const newStatus = value ? "Active" : "Done"
            const { UpdateTask } = DB
            taskInfo.status = newStatus
            const updatedTask: any = await UpdateTask({ ...taskInfo })
            if (updatedTask.status) {
                loadTasks()
                Notify("success", `Task changed to ${newStatus}`)
            } else {
                notification["error"]({
                    message: updatedTask.message,
                    placement: "top"
                })
            }

        } catch (error) {
            notification["error"]({
                message: "Could not update tasks.",
                description: "Please contact the administrator",
                placement: "top"
            })
        }
    }

    return (
        <div ref={ref} className='regular-tile' style={{ ...style, opacity }} data-handler-id={handlerId}>
            <h2>{task.name}</h2>
            <p><b>Due date:</b> <br /> {new Date(task.due_date).toLocaleString("en-GB")}</p>
            <p><b>Priority:</b> <br /> {task.priority}</p>
            <p>
                <b>Status:</b>
                <br />
                {
                    taskData.status === "Deleted" ? <p>Deleted</p> :
                        <Switch onClick={(value: any, e: any) => { updateTask(e, value, task) }} defaultChecked={task.status === "Active"} checkedChildren="Active" unCheckedChildren="Done" />
                }
            </p>
        </div>
    )
}
