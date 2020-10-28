import { User } from "./users/user.model"
import { Class } from "./classes/class.model";
import { Task } from "./tasks/task.model";

export interface ServerResponse {
  success: boolean
  user?: User
  users?: User[]
  class?: Class
  classes?: Class[]
  task?: Task
  tasks?: Task[]
  error?: string
}