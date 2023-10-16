import { Button, DatePicker, Form, Input, Select, notification } from "antd"
import { useForm } from "antd/es/form/Form"

import { TasksDB } from "../../../lib/TasksDB"
import { TaskType } from "../../../types/TaskType"

const priorities = [
    { label: "Critical", options: [{ label: 0, value: 0 }] },
    { label: "Very Important", options: [{ label: 1, value: 1 }, { label: 2, value: 2 }] },
    { label: "Important", options: [{ label: 3, value: 3 }, { label: 4, value: 4 }] },
    { label: "Normal", options: [{ label: 5, value: 5 }, { label: 6, value: 6 }] },
    { label: "Less Important", options: [{ label: 7, value: 7 }, { label: 8, value: 8 }, { label: 9, value: 9 }] },
    { label: "Very Unimportant", options: [{ label: 10, value: 10 }] },
]

const statuses = ["Active", "Deleted", "Done"]

export default function AddTaskForm({ ...props }) {

    const tasks = props.tasks
    const submitTask = async (form: TaskType) => {
        const DB = await TasksDB()
        const { AddTask } = DB
        try {
            const newTask = form
            const writeTaskToDB = await AddTask(newTask)
            if (writeTaskToDB.status) {
                const { loadTasks } = props
                notification["success"]({
                    message: "Task added",
                    placement: "top"
                })
                loadTasks()
                return { status: true, message: "Task added" }
            } else {
                notification["error"]({
                    message: "Could not create new task.",
                    description: writeTaskToDB.message || "",
                    placement: "top"
                })
                return { status: false, message: "Could not be added" }
            }
        } catch (error) {
            notification["error"]({
                message: "Unknown error please contact the administrator.",
                placement: "top"
            })
        }
    }

    const [addTaskForm] = useForm()
    return (
        <Form form={addTaskForm} onFinish={submitTask}>
            <div>
                <label>Text</label>
                <Form.Item name="name" rules={[{
                    validator: async (field: any, value) => {
                        if (tasks.map((task: any) => task[field.field]).includes(value)) {
                            return Promise.reject(new Error("Name must be unique."));
                        }
                    },
                }, { required: true, message: "Text is required." }]}>
                    <Input />
                </Form.Item>
            </div>
            <div>
                <label>Priority</label>
                <Form.Item name="priority" rules={[{ required: true, message: "Priority is required." }]}>
                    <Select options={priorities} showSearch />
                </Form.Item>
            </div>
            <div>
                <label>Status</label>
                <Form.Item name="status" rules={[{ required: true, message: "Status is required." }]}>
                    <Select showSearch>
                        {
                            statuses.map((status: string, i: number) => {
                                return (
                                    <Select.Option key={"status_option_" + i} value={status}>
                                        {status}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </div>
            <div>
                <label>Due date</label>
                <Form.Item name="due_date" rules={[{ required: true, message: "Due date is required" }]}>
                    <DatePicker showTime={true} style={{ width: "100%" }} />
                </Form.Item>
            </div>
            <Button htmlType="submit">Add task</Button>
        </Form>
    )
}