import type { Tag } from '@prisma/client'

export type IncompleteTag = {
  name: string
}
export type MaybeTag = Tag | IncompleteTag
