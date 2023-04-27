import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import {
  redirect,
  fail,
  error,
  type Actions
} from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const session = await locals.auth.validate()
  const { id } = params

  // check if post userid matches session userid
  if (!session) {
    const fromUrl = url.pathname + url.search
    throw redirect(302, `/login?redirectTo=${fromUrl}`)
  }

  const post = await db.post.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      author: true,
    }
  })

  if (!post) {
    throw error(404, 'Post not found')
  }
  if (post.authorId !== session.userId) {
    throw redirect(302, '/posts')
  }

  return {
    post,
  }
}

export const actions: Actions = {
  default: async ({ request, params }) => {
    //
  }
}
