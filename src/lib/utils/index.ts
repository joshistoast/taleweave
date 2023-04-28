import { redirect } from '@sveltejs/kit'

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
