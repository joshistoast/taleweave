import { redirect } from '@sveltejs/kit'
import type { AuthUser, Rating } from '@prisma/client'

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
