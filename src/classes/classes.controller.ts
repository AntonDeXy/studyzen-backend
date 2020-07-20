import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common'
import { ClassesService } from './classes.service'
import { ServerResponse } from '../response.model'

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async getAllClasses():Promise<ServerResponse> {
    const classes = await this.classesService.getAll()

    return {success: true, classes: classes}
  }

  @Post('create')
  async createClass(
    @Body('name') name: string,
    @Body('ownerId') ownerId: string
  ):Promise<ServerResponse> {
    const response = await this.classesService.createClass(name, ownerId)

    if (response.error) {
      return {success: false, error: response.error}
    }

    return {success: true, class: response.class}

  }

  @Delete('remove/:classId/:userId')
  async removeClass(
    @Param('classId') classId: string,
    @Param('userId') userId: string
  ):Promise<ServerResponse> {
    const response = await this.classesService.removeClass(classId, userId)

    if (!response.success) {
      return {success: false, error: response.msg}
    } 

    return {success: true}
  }

  @Post('/add-teacher/')
  async addTeacher(
    @Body('classId') classId: string,
    @Body('userId') userId: string,
    @Body('teacherId') teacherId: string
  ): Promise<ServerResponse> {
    const response = await this.classesService.addTeacher(classId, userId, teacherId)

    if (!response.success) {
      return {success: false, error: response.msg}
    } 

    return {success: true}
    
  }

  @Post('/add-student/')
  async addStudent(
    @Body('classId') classId: string,
    @Body('studentId') studentId: string,
  ): Promise<ServerResponse> {
    const response = await this.classesService.addStudent(classId, studentId)

    if (!response.success) {
      return {success: false, error: response.msg}
    } 

    return {success: true}
    
  }


  @Post('/remove-teacher/')
  async removeTeacher(
    @Body('classId') classId: string,
    @Body('userId') userId: string,
    @Body('teacherId') teacherId: string
  ): Promise<ServerResponse> {
    const response = await this.classesService.removeTeacher(classId, userId, teacherId)

    if (!response.success) {
      return {success: false, error: response.msg}
    } 

    return {success: true}
    
  }

  @Post('/remove-student/')
  async removeStudent(
    @Body('classId') classId: string,
    @Body('userId') userId: string,
    @Body('studentId') studentId: string
  ): Promise<ServerResponse> {
    const response = await this.classesService.removeStudent(classId, userId, studentId)

    if (!response.success) {
      return {success: false, error: response.msg}
    } 

    return {success: true}
    
  }

  @Post('/change-open-status/')
  async changeOpenStatus(
    @Body('classId') classId: string,
    @Body('userId') userId: string,
    @Body('status') status: boolean
  ): Promise<ServerResponse> {
    
    const response = await this.classesService.changeClassIsOpenStatus(classId, userId, status)

    if (!response.success) {
      return {success: false, error: response.msg}
    } 

    return {success: true}
  }



}
