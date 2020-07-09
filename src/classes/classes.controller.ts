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

}
