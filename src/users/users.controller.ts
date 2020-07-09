import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ServerResponse } from '../response.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  async getUsers():Promise<ServerResponse> {
    const users = await this.usersService.getAllUsers()
    return {success: true, users}
  }

  @Post('register')
  async register(
    @Body('username') username: string, 
    @Body('password') password: string,
    @Body('repeatPassword') repeatPassword: string,
    ):Promise<ServerResponse | Error> {
    const response = await this.usersService.createUser(username, password, repeatPassword)

    if (response.error) {
      return {success: false, error: response.error}
    }
    return {success: true, user: response.user}
  }

  @Post('login')
  async login(
    @Body('username') username: string, 
    @Body('password') password: string 
    ):Promise<ServerResponse | Error> {
    const response = await this.usersService.login(username, password)
    if (response.error) {
      return {success: false, error: response.error}
    }
    return {success: true, user: response.user}
  }
}
