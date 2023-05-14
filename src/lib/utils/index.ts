import { redirect } from '@sveltejs/kit'
import type { AuthUser, Rating } from '@prisma/client'
import { z } from 'zod'
export * from './types'

export const doRedirect = (url: URL, hasSession: boolean) => {
  const redirectTo = url.searchParams.get('redirectTo')
  if (hasSession) {
    if (redirectTo?.length) {
      throw redirect(302, `/${redirectTo.slice(1)}`)
    } else {
      throw redirect(302, '/')
    }
  }
}

export const useAuthorName = (author: AuthUser) => {
  return author.displayName || author.username
}

export const truncate = (str: string, len: number) => {
  if (str.length <= len) {
    return str
  }
  return `${str.slice(0, len)}...`
}

export const useRating = (rating: Rating | string) => {
  switch (rating) {
    case 's':
      return 'Safe for All Ages'
    case 't':
      return 'Teen'
    case 'm':
      return 'Mature'
    case 'e':
      return 'Explicit (18+)'
    default:
      return 'Unknown'
  }
}

export const useRatingIcon = (rating: Rating | string) => {
  switch (rating) {
    case 's':
      return 'fluent:people-24-filled'
    case 't':
      return 'material-symbols:generating-tokens-rounded'
    case 'm':
      return 'fluent:rating-mature-24-filled'
    case 'e':
      return 'material-symbols:explicit-rounded'
  }
}

export const clickOutside = (node: Element) => {

  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('clickOutside', {
          detail: { source: node }
        })
      )
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}

export const validatePost = z.object({
  title: z
    .string()
    .min(5, { message: 'Your title is too short' })
    .max(100, { message: 'Your title is too long' })
    .regex(/^[a-zA-Z0-9 ]+$/, { message: 'Your title can only contain letters, numbers, and spaces' }),
  description: z.optional(z
    .string()
    .max(100, { message: 'Your description is too long' })
  ),
  content: z
    .string()
    .min(50, { message: 'Your story is too short' }), //TODO: get actual character count from richtext
  published: z
    .string()
    .regex(/^(true|false)$/, { message: 'Published must be true or false' }),
  rating: z
    .string(),
  tags: z.string().refine(tags => {
    const tagNames = tags.split(',').map(tag => tag.trim());
    return tagNames.length <= 5;
  }, { message: 'You\'ve added too many tags, use 5 or less.' }),
})
