import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { TasksService } from './tasks.service';
import { ServerResponse } from '../response.model'
import { Task } from './task.model'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('get-tasks-by-classId/:classId')
  async getTasksByClassId(
    @Param('classId') classId: string
  ):Promise<ServerResponse> {
    const tasks = await this.tasksService.getAllTasksByClassId(classId)
    return {success: true, tasks}
  }

  @Post('create-task')
  async createTask(
    @Body('task') task: Task
  ): Promise<ServerResponse> {
    const response = await this.tasksService.createTask(task)

    return {success: true, task: response.task}
  }

  @Delete('remove-task/:taskId')
  async removeTask(
    @Param('taskId') taskId: string
  ): Promise<ServerResponse> {
    await this.tasksService.removeTask(taskId)

    return {success: true}
  }

  @Delete('remove-task-by-classId/:classId')
  async removeTaskByClassId(
    @Param('classId') classId: string
  ): Promise<ServerResponse> {
    await this.tasksService.removeTaskByClassId(classId)

    return {success: true}
  }

  @Put('change-task-info/:taskId')
  async changeTaskInfo(
    @Param('taskId') taskId: string,
    @Body('task') newTaskData: Task
  ): Promise<ServerResponse> {
    const res = await this.tasksService.changeTask(taskId, newTaskData)

    if (res.success) {
      return {success: true}
    }

    return {success: false, error: res.msg }
  }

}
