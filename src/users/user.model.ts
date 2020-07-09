import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  email: {
    type: String
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  theme: {
    type: String
  },
  language: {
    type: String
  },
  registerDate: {
    type: String,
    default: new Date
  },
  role: {
    type: String,
    default: 'user'
  },
  teacher: {
    classesAsTeacher: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }]
  },
  student: {
    classesAsStudent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }]
  }
})

export interface User extends mongoose.Document {
  _id: string
  email: string
  isEmailConfirmed: boolean
  username: string
  firstName: string
  lastName: string
  password: string
  theme: string
  language: string
  registerDate: string
  role: string
  // teacher: {
  //   classesAsTeacher: Class
  // }
  // student: {
  //   classesAsStudent: Class
  // }
}