import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Class } from './class.model'
import { Model } from 'mongoose'
import { User } from 'src/users/user.model'

type ClassServiceResponse = {
  class?: Class
  error?: string
}

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('User') private readonly userModel: Model<User>
  ) { }

  async getAll():Promise<Class[]>{
    return await this.classModel.find()
  }

  async createClass(name: string, ownerId: string):Promise<ClassServiceResponse> {
    const newClass = new this.classModel ({
      class_name: name,
      class_owner: ownerId,
    })

    const createdClass = await newClass.save()

    await this.userModel.findOneAndUpdate(
      {_id: ownerId},
      {$push: {"teacher.classesAsTeacher": createdClass._id}}
      )

    return {class: createdClass}
  }

  async removeClass(classId: string, userId: string):Promise<{success: boolean, msg?: string}> {
    const existedClass = await this.classModel.findOne({_id: classId})

    if (!existedClass || !existedClass.class_owner) {
      return {success: false, msg: 'Something went wrong'}
    }

    if (existedClass.class_owner.toString() !== userId) {
      return {success: false, msg: 'Permission denied'}
    }
    
    const classRes = await this.classModel
      .findOneAndDelete({_id: classId})
    
    if (!classRes) {
      return {success: false, msg: 'Something went wrong'}
    }

    const userRes = await this.userModel
      .findOneAndUpdate(
        {_id: userId},
  			{ $pull: { "teacher.classesAsTeacher": classId } }
      )

    if (!userRes) {
      return {success: false, msg: 'Something went wrong'}
    }

    return {success: true}
  }
}
