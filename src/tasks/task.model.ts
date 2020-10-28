import * as mongoose from 'mongoose'
import { Class } from 'src/classes/class.model'
// import { TaskResponse } from 'src/task-responses/task-response.model'
import { User } from 'src/users/user.model'

export const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  taskContent: {
    type: String,
    required: true
  },
  maxGrade: {
    type: Number,
    required: true
  },
  // responses: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'TaskResponse' 
  // }],
  isTaskClosed: {
    type: Boolean,
    default: false
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  deadline: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: new Date
  }
})

export interface Task extends mongoose.Document {
  _id: string
  title: string
  taskContent: string
  maxGrade: number
  // responses: TaskResponse
  isTaskClosed: boolean
  class: Class
  teacher: User
  deadline: string
  createdAt: string
}