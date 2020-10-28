import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Task } from './task.model'
import { Model } from "mongoose"

type TaskServiceResponse = {
  success?: boolean
  task?: Task,
  tasks?: Task[],
  error?: string
  msg?: string
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>
  ) { }

  async getAllTasksByClassId(classId: string): Promise<Task[]> {
    return await this.taskModel
      .find({ class: classId })
      .populate([
        {
          path: 'responses'
        },
        {
          path: 'class'
        },
        {
          path: 'teacher'
        }
      ])
  }

  async createTask(task: Task): Promise<TaskServiceResponse> {
    const newTask = new this.taskModel({
      ...task
    })
    const response = await newTask.save()

    return { task: response }
  }

  async removeTask(taskId: string): Promise<TaskServiceResponse> {
    await this.taskModel.findOneAndDelete({ _id: taskId })
    return { success: true }
  }


  async removeTaskByClassId(classId: string): Promise<TaskServiceResponse> {
    await this.taskModel.deleteMany({ class: classId })
    return { success: true }
  }

  async changeTask(taskId: string, newTaskData: Task): Promise<TaskServiceResponse> {
    const task = await this.taskModel.findOne({ _id: taskId }).lean()
    const editedTask = { ...task }

    if (newTaskData.isTaskClosed) {
      editedTask.isTaskClosed = newTaskData.isTaskClosed
    }
    
    if (newTaskData.title) {
      editedTask.title = newTaskData.title
    }

    if (newTaskData.taskContent) {
      editedTask.taskContent = newTaskData.taskContent
    }

    if (newTaskData.maxGrade) {
      editedTask.maxGrade = newTaskData.maxGrade
    }

    if (newTaskData.deadline) {
      editedTask.deadline = newTaskData.deadline
    }

    const res = await this.taskModel.findOneAndUpdate(
      { _id: taskId }, {...editedTask}
    ).exec()

      if (!res) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }

  }
}
