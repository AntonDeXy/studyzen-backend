import * as mongoose from 'mongoose'
import { User } from 'src/users/user.model'

export const ClassSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true
  },
  class_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isOpen: {
    type: Boolean,
    default: false
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: String,
    default: new Date
  }
})

export interface Class extends mongoose.Document {
  _id: string
  class_name: string
  class_owner: User
  // teachers: Teacher
  students: User
  isOpen: boolean
  // tasks: Task
  createdAt: string
}