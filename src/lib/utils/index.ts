import { redirect } from '@sveltejs/kit'
import type { AuthUser } from '@prisma/client'

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
