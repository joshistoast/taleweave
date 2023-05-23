import { redirect } from '@sveltejs/kit'
import type { AgeRating } from '@prisma/client'
import { z } from 'zod'
import forbiddenUsernames from './forbiddenUsernames'
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

export const truncate = (str: string, len: number) => {
  if (str.length <= len) {
    return str
  }
  return `${str.slice(0, len)}...`
}

export const timeAgo = (date: Date) => {
  const now = new Date()
  const theDate = new Date(date)
  const diffInSeconds = Math.floor((+now - +theDate) / 1000)

  let unit = 'second'
  let amount = diffInSeconds

  if (diffInSeconds < 60) {
    unit = 'second'
    amount = diffInSeconds
  } else if (diffInSeconds < 3600) {
    unit = 'minute'
    amount = Math.floor(diffInSeconds / 60)
  } else if (diffInSeconds < 86400) {
    unit = 'hour'
    amount = Math.floor(diffInSeconds / 3600)
  } else if (diffInSeconds < 604800) {
    unit = 'day'
    amount = Math.floor(diffInSeconds / 86400)
  } else if (diffInSeconds < 2628000) {
    unit = 'week'
    amount = Math.floor(diffInSeconds / 604800)
  } else if (diffInSeconds < 31536000) {
    unit = 'month'
    amount = Math.floor(diffInSeconds / 2628000)
  } else {
    unit = 'year'
    amount = Math.floor(diffInSeconds / 31536000)
  }

  if (amount > 1) unit += 's'
  if (amount === 0)
    return 'just now'
  else
    return `${amount} ${unit} ago`
}

export const useRating = (rating: AgeRating | string) => {
  switch (rating) {
    case 's':
      return 'Safe for All Ages'
    case 't':
      return 'Teen'
    case 'm':
      return 'Mature'
    case 'x':
      return 'Explicit (18+)'
    default:
      return 'Unknown'
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
    .string()
    .regex(/^(s|t|m|x)$/, { message: 'Rating must be s, t, m, or x' }),
  tags: z.string().refine(tags => {
    const tagNames = tags.split(',').map(tag => tag.trim());
    return tagNames.length <= 5;
  }, { message: 'You\'ve added too many tags, use 5 or less.' }),
})

export const validateUsername = z.object({
  username: z
    .string()
    .min(3, { message: 'Your username is too short' })
    .max(20, { message: 'Your username is too long' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Your username can only contain letters and numbers' })
    .refine(username => !forbiddenUsernames.includes(username), { message: 'This username is not allowed' }),
})

export const validatePassword = z.object({
  password: z
    .string()
    .min(8, { message: 'Your password is too short' })
    .max(100, { message: 'Your password is too long' }),
})

export const validateEmail = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
})

export const validateDisplayName = z.object({
  displayName: z
    .string()
    .min(3, { message: 'Your display must be at least 3 characters' })
    .max(20, { message: 'Your display name cannot be more than 20 characters' })
    .regex(/^[a-zA-Z0-9 ]+$/, { message: 'Your display name can only contain letters, numbers, and spaces' })
    .refine(displayName => {
      const words = displayName.split(' ');
      return !words.some(word => forbiddenUsernames.includes(word))
    }, { message: 'This display name is not allowed' }),
})

export const validateLogin = z.object({
  email: validateEmail.shape.email,
  password: validatePassword.shape.password,
})

export const validateSignup = z.object({
  username: validateUsername.shape.username,
  password: validatePassword.shape.password,
  email: validateEmail.shape.email,
})

export const validateBio = z.object({
  bio: z
    .string()
    .max(1000, { message: 'Your bio is too long' }),
})

export const validateUserPreferences = z.object({
  displayName: validateDisplayName.shape.displayName,
  bio: validateBio.shape.bio,
})
