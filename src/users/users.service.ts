import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './user.model'
import { Model } from "mongoose"
import * as bcrypt from 'bcrypt'

type UserServiceResponse = {
  user?: User,
  error?: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) { }

  async getAllUsers():Promise<User[]> {
    return await this.userModel
      .find()
      .populate([
        {
          path: 'teacher',
          populate: {
            path: 'classesAsTeacher'
          }
        },
        {
          path: 'student',
          populate: {
            path: 'classesAsStudent'
          }
        }
      ])
  }

  async createUser(username: string, password: string, repeatPassword: string):Promise<UserServiceResponse> {
    username.toLowerCase()

    const isUsernameTaken = await this.userModel.findOne({username: username}).exec()
    
    if (username.length < 4) {
      return {error: 'Username must be at least 4 characters'}
    }

    if (isUsernameTaken) {
      return {error: 'Username is taken'}
    }

    if (password.length < 8) {
      return {error: 'Password length at least must be 8 character'}
    }

    if (password !== repeatPassword) {
      return {error: 'Passwords are not same'}
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new this.userModel ({
      username: username,
      password: hashedPassword
    })

    return {user: await user.save()}
  }

  async login(username: string, password: string): Promise<UserServiceResponse> {
    username.toLowerCase()
    
    const isUserExist = await this.userModel
      .findOne({username: username})
      .populate([
        {
          path: 'teacher',
          populate: {
            path: 'classesAsTeacher'
          }
        },
        {
          path: 'student',
          populate: {
            path: 'classesAsStudent'
          }
        }
      ])
      .exec()
  
    if (!isUserExist) {
      return {error: 'User with this username does not exist'}
    }

    const isPasswordValid = await bcrypt.compare(password, isUserExist.password)

    if (!isPasswordValid) {
      return {error: 'Password is wrong'}
    }

    return {user: isUserExist}
  }
}
