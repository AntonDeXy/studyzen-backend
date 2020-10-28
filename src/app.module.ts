import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { ClassesModule } from './classes/classes.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskResponsesModule } from './task-responses/task-responses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.60ao7.mongodb.net/test?retryWrites=true&w=majority`),
    UsersModule,
    ClassesModule,
    TasksModule,
    TaskResponsesModule
  ]
})

export class AppModule {}
