import { User } from './User'

export type Relationship = {
  userId: string
  friend: User[]
  requested: User[]
  blocking: User[]
  blocked: User[]
}

export const RelationshipSeed: Relationship = {
  userId: '',
  friend: [],
  requested: [],
  blocking: [],
  blocked: []
}
