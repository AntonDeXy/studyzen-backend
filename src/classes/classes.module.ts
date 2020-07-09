import { Module } from '@nestjs/common'
import { ClassesController } from './classes.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ClassSchema } from './class.model'
import { ClassesService } from './classes.service'
import { UserSchema } from '../users/user.model'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [ClassesController],
  providers: [ClassesService]
})
export class ClassesModule {}
