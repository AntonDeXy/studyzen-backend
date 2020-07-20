import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Class } from './class.model'
import { Model } from 'mongoose'
import { User } from 'src/users/user.model'
import { stat } from 'fs'

type ClassServiceResponse = {
  class?: Class
  error?: string
}

type ReturnSuccessAndMsg = {
  success: boolean
  msg?: string
}

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('User') private readonly userModel: Model<User>
  ) { }

  async getAll(): Promise<Class[]> {
    return await this.classModel.find()
  }

  async createClass(name: string, ownerId: string): Promise<ClassServiceResponse> {
    const newClass = new this.classModel({
      class_name: name,
      class_owner: ownerId,
    })

    const createdClass = await newClass.save()

    await this.userModel.findOneAndUpdate(
      { _id: ownerId },
      { $push: { "teacher.classesAsTeacher": createdClass._id } }
    )

    return { class: createdClass }
  }

  async removeClass(classId: string, userId: string): Promise<ReturnSuccessAndMsg> {
    const existedClass = await this.classModel.findOne({ _id: classId })

    if (!existedClass || !existedClass.class_owner) {
      return { success: false, msg: 'Something went wrong' }
    }

    if (existedClass.class_owner.toString() !== userId) {
      return { success: false, msg: 'Permission denied' }
    }

    const classRes = await this.classModel
      .findOneAndDelete({ _id: classId })

    if (!classRes) {
      return { success: false, msg: 'Something went wrong' }
    }

    const userRes = await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { $pull: { "teacher.classesAsTeacher": classId } }
      )

    if (!userRes) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }
  }

  async addTeacher(classId: string, userId: string, teacherId: string): Promise<ReturnSuccessAndMsg> {
    const isClassExist = await this.classModel.findOne({ _id: classId })

    if (!isClassExist || !isClassExist.class_owner) {
      return { success: false, msg: 'Something went wrong' }
    }

    if (isClassExist.class_owner.toString() !== userId) {
      return { success: false, msg: 'Permission denied' }
    }

    let isTeacherAlreadyAdded = false

    isClassExist.teachers.forEach(teacher => {
      if (teacher.toString() === teacherId) {
        isTeacherAlreadyAdded = true
      }
    })

    if (isTeacherAlreadyAdded) {
      return { success: false, msg: 'This teacher already added' }
    }

    const res = await this.classModel.findOneAndUpdate(
      { _id: classId },
      { $push: { teachers: teacherId } }
    )


    if (!res) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }
  }

  async addStudent(classId: string, studentId: string): Promise<ReturnSuccessAndMsg> {
    const isClassExist = await this.classModel.findOne({ _id: classId })

    if (!isClassExist) {
      return { success: false, msg: 'Something went wrong' }
    }

    let isUserAlreadyInClass = false

    isClassExist.students.forEach(student => {
      if (student === studentId) {
        isUserAlreadyInClass = true
      }
    })

    if (isUserAlreadyInClass) {
      return { success: false, msg: 'You are already in this class' }
    }

    if (!isClassExist.isOpen) {
      return { success: false, msg: 'This class is close, please contact with class owner' }
    }

    const res = await this.classModel.findOneAndUpdate(
      { _id: classId },
      { $push: { students: studentId } }
    )

    if (!res) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }

  }

  async removeTeacher(classId: string, userId: string, teacherId: string): Promise<ReturnSuccessAndMsg> {
    const isClassExist = await this.classModel.findOne({ _id: classId })

    if (!isClassExist || !isClassExist.class_owner) {
      return { success: false, msg: 'Something went wrong' }
    }

    if (isClassExist.class_owner.toString() !== userId) {
      return { success: false, msg: 'Permission denied' }
    }

    let isTeacherAdded = false

    isClassExist.teachers.forEach(teacher => {
      if (teacher.toString() === teacherId) {
        isTeacherAdded = true
      }
    })

    if (!isTeacherAdded) {
      return { success: false, msg: 'This teacher not found' }
    }

    const res = await this.classModel.findOneAndUpdate(
      {_id: classId},
      { $pull: {teachers: teacherId} }
    )

    if (!res) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }

  }


  async removeStudent(classId: string, userId: string, studentId: string): Promise<ReturnSuccessAndMsg> {
    const isClassExist = await this.classModel.findOne({ _id: classId })

    if (!isClassExist || !isClassExist.class_owner) {
      return { success: false, msg: 'Something went wrong' }
    }

    if (isClassExist.class_owner.toString() !== userId) {
      return { success: false, msg: 'Permission denied' }
    }

    let isStudentAdded = false

    isClassExist.students.forEach(student => {
      if (student.toString() === studentId) {
        isStudentAdded = true
      }
    })

    if (!isStudentAdded) {
      return { success: false, msg: 'This student not found' }
    }

    const res = await this.classModel.findOneAndUpdate(
      {_id: classId},
      { $pull: {students: studentId} }
    )

    if (!res) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }

  }

  async changeClassIsOpenStatus(classId: string, userId: string, status: boolean) {
    const isClassExist = await this.classModel.findOne({ _id: classId })

    if (!isClassExist || !isClassExist.class_owner) {
      return { success: false, msg: 'Something went wrong' }
    }

    if (isClassExist.class_owner.toString() !== userId) {
      return { success: false, msg: 'Permission denied' }
    }

    const res = this.classModel.findOneAndUpdate(
      {_id: classId},
      {isOpen: status }
    ).exec()

    if (!res) {
      return { success: false, msg: 'Something went wrong' }
    }

    return { success: true }
  }

}
