import { User } from "./users/user.model"
import { Class } from "./classes/class.model";

export interface ServerResponse {
  success: boolean
  users?: User[]
  class?: Class
  classes?: Class[]
  user?: User
  error?: string
}