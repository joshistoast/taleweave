import type { RequestHandler } from './$types'
import { getAuthor } from '$lib/server/data'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
  const { username } = params

  const author = await getAuthor(username)

  if (!author?.id) {
    throw error(404, 'Author not found')
  }

  return new Response(JSON.stringify(author))
}
