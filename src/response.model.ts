import { User } from "./users/user.model"

export interface ServerResponse {
  success: boolean
  users?: User[]
  user?: User
  error?: string
}